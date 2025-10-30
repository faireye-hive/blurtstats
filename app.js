 // Importa todas as funções e utilitários necessários do blockchain.js
import { $, fmt, log, getRewardHistory, getPendingRewards,getPendingRewards2,getPendingRewards3 } from './blockchain.js';

//getRewardHistory('bgo', 'https://rpc.blurt.world');
//getPendingRewards2('bgo', 'https://rpc.blurt.world');
//getPendingRewards3('bgo', 'https://rpc.blurt.world');

// Variável global para a instância do gráfico
let chart;

/**
 * Função principal que coordena a busca de dados e a renderização.
 */
async function fetchAndRender() {
    const account = $('accountInput').value.trim();
    //const account = 'bgo';
    const rpc = $('rpcInput').value.trim() || 'https://rpc.blurt.world';
    const postLimit = parseInt($('postLimit').value, 10) || 100;
    
    if (!account) { alert('Informe a conta.'); return; }
    
    $('updatedAt').textContent = 'Buscando...';
    $('log').textContent = '';

    try {
        log('RPC:', rpc);

        // 1. Busca e processa o histórico de recompensas
        const { daysMapCuration, daysMapAuthor } = await getRewardHistory(account, rpc);
        
        const totalCuration = Object.values(daysMapCuration).reduce((a, b) => a + b, 0);
        const totalAuthor = Object.values(daysMapAuthor).reduce((a, b) => a + b, 0);

        $('totalCuration').textContent = totalCuration.toFixed(3) + ' BLURT';
        $('totalAuthor').textContent = totalAuthor.toFixed(3) + ' BLURT';

        // 2. Busca e calcula recompensas pendentes
        const { pendingAuthorSum, pendingCurationEstimate } = await getPendingRewards(account, rpc, postLimit);

        $('pendingAuthor').textContent = pendingAuthorSum.toFixed(3) + ' BLURT';
        $('pendingCuration').textContent = pendingCurationEstimate.toFixed(3) + ' BLURT (estim.)';

        // 3. Prepara e renderiza o gráfico
        const labels = Object.keys(daysMapAuthor).sort();
        const dataAuthor = labels.map(l => daysMapAuthor[l]);
        const dataCuration = labels.map(l => daysMapCuration[l]);

        renderChart(labels, dataAuthor, dataCuration);

        $('updatedAt').textContent = new Date().toLocaleString();

    } catch (err) {
        log('Erro geral:', err.message || err);
        alert('Erro: ' + (err.message || err));
        $('updatedAt').textContent = 'Erro';
    }
}

/**
 * Renderiza o gráfico Chart.js.
 * @param {string[]} labels - Rótulos (datas).
 * @param {number[]} authorData - Dados de recompensa Author.
 * @param {number[]} curationData - Dados de recompensa Curation.
 */
function renderChart(labels, authorData, curationData) {
    const ctx = $('rewardsChart');
    if (chart) chart.destroy();
    
    // Chart é uma variável global que armazena a instância do gráfico.
    // NOTE: A biblioteca Chart.js deve estar carregada no HTML.
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Author received', data: authorData, tension: 0.3, borderWidth: 2, pointRadius: 3, borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.06)' },
                { label: 'Curation received', data: curationData, tension: 0.3, borderWidth: 2, pointRadius: 3, borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.06)' }
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
    const aData = chart.data.datasets[0].data;
    const cData = chart.data.datasets[1].data;
    
    let csv = 'date,author,curation\n';
    for (let i = 0; i < labels.length; i++) csv += `${labels[i]},${aData[i]},${cData[i]}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = 'blurt_rewards_30d.csv'; 
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
