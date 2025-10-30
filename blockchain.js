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


                const createdbase = new Date(item.created).getTime();
                
                // 1. Verifica se o post ainda está pendente E dentro da janela de 7 dias
                if (!isNaN(createdbase) && createdbase < nowMs && (nowMs - createdbase) <= sevenDaysMs) {

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

    const curationResults = await getEstimatedCurationRewards(account, rpc);


    // 3. Soma os resultados
    const pendingAuthorSum = discussionsResults.totalPendingAuthor + commentsResults.totalPendingAuthor;
    const pendingCurationEstimate = curationResults.estimatedTotalReward;
    //const pendingCurationEstimate = 0;
    log('Busca de pendentes concluída.');

    return { pendingAuthorSum, pendingCurationEstimate };
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

            estimatedTotalReward += estimatedReward;

        } catch (e) {
            log(`Erro ao estimar voto @${vote.author}/${vote.permlink}: ${e.message}`);
        }
    }

    log(`Estimativa de recompensa de curadoria (7d): ${estimatedTotalReward.toFixed(3)} BLURT`);

    console.log('Estimated Curation Rewards:'); 
      console.log(totalVotes);
      console.log(estimatedTotalReward);

    return { estimatedTotalReward };
}


// Função para buscar o preço de conversão VESTS/BLURT
export async function getVestingSharePrice(rpc) {
    try {
        log('Buscando dynamic global properties...');
        const props = await rpcCall(rpc, 'condenser_api.get_dynamic_global_properties', []);
        
        const fund = parseFloat(props.total_vesting_fund_blurt.split(' ')[0]);
        const shares = parseFloat(props.total_vesting_shares.split(' ')[0]);
        
        if (shares === 0) return 1.0; 
        
        const price = fund / shares;
        log(`Taxa VESTS/BLURT: 1 VEST = ${price.toFixed(6)} BLURT`);
        return price;
    } catch (e) {
        log('Erro ao buscar vesting share price, usando fallback (1.0).', e.message);
        return 1.0; 
    }
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