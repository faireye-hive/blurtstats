// Importa todas as funções e utilitários necessários do blockchain.js
import { getRewardHistory, getPendingRewards, getAccountStats, getSocialInteractions} from './blockchain.js'; 
import {$, fmt, log, toDateKey } from './utils.js';
// Importa a lógica de tradução
import { translate, translations } from './i18n.js';

// Variável global para a instância do gráfico
let chart;
// Armazena o idioma atual
let currentLang = 'pt';


/**
 * Função para obter a tradução de textos dinâmicos.
 */
function getTranslation(key) {
    if (currentLang === 'pt') return key; 
    const t = translations[key];
    return (t && t[currentLang]) ? t[currentLang] : key;
}

/**
 * Lida com a pluralização de palavras como 'voto'/'votos'.
 */
function formatPlural(count, singleKey, pluralKey) {
    const wordKey = count === 1 ? singleKey : pluralKey;
    const word = getTranslation(wordKey);
    return `${count} ${word}`;
}

/**
 * Limpa os resultados antigos, define o status de carregamento e desabilita o botão.
 */
function setInitialStatus() {
    const statusText = getTranslation('Calculando...');
    const searchingText = getTranslation('Buscando...');
    
    // Lista de IDs para definir como 'Calculando...'
    const idsToReset = [
        'totalCuration', 'totalAuthor', 'pendingAuthor', 'pendingCuration',
        'votingPower', 'blurtPower', 'blurtLiquid', 'aprDisplay' // APR incluído
    ];
    
    idsToReset.forEach(id => {
        const el = $(id);
        if (el) el.textContent = statusText;
    });
    
    const updatedAtEl = $('updatedAt');
    if (updatedAtEl) updatedAtEl.textContent = searchingText;

    const logEl = $('log');
    if (logEl) logEl.textContent = '';
    
    const fetchBtn = $('fetchBtn');
    if (fetchBtn) {
        fetchBtn.disabled = true;
        fetchBtn.textContent = searchingText;
    }

    if (chart) {
        chart.destroy();
        chart = null;
    }
}

/**
 * Restaura o botão "Buscar" e lida com campos que ficaram em status de erro.
 */
function resetButton(isError = false) {
    const fetchBtn = $('fetchBtn');
    if (fetchBtn) {
        fetchBtn.disabled = false;
        fetchBtn.textContent = getTranslation('Buscar');
    }

    const updatedAtEl = $('updatedAt');
    if (isError && updatedAtEl) {
        updatedAtEl.textContent = getTranslation('Erro:');
    }
    
    if (isError) {
        // Redefine campos que falharam
        const idsToReset = ['totalCuration', 'totalAuthor', 'pendingAuthor', 'pendingCuration', 'votingPower', 'blurtPower', 'blurtLiquid', 'aprDisplay'];
        idsToReset.forEach(id => {
            const el = $(id);
            if (el && el.textContent === getTranslation('Calculando...')) {
                el.textContent = getTranslation('Erro:');
            }
        });
    }
}


/**
 * Função principal que coordena a busca de dados e a renderização.
 */
