// --- Utilitários (Movidos de script.js) ---

import {$, fmt, log, toDateKey } from './utils.js'

let cache={
  vestingSharePrice: null,
  allastFetch: [],
  allvoteFetch: [],
  allauthorFetch: [],
  allcurationFetch: [],
  TotalPedingResultPost: [],
  TotalPedingResultComment: [],
  allvotesEstimate: [],
  vestingSharePrice: null,
};

// --- Funções da Blockchain (Acesso à API RPC) ---

/**
 * Faz uma chamada JSON-RPC para o nodo especificado.
 * @param {string} rpc - URL do nodo RPC.
 * @param {string} method - Método da API a ser chamado (ex: condenser_api.get_account_history).
 * @param {Array} params - Parâmetros do método.
 * @returns {Promise<any>} O resultado da chamada RPC.
 */
export function rpcCall(rpc, method, params) {
    return fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
    }).then(r => r.json()).then(j => {
        if (j.error) throw new Error(JSON.stringify(j.error));
        return j.result;
    });
}

/**
 * Busca e processa o histórico de recompensas da conta.
 * @param {string} account - Nome da conta.
 * @param {string} rpc - URL do nodo RPC.
 * @returns {Promise<{daysMapCuration: object, daysMapAuthor: object}>} Mapas de recompensas por dia.
 */
export async function getRewardHistory(account, rpc) {
    log('Buscando account_history...');
    // Busca as últimas 1000 operações
    //const history = await rpcCall(rpc, 'condenser_api.get_account_history', [account, -1, 1000]);

    const history = await getAccountHistoryLast30Days(account, rpc);
    log('ops recebidas:', history.length);

    //console.log('history');
    console.log(history);

    const now = new Date();
    const daysMapCuration = {};
    const daysMapAuthor = {};
    
    // Inicializa o mapa com os últimos 30 dias
    for (let i = 0; i < 30; i++) { 
        const d = new Date(); 
        d.setDate(now.getDate() - i); 
        const k = toDateKey(d.toISOString()); 
        daysMapCuration[k] = 0; 
        daysMapAuthor[k] = 0; 
    }
    history.forEach(entry => {
        try {
            const op = entry[1].op[0];
            const data = entry[1].op[1];

            if (op === 'curation_reward' || op === 'author_reward') {
                let rewardStr = '';

                // 2. CORREÇÃO: Define rewardStr LOCALMENTE com base na operação
                if(op === 'author_reward'){
                    // Use o campo correto para author_reward (blurt_payout)
                    rewardStr = data.blurt_payout.split(' ')[0] || '0.000'; 
                    rewardStr = parseFloat(rewardStr); 
                }
                if(op === 'curation_reward'){
                    // Use o campo correto para curation_reward (reward)
                    rewardStr = data.reward.split(' ')[0] || '0.000';
                    rewardStr = parseFloat(rewardStr); 
                    rewardStr = rewardStr *1.15;
                }

                const ts = entry[1].timestamp;
                const key = toDateKey(ts);

                // Chama a função fmt e converte para número
                const val = rewardStr;
              
                if (op === 'curation_reward' && key in daysMapCuration) {
                    daysMapCuration[key] += val;
                }
                if (op === 'author_reward' && key in daysMapAuthor) {
                    daysMapAuthor[key] += val;
                }
            }
        } catch (e) { /* ignore entries we can't parse */ }
    });

    return { daysMapCuration, daysMapAuthor };
}

