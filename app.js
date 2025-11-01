// Importa todas as funções e utilitários necessários do blockchain.js
import { getRewardHistory, getPendingRewards, getAccountStats, getSocialInteractions} from './blockchain.js';
import {$, fmt, log, toDateKey } from './utils.js'

// Variável global para a instância do gráfico
let chart;

/**
 * NOVO: Limpa os resultados antigos, define o status de carregamento e desabilita o botão.
 */
function setInitialStatus() {
    const statusText = 'Calculando...';
    
    // Limpa os campos de resumo e define o status de carregamento
    $('totalCuration').textContent = statusText;
    $('totalAuthor').textContent = statusText;
    $('pendingAuthor').textContent = statusText;
    $('pendingCuration').textContent = statusText;
    
    // Status de log e tempo
    $('updatedAt').textContent = 'Buscando...';
    $('log').textContent = '';
    
    // Desabilita o botão para evitar cliques duplos e indica o status
    $('fetchBtn').disabled = true;
    $('fetchBtn').textContent = statusText;

    // Limpa o gráfico anterior (operação importante para apagar o visual antigo)
    if (chart) {
        chart.destroy();
        chart = null;
    }
}

/**
 * NOVO: Restaura o botão "Buscar" e lida com campos que ficaram em status de erro.
 * @param {boolean} isError - Se houve um erro durante a busca.
 */
function resetButton(isError = false) {
    $('fetchBtn').disabled = false;
    $('fetchBtn').textContent = 'Buscar';

    if (isError) {
        $('updatedAt').textContent = 'Erro';
        // Define o texto para "Erro" nos campos que não foram preenchidos (ainda em 'Calculando...')
        if ($('totalCuration').textContent === 'Calculando...') $('totalCuration').textContent = 'Erro';
        if ($('totalAuthor').textContent === 'Calculando...') $('totalAuthor').textContent = 'Erro';
        if ($('pendingAuthor').textContent === 'Calculando...') $('pendingAuthor').textContent = 'Erro';
        if ($('pendingCuration').textContent === 'Calculando...') $('pendingCuration').textContent = 'Erro';
    }
}


/**
 * Função principal que coordena a busca de dados e a renderização.
 */
async function fetchAndRender() {
    const account = $('accountInput').value.trim();
    //const account = 'bgo';
    const rpc = $('rpcInput').value.trim() || 'https://rpc.blurt.world';
    const postLimit = parseInt($('postLimit').value, 10) || 100;
    
    if (!account) { 
        alert('Informe a conta.'); 
        resetButton(); // Reseta o botão para "Buscar" caso a validação falhe
        return; 
    }
    
    // PASSO 1: Define o status de carregamento e limpa o gráfico/dados antigos
    setInitialStatus(); 

    // NOVO: Define status de carregamento para as novas estatísticas
    $('votingPower').textContent = 'Calculando...';
    $('blurtPower').textContent = 'Calculando...';
    $('blurtLiquid').textContent = 'Calculando...';

    try {
        log('RPC:', rpc);

        // NOVO PASSO: 0. Busca as estatísticas da conta
        const stats = await getAccountStats(account, rpc);

        $('votingPower').textContent = stats.votingPower.toFixed(2) + ' %';
        $('blurtPower').textContent = stats.blurtPower.toFixed(3) + ' BLURT';
        $('blurtLiquid').textContent = stats.blurtLiquid.toFixed(3) + ' BLURT';
        $('accountDisplay').textContent = account; // Atualiza o @usuario no HTML

        // 1. Busca e processa o histórico de recompensas
        const { daysMapCuration, daysMapAuthor } = await getRewardHistory(account, rpc);
        
        const totalCuration = Object.values(daysMapCuration).reduce((a, b) => a + b, 0);
        const totalAuthor = Object.values(daysMapAuthor).reduce((a, b) => a + b, 0);

        // Atualiza os campos de resumo com os dados (SUCESSO)
        $('totalCuration').textContent = totalCuration.toFixed(3) + ' BLURT';
        $('totalAuthor').textContent = totalAuthor.toFixed(3) + ' BLURT';

        // 2. Busca e calcula recompensas pendentes
        const { pendingAuthorSum, pendingCurationEstimate, pendingCurationDailyMap } = await getPendingRewards(account, rpc, postLimit);

        // Atualiza os campos de pending
        $('pendingAuthor').textContent = pendingAuthorSum.toFixed(3) + ' BLURT';
        $('pendingCuration').textContent = pendingCurationEstimate.toFixed(3) + ' BLURT (estim. total)'; 

        // 3. Prepara e renderiza o gráfico
        const labels30d = Object.keys(daysMapAuthor).sort();
        const dataAuthor = labels30d.map(l => daysMapAuthor[l]);
        const dataCuration = labels30d.map(l => daysMapCuration[l]);
        
        // --- Estende os labels para 7 dias futuros ---
        const futureLabels = [];
        const today = new Date();
        for (let i = 1; i <= 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            futureLabels.push(toDateKey(d.toISOString()));
        }

        const labels = [...labels30d, ...futureLabels];
        
        // --- Cria a série de Curadoria Pendente Diária Estimada ---
        const dataPendingCuration = new Array(labels30d.length).fill(null);
        
        futureLabels.forEach(label => {
            const estimatedValue = pendingCurationDailyMap[label] || 0;
            dataPendingCuration.push(estimatedValue);
        });

        const dataAuthorExtended = [...dataAuthor, ...new Array(7).fill(null)];
        const dataCurationExtended = [...dataCuration, ...new Array(7).fill(null)];
        
        renderChart(labels, dataAuthorExtended, dataCurationExtended, dataPendingCuration);

        // NOVO PASSO 2: Interações Sociais
        const interactions = await getSocialInteractions(account, rpc);

        // --- RENDERIZAÇÃO DE VOTOS DADOS (ÚLTIMOS 7 DIAS - CONTAGEM) ---
        // Usa a nova propriedade votesGivenCount, que já está filtrada (7d) e agregada
        const recentVotesGivenCount = interactions.votesGivenCount; 

        let votesGivenHtml = recentVotesGivenCount.length > 0 ? '' : '<li>Nenhum voto dado nos últimos 7 dias.</li>';
        
        recentVotesGivenCount.forEach(entry => { 
            const link = `https://blurt.blog/@${entry.author}`; 
            
            // Exibe o autor e a contagem de votos
            votesGivenHtml += `<li><a href="${link}" target="_blank">@${entry.author}</a> (${entry.count} voto${entry.count > 1 ? 's' : ''})</li>`;
        });
        $('votesGivenList').innerHTML = votesGivenHtml;
        
        // --- RENDERIZAÇÃO DE QUEM VOTOU EM VOCÊ (TOP 10) ---
        let votersHtml = interactions.voters.length > 0 ? '' : '<li>Nenhum votante nos últimos 30 dias.</li>';
        interactions.voters.forEach(v => {
            votersHtml += `<li><a href="https://blurt.blog/@${v.voter}" target="_blank">@${v.voter}</a> (${v.count} votos)</li>`;
        });
        $('votersList').innerHTML = votersHtml;
        
        // --- RENDERIZAÇÃO DE PARA QUEM VOCÊ COMENTOU (TOP 10) ---
        let commentsGivenHtml = interactions.commentsGiven.length > 0 ? '' : '<li>Nenhum comentário feito nos últimos 30 dias.</li>';
        interactions.commentsGiven.forEach(c => {
            commentsGivenHtml += `<li><a href="https://blurt.blog/@${c.target}" target="_blank">@${c.target}</a> (${c.count} vezes)</li>`;
        });
        $('commentsGivenList').innerHTML = commentsGivenHtml;
        
        // --- RENDERIZAÇÃO DE QUEM COMENTOU EM VOCÊ (TOP 10) ---
        let commentersHtml = interactions.commenters.length > 0 ? '' : '<li>Nenhum comentário recebido nos últimos 30 dias.</li>';
        interactions.commenters.forEach(c => {
            commentersHtml += `<li><a href="https://blurt.blog/@${c.commenter}" target="_blank">@${c.commenter}</a> (${c.count} vezes)</li>`;
        });
        $('commentersList').innerHTML = commentersHtml;

        // Finalização bem-sucedida
        $('updatedAt').textContent = new Date().toLocaleString();
        resetButton();

    } catch (err) {
        // Tratamento de erro
        log('Erro geral:', err.message || err);
        alert('Erro: ' + (err.message || err));
        resetButton(true);
    }
}