async function fetchAndRender() {
    const account = $('accountInput').value.trim();
    
    // LÓGICA DE RPC ATUALIZADA
    const rpcSelect = $('rpcSelect').value;
    let rpc = rpcSelect;
    if (rpc === 'custom') {
        rpc = $('rpcCustomInput').value.trim();
    }
    
    const postLimit = parseInt($('postLimit').value, 10) || 100;
    
    if (!account) { 
        alert(getTranslation('Informe a conta.')); 
        resetButton(); 
        return; 
    }
    
    setInitialStatus(); 

    try {
        log('RPC:', rpc);

        // 0. Busca as estatísticas da conta
        const stats = await getAccountStats(account, rpc);
        
        // (Verificações 'if (el)' adicionadas para segurança)
        const votingPowerEl = $('votingPower');
        if (votingPowerEl) votingPowerEl.textContent = stats.votingPower.toFixed(2) + ' %';
        
        const blurtPowerEl = $('blurtPower');
        if (blurtPowerEl) blurtPowerEl.textContent = stats.blurtPower.toFixed(3) + ' ' + getTranslation('BLURT');
        
        const blurtLiquidEl = $('blurtLiquid');
        if (blurtLiquidEl) blurtLiquidEl.textContent = stats.blurtLiquid.toFixed(3) + ' ' + getTranslation('BLURT');
        
        const accountDisplayEl = $('accountDisplay');
        if (accountDisplayEl) accountDisplayEl.textContent = account;

        // 1. Busca e processa o histórico de recompensas
        const { daysMapCuration, daysMapAuthor } = await getRewardHistory(account, rpc);
        
        const totalCuration = Object.values(daysMapCuration).reduce((a, b) => a + b, 0);
        const totalAuthor = Object.values(daysMapAuthor).reduce((a, b) => a + b, 0);

        $('totalCuration').textContent = totalCuration.toFixed(3) + ' ' + getTranslation('BLURT');
        $('totalAuthor').textContent = totalAuthor.toFixed(3) + ' ' + getTranslation('BLURT');

        // 2. Busca e calcula recompensas pendentes
        const { pendingAuthorSum, pendingCurationEstimate, pendingCurationDailyMap } = await getPendingRewards(account, rpc, postLimit);

        $('pendingAuthor').textContent = pendingAuthorSum.toFixed(3) + ' ' + getTranslation('BLURT');
        $('pendingCuration').textContent = pendingCurationEstimate.toFixed(3) + ' ' + getTranslation('BLURT (estim. total)');
        
        // 3. NOVO: Cálculo do APR
        const principal = stats.blurtPower; // Blurt Power (Passo 0)
        const weeklyEarnings = pendingCurationEstimate; // Curação 7d (Passo 2)
        let apr = 0;
        
        if (principal > 0 && weeklyEarnings > 0) {
            const weeklyRate = weeklyEarnings / principal;
            apr = weeklyRate * 52 * 100; // * 52 semanas * 100 para %
        }
        
        const aprDisplayEl = $('aprDisplay');
        if (aprDisplayEl) aprDisplayEl.textContent = apr.toFixed(2) + ' %';


        // 4. Prepara e renderiza o gráfico
        const labels30d = Object.keys(daysMapAuthor).sort();
        const dataAuthor = labels30d.map(l => daysMapAuthor[l]);
        const dataCuration = labels30d.map(l => daysMapCuration[l]);
        
        const futureLabels = [];
        const today = new Date();
        for (let i = 1; i <= 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            futureLabels.push(toDateKey(d.toISOString()));
        }

        const labels = [...labels30d, ...futureLabels];
        
        const dataPendingCuration = new Array(labels30d.length).fill(null);
        futureLabels.forEach(label => {
            const estimatedValue = pendingCurationDailyMap[label] || 0;
            dataPendingCuration.push(estimatedValue);
        });

        const dataAuthorExtended = [...dataAuthor, ...new Array(7).fill(null)];
        const dataCurationExtended = [...dataCuration, ...new Array(7).fill(null)];
        
        renderChart(labels, dataAuthorExtended, dataCurationExtended, dataPendingCuration);

        // 5. Interações Sociais
        const interactions = await getSocialInteractions(account, rpc);

        const recentVotesGivenCount = interactions.votesGivenCount; 
        let votesGivenHtml = recentVotesGivenCount.length > 0 ? '' : `<li>${getTranslation('Nenhum voto dado nos últimos 7 dias.')}</li>`;
        recentVotesGivenCount.forEach(entry => { 
            const link = `https://blurt.blog/@${entry.author}`; 
            const countText = formatPlural(entry.count, 'voto', 'votos');
            votesGivenHtml += `<li><a href="${link}" target="_blank">@${entry.author}</a> (${countText})</li>`;
        });
        const votesGivenListEl = $('votesGivenList');
        if (votesGivenListEl) votesGivenListEl.innerHTML = votesGivenHtml;
        
        let votersHtml = interactions.voters.length > 0 ? '' : `<li>${getTranslation('Nenhum votante nos últimos 30 dias.')}</li>`;
        interactions.voters.forEach(v => {
            const countText = formatPlural(v.count, 'voto', 'votos');
            votersHtml += `<li><a href="https://blurt.blog/@${v.voter}" target="_blank">@${v.voter}</a> (${countText})</li>`;
        });
        const votersListEl = $('votersList');
        if (votersListEl) votersListEl.innerHTML = votersHtml;
        
        let commentsGivenHtml = interactions.commentsGiven.length > 0 ? '' : `<li>${getTranslation('Nenhum comentário feito nos últimos 30 dias.')}</li>`;
        interactions.commentsGiven.forEach(c => {
            const countText = formatPlural(c.count, 'vez', 'vezes');
            commentsGivenHtml += `<li><a href="https://blurt.blog/@${c.target}" target="_blank">@${c.target}</a> (${countText})</li>`;
        });
        const commentsGivenListEl = $('commentsGivenList');
        if (commentsGivenListEl) commentsGivenListEl.innerHTML = commentsGivenHtml;
        
        let commentersHtml = interactions.commenters.length > 0 ? '' : `<li>${getTranslation('Nenhum comentário recebido nos últimos 30 dias.')}</li>`;
        interactions.commenters.forEach(c => {
            const countText = formatPlural(c.count, 'vez', 'vezes');
            commentersHtml += `<li><a href="https://blurt.blog/@${c.commenter}" target="_blank">@${c.commenter}</a> (${countText})</li>`;
        });
        const commentersListEl = $('commentersList');
        if (commentersListEl) commentersListEl.innerHTML = commentersHtml;

        // Finalização bem-sucedida
        const updatedAtEl = $('updatedAt');
        if (updatedAtEl) updatedAtEl.textContent = new Date().toLocaleString();
        resetButton();
        
        translate(currentLang);

    } catch (err) {
        log(getTranslation('Erro geral:'), err.message || err);
        alert(getTranslation('Erro:') + ' ' + (err.message || err));
        resetButton(true);
    }
}