async function fetchRecursivePending(rpc, apiMethod, query, nowMs, sevenDaysMs, curationRatio, account) {
    let totalPendingAuthor = 0;
    let totalPendingCuration = 0;
    let shouldFetchMore = true;
    let currentQuery = { ...query };


    const DataNow = Date.now();
    const setedias = 7 * 24 * 60 * 60 * 1000;

    while (shouldFetchMore) {
        log(`Buscando ${apiMethod} com start_permlink: ${currentQuery.start_permlink || 'Nenhum'}`);

        const results = await rpcCall(rpc, apiMethod, [currentQuery]);


        console.log(results);

        if (!results || results.length === 0) {
            shouldFetchMore = false;
            break;
        }

        for (const item of results) {
            try {
                // Os dados já vêm na resposta principal, não é necessário get_content
                const pendingStr = item.pending_payout_value || '0.000 BLURT';
                const cashout = item.cashout_time; // ex: "2025-11-01T12:00:00"
                const cashMs = new Date(cashout).getTime();
                console.log("tA INDOOOOOOOOOOOO?");

                const createdbase = new Date(item.created).getTime();

                console.log(item);
                
                // 1. Verifica se o post ainda está pendente E dentro da janela de 7 dias
                if (!isNaN(createdbase) && (createdbase+setedias) >= DataNow) {

                    console.log("Aqui tA PASSANDO?");

                    if(item &&item.author === account && (createdbase+setedias) >= DataNow){
                        if(apiMethod === "condenser_api.get_discussions_by_blog"){
                          console.log("que ta acontenceod");
                          console.log(item);
                          cache.TotalPedingResultPost.push(item);
                        } else if(apiMethod === "condenser_api.get_discussions_by_comments"){
                          cache.TotalPedingResultComment.push(item);
                        } else{

                        }

                        const pendingVal = parseFloat(fmt(pendingStr));

                        totalPendingAuthor += pendingVal/2;
                        // Estimativa da porção de curation (baseada no seu curationRatio)
                        totalPendingCuration =0;
                    }

                } else {
                    // O post é mais antigo que 7 dias, podemos parar de buscar
                    shouldFetchMore = false;
                    break; // Sai do loop 'for'
                }

            } catch (e) {
                log('Erro ao processar item:', item.author, item.permlink, e.message);
            }
        }

        // 2. Prepara para a próxima iteração recursiva (while loop)
        if (shouldFetchMore && results.length === currentQuery.limit) {
            const lastItem = results[results.length - 1];
            
            // Define os parâmetros de paginação para a próxima busca
            currentQuery.start_author = lastItem.author;
            currentQuery.start_permlink = lastItem.permlink;
        } else {
            // Se o lote veio incompleto (ex: 30 resultados em um limite de 100)
            // ou se saímos por causa da data, paramos o 'while'
            shouldFetchMore = false;
        }
    }
    console.log('cache.TotalPedingResultPost');
    console.log(cache.TotalPedingResultPost);
    
        console.log("cache.TotalPedingResultComment");
            console.log(cache.TotalPedingResultComment);

    return { totalPendingAuthor, totalPendingCuration };
}


/**
 * Busca posts E comentários recentes e calcula as recompensas pendentes (pending payouts)
 * de forma recursiva até encontrar posts mais velhos que 7 dias.
 * * @param {string} account - Nome da conta.
 * @param {string} rpc - URL do nodo RPC.
 * @returns {Promise<{pendingAuthorSum: number, pendingCurationEstimate: number}>} As somas pendentes.
 */
export async function getPendingRewards(account, rpc) {

    
    log('Buscando recompensas pendentes (posts e comentários)...');
    
    const nowMs = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const curationRatio = 0.25; // Heurística de estimativa
    const queryLimit = 100; // Limite por página

    // 1. Query para POSTS (get_discussions_by_blog)
    const blogQuery = { tag: account,limit: queryLimit,start_author: undefined,start_permlink: undefined};
    
    // 2. Query para COMENTÁRIOS (get_discussions_by_comments)
    const commentsQuery = {start_author: account,limit: queryLimit,start_permlink: undefined,};

    log('--- Iniciando busca por POSTS pendentes ---');
    const discussionsResults = await fetchRecursivePending( rpc, 'condenser_api.get_discussions_by_blog', blogQuery, nowMs, sevenDaysMs, curationRatio,account);

    log('--- Iniciando busca por COMENTÁRIOS pendentes ---');
    const commentsResults = await fetchRecursivePending(rpc, 'condenser_api.get_discussions_by_comments', commentsQuery, nowMs, sevenDaysMs, curationRatio,account );

    console.log('discussionsResults');
    console.log('commentsResults');
    console.log(discussionsResults);
    console.log(commentsResults);


    const curationResults = await getEstimatedCurationRewards(account, rpc);

    const estimatedVotes = curationResults.cacheallvotesEstimate; //


    const pendingCurationDailyMap = {};

    // Calcula o dia de cashout para cada voto
    estimatedVotes.forEach(vote => {
        const cashoutMs = new Date(vote.cashout_time).getTime();
        const nowMs = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        
        // Verifica se o cashout está no futuro e dentro dos próximos 7 dias
        // (Nota: toDateKey deve ser importado de './utils.js')
        if (cashoutMs > nowMs && (cashoutMs - nowMs) <= sevenDaysMs) {
            const cashoutKey = toDateKey(vote.cashout_time);
            
            // Inicializa ou soma
            pendingCurationDailyMap[cashoutKey] = (pendingCurationDailyMap[cashoutKey] || 0) + vote.estimatedReward;
        }
    });


    // 3. Soma os resultados
    const pendingAuthorSum = discussionsResults.totalPendingAuthor + commentsResults.totalPendingAuthor;
    const pendingCurationEstimate = curationResults.estimatedTotalReward;
    //const pendingCurationEstimate = 0;
    log('Busca de pendentes concluída.');

    return { pendingAuthorSum, pendingCurationEstimate, pendingCurationDailyMap };
}


