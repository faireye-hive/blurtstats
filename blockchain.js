// --- Utilitários (Movidos de script.js) ---

import {$, fmt, log, toDateKey } from './utils.js'
import { getTranslation } from './app.js';

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

const CONFIG = {
  PRIMARY_API_URL: "https://api.hive-engine.com/rpc/contracts",
};

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=blurt&vs_currencies=usd';
const BLURT_PRICE_KEY = 'blurtPriceData'; // Chave do localStorage

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
    log(getTranslation('Buscando account_history...'));
    // Busca as últimas 1000 operações
    //const history = await rpcCall(rpc, 'condenser_api.get_account_history', [account, -1, 1000]);

    const history = await getAccountHistoryLast30Days(account, rpc);
    log(getTranslation('ops recebidas:'), history.length);

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

                const createdbase = new Date(item.created).getTime();

                // 1. Verifica se o post ainda está pendente E dentro da janela de 7 dias
                if (!isNaN(createdbase) && (createdbase+setedias) >= DataNow) {

                    if(item &&item.author === account && (createdbase+setedias) >= DataNow){
                        if(apiMethod === "condenser_api.get_discussions_by_blog"){
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
                log(getTranslation('Erro ao processar item:'), item.author, item.permlink, e.message);
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

    
    log(getTranslation('Buscando recompensas pendentes (posts e comentários)...'));
    
    const nowMs = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const curationRatio = 0.25; // Heurística de estimativa
    const queryLimit = 100; // Limite por página

    // 1. Query para POSTS (get_discussions_by_blog)
    const blogQuery = { tag: account,limit: queryLimit,start_author: undefined,start_permlink: undefined};
    
    // 2. Query para COMENTÁRIOS (get_discussions_by_comments)
    const commentsQuery = {start_author: account,limit: queryLimit,start_permlink: undefined,};

    log(getTranslation('--- Iniciando busca por POSTS pendentes ---'));
    const discussionsResults = await fetchRecursivePending( rpc, 'condenser_api.get_discussions_by_blog', blogQuery, nowMs, sevenDaysMs, curationRatio,account);

    log(getTranslation('--- Iniciando busca por COMENTÁRIOS pendentes ---'));
    const commentsResults = await fetchRecursivePending(rpc, 'condenser_api.get_discussions_by_comments', commentsQuery, nowMs, sevenDaysMs, curationRatio,account );

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
    log(getTranslation('Busca de pendentes concluída.'));

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
    log(getTranslation('Buscando histórico de VOTOS dos últimos 7 dias...'));

    const nowMs = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const minTimeMs = nowMs - sevenDaysMs;
    const history = cache.allvoteFetch;

    log(`Ops recebidas: ${history.length}. Filtrando votos...`);

    cache.allvotesEstimate = [];
    const recentVotes = [];

    for (const entry of history) {
        try {
            const op = entry[1].op[0];
            const data = entry[1].op[1];
            const ts = entry[1].timestamp;
            const opTimeMs = new Date(ts).getTime();

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

    log(getTranslation('Votos recentes (7d) encontrados:'), recentVotes.length);

    // Limite de chamadas simultâneas (evita sobrecarga do RPC)
    const concurrencyLimit = 4;
    const delay = ms => new Promise(r => setTimeout(r, ms));

    let estimatedTotalReward = 0;

    async function processVote(vote) {
        try {
            const content = await rpcCall(rpc, 'condenser_api.get_content', [vote.author, vote.permlink]);
            if (!content) return;

            const pendingStr = content.pending_payout_value || '0.000 BLURT';
            const pendingVal = parseFloat(fmt(pendingStr));
            if (pendingVal <= 0) return;

            const totalCurationPool = pendingVal * 0.50;
            const activeVotes = content.active_votes;
            if (!Array.isArray(activeVotes) || activeVotes.length === 0) return;

            let sumRshares = 0n;
            let myRshares = 0n;
            for (const v of activeVotes) {
                const r = BigInt(v.rshares || '0');
                sumRshares += (r < 0n ? -r : r);
                if (v.voter === account) myRshares = (r < 0n ? -r : r);
            }

            if (sumRshares === 0n || myRshares === 0n) return;

            const fraction = Number(myRshares) / Number(sumRshares);
            const estimatedReward = totalCurationPool * fraction;

            cache.allvotesEstimate.push({
                author: vote.author,
                permlink: vote.permlink,
                weight: vote.weight,
                timeMs: vote.timeMs,
                estimatedReward,
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

    // Processa em blocos de "concurrencyLimit"
    for (let i = 0; i < recentVotes.length; i += concurrencyLimit) {
        const chunk = recentVotes.slice(i, i + concurrencyLimit);
        await Promise.all(chunk.map(v => processVote(v)));
        await delay(200); // pequeno intervalo entre blocos
    }

    log(`${getTranslation("Estimativa de recompensa de curadoria (7d):")} ${estimatedTotalReward.toFixed(3)} BLURT`);

    return { 
        estimatedTotalReward, 
        cacheallvotesEstimate: cache.allvotesEstimate 
    };
}



export async function getAccountHistoryLast30Days(account, rpc, limit = 1000) {
  if (!account || !rpc) {
    throw new Error(getTranslation('Parâmetros inválidos: é necessário account e rpc.'));
  }

  const cutoffMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const collected = [];

  // Descobre o índice mais recente primeiro (evita buscar do -1 pra trás com tentativas)
  const latest = await rpcCall(rpc, 'condenser_api.get_account_history', [account, -1, 1]);
  if (!Array.isArray(latest) || latest.length === 0) return [];

  let latestIndex = latest[0][0];
  log(`Último índice encontrado: ${latestIndex}`);

  const concurrencyLimit = 4; // quantos blocos simultâneos
  const step = limit;
  let reachedCutoff = false;

  while (latestIndex > 0 && !reachedCutoff) {
    // Cria um grupo de requisições paralelas
    const requests = [];
    for (let i = 0; i < concurrencyLimit && latestIndex > 0; i++) {
      const from = Math.max(0, latestIndex - step);
      requests.push(rpcCall(rpc, 'condenser_api.get_account_history', [account, latestIndex, step]));
      latestIndex = from - 1;
    }

    // Executa em paralelo
    const batches = await Promise.allSettled(requests);

    for (const batchResult of batches) {
      if (batchResult.status !== 'fulfilled' || !Array.isArray(batchResult.value)) continue;

      const batch = batchResult.value;
      collected.push(...batch);

      // Detecta se algum item é mais antigo que 30 dias
      for (const entry of batch) {
        const ts = entry[1] && (entry[1].timestamp || entry[1].time || entry[1].created);
        const tsMs = ts ? new Date(ts).getTime() : NaN;
        if (!Number.isNaN(tsMs) && tsMs < cutoffMs) {
          reachedCutoff = true;
          break;
        }
      }
    }

    // Evita sobrecarregar o RPC
    await new Promise(r => setTimeout(r, 200));
  }

  // Filtra os últimos 30 dias
  const filtered = collected.filter(entry => {
    const ts = entry[1] && (entry[1].timestamp || entry[1].time || entry[1].created);
    const ms = ts ? new Date(ts).getTime() : NaN;
    return !Number.isNaN(ms) && ms >= cutoffMs;
  });

  // Ordena do mais novo para o mais antigo
  filtered.sort((a, b) => new Date(b[1].timestamp || b[1].time || b[1].created) - new Date(a[1].timestamp || a[1].time || a[1].created));

  // Classifica os tipos de operação
  const allvotes = [];
  const allrewardauthor = [];
  const allrewardcuration = [];

  for (const entry of filtered) {
    const op = entry[1].op?.[0];
    const data = entry[1].op?.[1] || {};
    if (op === 'vote' && data.voter === account) allvotes.push(entry);
    else if (op === 'author_reward') allrewardauthor.push(entry);
    else if (op === 'curation_reward') allrewardcuration.push(entry);
  }

  cache.allastFetch = filtered;
  cache.allvoteFetch = allvotes;
  cache.allauthorFetch = allrewardauthor;
  cache.allcurationFetch = allrewardcuration;

  log(`Histórico total coletado: ${collected.length}, últimos 30 dias: ${filtered.length}`);

  return filtered;
}


/**
 * Busca o Vesting Share Price (BLURT/VESTS)
 * @param {string} rpc - URL do nodo RPC.
 * @returns {Promise<number>} O preço de 1 VEST em BLURT.
 */
export async function getVestingSharePrice(rpc) {
    if (cache.vestingSharePrice) return cache.vestingSharePrice;

    log(getTranslation('Buscando Vesting Share Price (BLURT/VESTS)...'));
    
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
    log(`${getTranslation("Buscando dados da conta")} @${account}...`);
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
    log(getTranslation('Buscando interações sociais (votos recebidos, votos dados, comentários)...'));
    
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
    
    log(`${getTranslation("Votos dados (7d, contagem:")} ${Object.keys(votesGivenCountMap).length} alvos.`);
    log(`${getTranslation("Votos recebidos:")} ${Object.keys(votersMap).length} pessoas.`);


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


/**
 * Busca o preço do BLURT/USD no CoinGecko, com cache diário no localStorage.
 * * Se o preço foi buscado hoje, usa o valor em cache. Caso contrário, faz uma nova requisição,
 * armazena o novo valor e a data atual no localStorage e retorna o preço.
 * * @returns {Promise<number|null>} O preço do BLURT em USD, ou null em caso de erro.
 */
export async function getBlurtPriceFromCoingecko() {

    // toDateKey é importado de utils.js, então podemos usá-lo para a data de hoje (YYYY-MM-DD)
    const todayKey = toDateKey(new Date().toISOString()); 

    
    // 1. Tenta carregar do localStorage
    try {
        const storedData = localStorage.getItem(BLURT_PRICE_KEY);
        if (storedData) {
            const data = JSON.parse(storedData);
            
            // 2. Verifica se a data é a de hoje e se o preço é válido
            if (data && data.date === todayKey && typeof data.price === 'number' && data.price > 0) {
                log('Preço BLURT do cache local:', data.price.toFixed(5), 'USD');
                return data.price;
            }
        }
    } catch (e) {
        log('Erro ao ler do localStorage, buscando novo preço:', e.message);
    }
    
    // 3. Se não houver cache ou for de outro dia, faz a requisição
    log('Buscando novo preço BLURT no hive-engine...');
    try {
        //const response = await fetch(COINGECKO_API_URL);
        const marketpools = await fetchData("find", "marketpools", "pools", {}, 5);

        const resultado = marketpools.find(item => item.tokenPair === "SWAP.BLURT:SWAP.USDT");
        //const price = resultado.basePrice

        //const json = await response.json();
        // Extrai o preço do objeto: { blurt: { usd: 0.005 } }
        let price = resultado.basePrice ? resultado.basePrice : null; 
        price = Number(price);
        
        if (typeof price === 'number' && price > 0) {
            log('Novo preço BLURT:', price.toFixed(5), 'USD');
            
            // 4. Salva no localStorage (preço e data de hoje)
            const dataToStore = {
                price: price,
                date: todayKey, 
                timestamp: new Date().getTime(),
            };
            localStorage.setItem(BLURT_PRICE_KEY, JSON.stringify(dataToStore));
            
            return price;
        } else {
            localStorage.removeItem("blurtPriceData");
            throw new Error('Preço inválido ou não encontrado na resposta da API.');
        }

    } catch (error) {
        log('Erro ao buscar o preço BLURT do CoinGecko:', error.message);
        
        // Em caso de falha, tenta retornar o último preço válido do cache (mesmo que antigo)
        const storedData = localStorage.getItem(BLURT_PRICE_KEY);
        if (storedData) {
            const data = JSON.parse(storedData);
            if (data && data.price > 0) {
                 log('Falha na busca, usando último preço conhecido (antigo):', data.price.toFixed(5), 'USD');
                 return data.price;
            }
        }
        localStorage.removeItem("blurtPriceData");
        return null; // Retorna null se falhar a busca e não houver cache
    }
}

export async function getCurrencyRateByLanguage(lang) {



  const currencyMap = {
    en: 'USD', // English → Dollar
    de: 'EUR', // Deutsch → Euro
    es: 'EUR', // Español → Euro
    fr: 'EUR', // Français → Euro
    pl: 'PLN', // Polski → Zloty polonês
    pt: 'BRL', // Português → Real brasileiro
    ja: 'JPY', // 日本語 → Iene japonês
    zh: 'CNY'  // 中文 → Yuan chinês
  };

  const currency = currencyMap[lang];
  if (!currency) {
    console.warn("Idioma não suportado:", lang);
    return null;
  }

  // Se for USD, não precisa buscar nada
  if (currency === 'USD') {
    return { base: 'USD', target: 'USD', rate: 1 };
  }

  const cacheKey = `currencyRate_${currency}`;
  const cacheData = localStorage.getItem(cacheKey);

  // Verifica se já tem cache válido (menos de 24h)
  if (cacheData) {
    try {
      const { rate, timestamp } = JSON.parse(cacheData);
      const now = Date.now();
      const diffHours = (now - timestamp) / (1000 * 60 * 60);

      if (diffHours < 24) {
        // Retorna o valor salvo sem nova requisição
        return { base: 'USD', target: currency, rate, cached: true };
      }
    } catch {
      // Cache inválido — ignora
    }
  }

  // Se não houver cache válido, busca da API
  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${currency}`);
    const data = await response.json();
    const rate = data.rates[currency];

    // Salva no localStorage com timestamp
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ rate, timestamp: Date.now() })
    );

    return { base: 'USD', target: currency, rate, cached: false };
  } catch (err) {
    console.error("Erro ao buscar taxa de câmbio:", err);
    return null;
  }
}

export function clearInternalCache() {
    // Estas são as chaves no objeto 'cache' que armazenam dados da blockchain/posts
    cache.allastFetch = [];
    cache.allvoteFetch = [];
    cache.allauthorFetch = [];
    cache.allcurationFetch = [];
    cache.TotalPedingResultPost = [];
    cache.TotalPedingResultComment = [];
    cache.allvotesEstimate = [];
    
    // Opcional: Se 'vestingSharePrice' for cacheador, você pode limpá-lo aqui
    // cache.vestingSharePrice = null;
    
    console.log('Cache interno de dados de posts limpo.');
}

async function fetchData(
  methodName,
  contract,
  table,
  query,
  id = 1,
  url = CONFIG.PRIMARY_API_URL,
  limit = 1000,
  offset = 0
) {
  const payload = {
    jsonrpc: "2.0",
    id: id,
    method: methodName,
    params: {
      contract: contract,
      table: table,
      query: query,
      limit: limit,
      offset: offset,
    },
  };

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      console.log(
        `[REQ ${id}] Tentativa ${
          attempts + 1
        } de 3: Buscando ${contract}:${table} em ${url}`
      );

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Erro de rede (${url}): ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }
      return data.result;
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw error;
      }
      const delay = Math.pow(2, attempts) * 1000;
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