/**
 * Renderiza o gráfico Chart.js.
 */
function renderChart(labels, authorData, curationData, pendingCurationData) {
    const ctx = $('rewardsChart');
    if (chart) chart.destroy();
    
    const labelAuthorReceived = getTranslation('Author (received)');
    const labelCurationReceived = getTranslation('Curation (received)');
    const labelPendingCurationDaily = getTranslation('Curation pending (estimativa diária 7d)');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: labelAuthorReceived, data: authorData, tension: 0.3, borderWidth: 2, pointRadius: 3, borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.06)' },
                { label: labelCurationReceived, data: curationData, tension: 0.3, borderWidth: 2, pointRadius: 3, borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.06)' },
                { 
                    label: labelPendingCurationDaily,
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
        options: { 
            scales: { y: { beginAtZero: true } }, 
            plugins: { 
                legend: { labels: { usePointStyle: true } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(3) + ' ' + getTranslation('BLURT');
                            }
                            return label;
                        }
                    }
                }
            } 
        }
    });
}

/**
 * Cria e inicia o download do arquivo CSV.
 */
function downloadCsv() {
    if (!chart) { alert(getTranslation('Execute a busca antes de exportar.')); return; }
    
    const labels = chart.data.labels;
    const datasets = {};
    
    const authorKey = getTranslation('Author (received)');
    const curationKey = getTranslation('Curation (received)');
    const pendingKey = getTranslation('Curation pending (estimativa diária 7d)');
    
    const authorDataset = chart.data.datasets.find(d => d.label === authorKey);
    const curationDataset = chart.data.datasets.find(d => d.label === curationKey);
    const pendingDataset = chart.data.datasets.find(d => d.label === pendingKey);

    if (authorDataset) datasets[authorKey] = authorDataset.data;
    if (curationDataset) datasets[curationKey] = curationDataset.data;
    if (pendingDataset) datasets[pendingKey] = pendingDataset.data;
    
    const headers = ['date', ...Object.keys(datasets)];
    let csv = headers.join(',') + '\n';
    
    for (let i = 0; i < labels.length; i++) {
        const row = [labels[i]];
        headers.slice(1).forEach(header => {
            const val = datasets[header][i];
            row.push(val !== null ? val : '');
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

// Função para lidar com a mudança do seletor RPC
function handleRpcChange() {
    const rpcSelect = $('rpcSelect');
    const rpcCustomInput = $('rpcCustomInput');
    if (!rpcSelect || !rpcCustomInput) return;

    if (rpcSelect.value === 'custom') {
        rpcCustomInput.style.display = 'block';
    } else {
        rpcCustomInput.style.display = 'none';
    }
}

// Função para lidar com a mudança de idioma
function handleLangChange(e) {
    currentLang = e.target.value;
    sessionStorage.setItem('preferredLang', currentLang); // Salva no SessionStorage
    translate(currentLang); // Traduz a interface estática
    
    if (chart && chart.data) {
        // Redesenha o gráfico para traduzir legendas
        const authorData = chart.data.datasets.find(d => d.label === getTranslation('Author (received)', 'pt') || d.label === getTranslation('Author (received)', 'en'))?.data;
        const curationData = chart.data.datasets.find(d => d.label === getTranslation('Curation (received)', 'pt') || d.label === getTranslation('Curation (received)', 'en'))?.data;
        const pendingData = chart.data.datasets.find(d => d.label === getTranslation('Curation pending (estimativa diária 7d)', 'pt') || d.label === getTranslation('Curation pending (estimativa diária 7d)', 'en'))?.data;

        renderChart(chart.data.labels, authorData, curationData, pendingData);
    }
    
    resetButton();
}

// Inicializa os listeners quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    
    const fetchBtn = document.getElementById('fetchBtn');
    if (fetchBtn) {
        fetchBtn.addEventListener('click', fetchAndRender);
    }

    const exportCsvBtn = document.getElementById('exportCsv');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', downloadCsv);
    }

    // Listener para o seletor de RPC
    const rpcSelect = $('rpcSelect'); 
    if (rpcSelect) {
        rpcSelect.addEventListener('change', handleRpcChange);
    }

    // Listener para o seletor de idioma
    const langSelect = $('langSelect'); 
    if (langSelect) {
        // Verifica se há um idioma salvo no SessionStorage
        const savedLang = sessionStorage.getItem('preferredLang');
        if (savedLang) {
            currentLang = savedLang;
            langSelect.value = savedLang;
        } else {
            currentLang = langSelect.value;
        }
        
        langSelect.addEventListener('change', handleLangChange);
        
        // Aplica a tradução (salva ou padrão) ao carregar
        translate(currentLang);
    }

    // Preenchimento inicial (limpa os campos)
    const accountInputEl = $('accountInput');
    if (accountInputEl) accountInputEl.value = '';
    
    // (Não limpa o RPC para manter o padrão)
    // const rpcInputEl = $('rpcCustomInput');
    // if (rpcInputEl) rpcInputEl.value = '';
});