/**
 * Busca e estima a recompensa de curadoria (curation rewards) que a conta
 * receberá dos votos dados nos últimos 7 dias.
 * @param {string} account - Nome da conta (voter).
 * @param {string} rpc - URL do nodo RPC.
 * @param {number} vestingPrice - Taxa de conversão VESTS para BLURT.
 * @returns {Promise<{totalVotes: number, estimatedRewardBLURT: number}>} As somas estimadas.
 */
export async function getEstimatedCurationRewards(account, rpc, vestingPrice = 1.15) {
    log('Buscando histórico de VOTOS dos últimos 7 dias...');

    const nowMs = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const minTimeMs = nowMs - sevenDaysMs;
    const historyLimit = 1000;

    //const history = await rpcCall(rpc, 'condenser_api.get_account_history', [account, -1, historyLimit, 1]);

    const history = cache.allvoteFetch;

    log(`Ops recebidas: ${history.length}. Filtrando votos...`);

    let estimatedTotalReward = 0;
    let totalVotes = 0;
    const recentVotes = [];
    cache.allvotesEstimate = []; // Limpa o cache a cada execução

    // NÃO usar break aqui — colecione votos dentro da janela
    for (const entry of history) {
        try {
            const op = entry[1].op[0];
            const data = entry[1].op[1];
            const ts = entry[1].timestamp;
            const opTimeMs = new Date(ts).getTime();

            // Se for mais antigo que 7 dias, só ignora (não quebra), pois ordem pode ser antiga->nova
            if (opTimeMs < minTimeMs) continue;

            if (op === 'vote') {
                recentVotes.push({
                    author: data.author,
                    permlink: data.permlink,
                    weight: data.weight,
                    timeMs: opTimeMs
                });
            }
        } catch (e) { /* ignorar */ }
    }

    totalVotes = recentVotes.length;
    log(`Votos recentes (7d) encontrados: ${totalVotes}`);

    // Para cada voto, busca o conteúdo e os votos ativos para calcular fração por rshares
    for (const vote of recentVotes) {
        try {
            const content = await rpcCall(rpc, 'condenser_api.get_content', [vote.author, vote.permlink]);
            if (!content) continue;

            // Se não há pending payout, pula
            const pendingStr = content.pending_payout_value || '0.000 BLURT';
            const pendingVal = parseFloat(fmt(pendingStr));
            if (pendingVal <= 0) continue;

            // pool de curadoria aproximado
            const totalCurationPool = pendingVal * 0.50; // Aproximadamente 50% do pending payout

            // pega votos ativos para calcular rshares
            //const activeVotes = await rpcCall(rpc, 'condenser_api.get_active_votes', [vote.author, vote.permlink]);
            const activeVotes = content.active_votes;
            if (!Array.isArray(activeVotes) || activeVotes.length === 0) {
                // sem dados de votos, adiciona uma fração conservadora (ex: 0)
                continue;
            }

            // soma rshares (usar valor absoluto)
            let sumRshares = 0n;
            let myRshares = 0n;
            for (const v of activeVotes) {
                // rshares pode ser string ou número; usar BigInt para soma segura
                const r = BigInt(v.rshares || '0');
                sumRshares += (r < 0n ? -r : r);
                if (v.voter === account) myRshares = (r < 0n ? -r : r);
            }

            if (sumRshares === 0n || myRshares === 0n) continue;

            // fração e recompensa estimada
            const fraction = Number(myRshares) / Number(sumRshares);
            const estimatedReward = totalCurationPool * fraction;

                cache.allvotesEstimate.push({
                    author: vote.author,
                    permlink: vote.permlink,
                    weight: vote.weight,
                    timeMs: vote.timeMs,
                    estimatedReward: estimatedReward,
                    cashout_time: content.cashout_time,
                    author: content.author,
                    created: content.created,
                    net_rshares: content.net_rshares,
                    pending_payout_value: content.pending_payout_value,
                    
                });
            estimatedTotalReward += estimatedReward;

        } catch (e) {
            log(`Erro ao estimar voto @${vote.author}/${vote.permlink}: ${e.message}`);
        }
    }

    log(`Estimativa de recompensa de curadoria (7d): ${estimatedTotalReward.toFixed(3)} BLURT`);


    const cacheallvotesEstimate = cache.allvotesEstimate;


    return { estimatedTotalReward, cacheallvotesEstimate,  };
}