/**
 * Renderiza o gráfico Chart.js.
 * @param {string[]} labels - Rótulos (datas).
 * @param {number[]} authorData - Dados de recompensa Author.
 * @param {number[]} curationData - Dados de recompensa Curation.
 * @param {number[]} pendingCurationData - Dados de Curadoria Pendente Estimada (7 dias futuros).
 */
function renderChart(labels, authorData, curationData, pendingCurationData) {
    const ctx = $('rewardsChart');
    if (chart) chart.destroy();
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Author received', data: authorData, tension: 0.3, borderWidth: 2, pointRadius: 3, borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.06)' },
                { label: 'Curation received', data: curationData, tension: 0.3, borderWidth: 2, pointRadius: 3, borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.06)' },
                { 
                    label: 'Curation pending (Estimativa diária 7d)',
                    data: pendingCurationData, 
                    tension: 0,
                    borderWidth: 2, 
                    pointRadius: 4, 
                    borderColor: '#fbbf24', 
                    backgroundColor: 'rgba(251,191,36,0.1)',
                    borderDash: [5, 5]
                } 
            ]
        },
        options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { labels: { usePointStyle: true } } } }
    });
}

/**
 * Cria e inicia o download do arquivo CSV.
 */
function downloadCsv() {
    if (!chart) { alert('Execute a busca antes de exportar.'); return; }
    
    const labels = chart.data.labels;
    // Mapeia os datasets
    const datasets = {};
    chart.data.datasets.forEach(d => {
        // Usa o label como chave, limpando a descrição
        datasets[d.label.replace(' received', '').split(' (')[0]] = d.data;
    });
    
    // Cria o cabeçalho do CSV
    const headers = ['date', ...Object.keys(datasets)];
    let csv = headers.join(',') + '\n';
    
    // Preenche as linhas
    for (let i = 0; i < labels.length; i++) {
        const row = [labels[i]];
        headers.slice(1).forEach(header => {
            row.push(datasets[header][i] !== null ? datasets[header][i] : '');
        });
        csv += row.join(',') + '\n';
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = 'blurt_rewards_history_and_pending.csv'; 
    document.body.appendChild(a); 
    a.click(); 
    a.remove(); 
    URL.revokeObjectURL(url);
}

// --- Configuração de Eventos ---
document.getElementById('fetchBtn').addEventListener('click', fetchAndRender);
document.getElementById('exportCsv').addEventListener('click', downloadCsv);

// Preenchimento inicial (limpa os campos, remova se desejar)
$('accountInput').value = '';
$('rpcInput').value = '';