export async function getAccountHistoryLast30Days(account, rpc, limit = 1000) {
  if (!account || !rpc) {
    throw new Error('Parâmetros inválidos: é necessário account, rpc e rpcCallFn (função).');
  }

  const cutoffMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const collected = [];

  // Função recursiva interna que busca um lote começando do índice "from".
  async function recurse(from) {
    // Solicita o lote atual
    const batch = await rpcCall(rpc, 'condenser_api.get_account_history', [account, from, limit]);

    if (!Array.isArray(batch) || batch.length === 0) {
      return; // sem mais resultados
    }

    // Acumula
    collected.push(...batch);

    // Determina o menor índice retornado e o timestamp mais antigo do lote
    let minIndex = Infinity;
    let oldestTsMs = Infinity;
    for (const entry of batch) {
      const idx = Number(entry[0]);
      if (!Number.isNaN(idx) && idx < minIndex) minIndex = idx;

      const ts = entry[1] && (entry[1].timestamp || entry[1].time || entry[1].created);
      const tsMs = ts ? new Date(ts).getTime() : NaN;
      if (!Number.isNaN(tsMs) && tsMs < oldestTsMs) oldestTsMs = tsMs;
    }

    // Se algum item do lote for mais antigo que o cutoff, podemos parar (já trouxemos histórico suficiente)
    if (!Number.isNaN(oldestTsMs) && oldestTsMs < cutoffMs) {
      return;
    }

    // Se chegamos ao início do histórico ou o lote veio menor que o limite, paramos
    if (minIndex <= 0) {
      return;
    }

    // Caso contrário, buscamos o próximo lote anterior ao menor índice encontrado
    const nextFrom = minIndex - 1;
    if (nextFrom < 0) return;
    await recurse(nextFrom);
  }

  // Inicia a recursão a partir de -1 (mais recente)
  await recurse(-1);

  // Filtra apenas entradas dentro dos últimos 30 dias
  const filtered = collected.filter(entry => {
    const ts = entry[1] && (entry[1].timestamp || entry[1].time || entry[1].created);
    const ms = ts ? new Date(ts).getTime() : NaN;
    return !Number.isNaN(ms) && ms >= cutoffMs;
  });

  // Ordena do mais novo para o mais antigo (opcional, geralmente útil)
  filtered.sort((a, b) => new Date(b[1].timestamp || b[1].time || b[1].created).getTime()
                       - new Date(a[1].timestamp || a[1].time || a[1].created).getTime());

  console.log('Account History Last 30 Days:');
  console.log(filtered);  

  let allvotes = [];
  let allrewardauthor = [];
  let allrewardcuration = [];

  filtered.forEach(entry => {
    if(entry[1].op[0] === 'vote'){
      //console.log(entry[1].op[1]);
      if(entry[1].op[1].voter === account){
        allvotes.push(entry);
        //entry[1].op[1]
      }
      else{
      }
    } else if(entry[1].op[0] === 'author_reward'){
      allrewardauthor.push(entry);
    } else if(entry[1].op[0] === 'curation_reward'){
      allrewardcuration.push(entry);
    }
    else{
    }
  }
);



  console.log('author_reward');
  console.log(allrewardauthor);



  cache.allastFetch = filtered
  cache.allvoteFetch = allvotes;
  cache.allauthorFetch = allrewardauthor;
  cache.allcurationFetch = allrewardcuration;
  return filtered;
}


/**
 * Busca o Vesting Share Price (BLURT/VESTS)
 * @param {string} rpc - URL do nodo RPC.
 * @returns {Promise<number>} O preço de 1 VEST em BLURT.
 */
export async function getVestingSharePrice(rpc) {
    if (cache.vestingSharePrice) return cache.vestingSharePrice;

    log('Buscando Vesting Share Price (BLURT/VESTS)...');
    
    // get_dynamic_global_properties
    const props = await rpcCall(rpc, 'condenser_api.get_dynamic_global_properties', []);
    
    const totalVestingShares = parseFloat(fmt(props.total_vesting_shares));
    const totalVestingFund = parseFloat(fmt(props.total_vesting_fund_blurt));

    if (totalVestingShares > 0) {
        cache.vestingSharePrice = totalVestingFund / totalVestingShares;
        log(`Vesting Share Price: ${cache.vestingSharePrice.toFixed(6)} BLURT/VEST`);
        return cache.vestingSharePrice;
    }
    
    throw new Error('Não foi possível calcular o Vesting Share Price.');
}

/**
 * NOVO: Busca e calcula estatísticas importantes da conta (VP, BP, Liquido).
 * @param {string} account - Nome da conta.
 * @param {string} rpc - URL do nodo RPC.
 * @returns {Promise<{votingPower: number, blurtPower: number, blurtLiquid: number}>} Estatísticas da conta.
 */
export async function getAccountStats(account, rpc) {
    
    const vestingPrice = await getVestingSharePrice(rpc);
    
    // 1. Busca os dados da conta
    log(`Buscando dados da conta @${account}...`);
    const accounts = await rpcCall(rpc, 'condenser_api.get_accounts', [[account]]);
    if (!accounts || accounts.length === 0) {
        throw new Error(`Conta @${account} não encontrada.`);
    }
    const acc = accounts[0];
    
    // 2. Calcula Voting Power (VP)
    // O VP é um valor entre 0 e 10000 (0.00% a 100.00%)
    const lastVoteTime = new Date(acc.last_vote_time).getTime();
    const now = Date.now();
    // Regeneração: 5 dias (432000 segundos) para 100% de VP
    const secondsSinceLastVote = (now - lastVoteTime) / 1000;
    
    let currentVp = acc.voting_power + (10000 * secondsSinceLastVote / 432000);
    if (currentVp > 10000) currentVp = 10000;
    
    const votingPower = currentVp / 100; // Converte para percentual (0.00 a 100.00)

    // 3. Calcula Blurt Power (BP)
    // VESTS totais convertidos para BLURT
    const totalVests = parseFloat(fmt(acc.vesting_shares));
    const delegatedVests = parseFloat(fmt(acc.delegated_vesting_shares));
    const receivedVests = parseFloat(fmt(acc.received_vesting_shares));

    // Blurt Power = (vesting_shares - delegated_vesting_shares) * vestingPrice
    // Apenas os VESTS que a conta possui e não delegou.
    const effectiveVests = totalVests - delegatedVests;
    const blurtPower = effectiveVests * vestingPrice;
    
    // 4. Calcula BLURT Líquido
    const blurtLiquid = parseFloat(fmt(acc.balance));
    
    log(`VP: ${votingPower.toFixed(2)}%, BP: ${blurtPower.toFixed(3)} BLURT, Líquido: ${blurtLiquid.toFixed(3)} BLURT`);

    return {
        votingPower,
        blurtPower,
        blurtLiquid
    };
}

export async function getSocialInteractions(account, rpc) {
    log('Buscando interações sociais (votos recebidos, votos dados, comentários)...');
    
    // Usando o histórico que deve ter sido preenchido pelo getRewardHistory
    const history = cache.allastFetch; 
    
    // Mapas para agregar e contar interações
    const votersMap = {}; // Quem votou em você (30 dias)
    const commentsGivenMap = {}; // Para quem você comentou (30 dias)
    const commentersMap = {}; // Quem comentou em seus posts/comentários (30 dias)
    
    // NOVO: Mapa para contar seus votos dados, focado na janela de 7 dias
    const votesGivenCountMap = {};
    const nowMs = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;


    // 1. Processar histórico (últimos 30 dias)
    history.forEach(entry => {
        const op = entry[1].op[0];
        const data = entry[1].op[1];
        const ts = entry[1].timestamp;
        const opTimeMs = new Date(ts).getTime();

        // VOTOS
        if (op === 'vote') {
            const isMyVote = data.voter === account;
            const isVoteOnMyPost = data.author === account;

            if (isMyVote) {
                // Votos que a conta DEU
                
                // CONTAGEM DE VOTOS DADOS (ÚLTIMOS 7 DIAS)
                // Apenas se o voto estiver dentro da janela de 7 dias (pending cashout)
                if ((nowMs - opTimeMs) <= sevenDaysMs) {
                     const targetAuthor = data.author;
                     votesGivenCountMap[targetAuthor] = (votesGivenCountMap[targetAuthor] || 0) + 1;
                }

                // O campo votesGiven (votos individuais) não é mais necessário,
                // mas se o app(10).js ainda o espera, precisamos fornecê-lo (mantido vazio se não usado).
                // Como atualizamos o app(10).js para usar votesGivenCount, a lista individual 'votesGiven' pode ser removida se quiser otimizar, mas vou mantê-la vazia aqui para garantir compatibilidade.
            } else if (isVoteOnMyPost) {
                // Votos que a conta RECEBEU (30 dias)
                const key = data.voter;
                votersMap[key] = (votersMap[key] || 0) + 1; // Conta o número de votos
            }
        }
        
        // COMENTÁRIOS
        if (op === 'comment') {
            const isMyComment = data.author === account;
            const isCommentOnMyPost = data.parent_author === account;
            
            if (isMyComment) {
                // Comentários que a conta DEU (30 dias)
                const target = data.parent_author; // A quem você comentou
                if (target !== account) { // Não conta comentários em si mesmo
                    commentsGivenMap[target] = (commentsGivenMap[target] || 0) + 1;
                }
            } else if (isCommentOnMyPost && data.parent_permlink) { 
                // Comentários que a conta RECEBEU (30 dias)
                const commenter = data.author; // Quem comentou em você
                if (commenter !== account) { // Não conta comentários em si mesmo
                    commentersMap[commenter] = (commentersMap[commenter] || 0) + 1;
                }
            }
        }
    });
    
    log(`Votos dados (7d, contagem): ${Object.keys(votesGivenCountMap).length} alvos.`);
    log(`Votos recebidos: ${Object.keys(votersMap).length} pessoas.`);


    // 2. Transforma mapas em listas ordenadas (Top 10)
    
    // VOTOS DADOS (7 DIAS)
    const sortedVotesGivenCount = Object.entries(votesGivenCountMap)
        .map(([author, count]) => ({ author, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10

    // VOTANTES (30 DIAS)
    const sortedVoters = Object.entries(votersMap)
        .map(([voter, count]) => ({ voter, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10

    // COMENTÁRIOS DADOS (30 DIAS)
    const sortedCommentsGiven = Object.entries(commentsGivenMap)
        .map(([target, count]) => ({ target, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // COMMENTERS (30 DIAS)
    const sortedCommenters = Object.entries(commentersMap)
        .map(([commenter, count]) => ({ commenter, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return { 
        votesGivenCount: sortedVotesGivenCount, // Novo e agregado
        voters: sortedVoters, 
        commentsGiven: sortedCommentsGiven, 
        commenters: sortedCommenters,
        // Mantém 'votesGiven' como um array vazio para não quebrar a interface que ainda pode esperar ele
        votesGiven: [], 
    };
}