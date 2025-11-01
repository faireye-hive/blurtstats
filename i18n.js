// i18n.js

/**
 * Mapeamento de traduções. A chave é o texto original em PT-BR.
 * @type {object}
 */
export const translations = {
    // HEADER
    'Blurt Rewards Dashboard': { 'en': 'Blurt Rewards Dashboard' },
    'Últimos 30 dias — recompensas recebidas e estimativas de pending (próx. 7 dias)': { 'en': 'Last 30 days — received rewards and pending estimates (next 7 days)' },
    
    // CONTROLS
    'Conta:': { 'en': 'Account:' },
    'RPC / nodo:': { 'en': 'RPC / Node:' },
    'Custom...': { 'en': 'Custom...' }, // NOVO
    'Buscar': { 'en': 'Fetch' },
    'Dica: aumente limite se tiver muitas postagens': { 'en': 'Tip: increase limit if you have many posts' },
    'Este site usa as chamadas JSON-RPC da API "condenser_api" (get_account_history, get_discussions_by_blog, get_content). Configure o RPC caso o padrão não funcione.': { 'en': 'This site uses JSON-RPC calls from the "condenser_api" (get_account_history, get_discussions_by_blog, get_content). Configure the RPC if the default one does not work.' },
    
    // RESUMO & GRÁFICO
    'Resumo (30 dias)': { 'en': 'Summary (30 days)' },
    'Atualizado:': { 'en': 'Updated:' },
    'Curation recebido': { 'en': 'Curation received' },
    'Author recebido': { 'en': 'Author received' },
    'Pending author (7d)': { 'en': 'Pending author (7d)' },
    'Estimated pending curation (7d)': { 'en': 'Estimated pending curation (7d)' },
    'Legenda': { 'en': 'Legend' },
    'Curation (received)': { 'en': 'Curation (received)' },
    'Author (received)': { 'en': 'Author (received)' },
    'Curation pending (estimativa diária 7d)': { 'en': 'Curation pending (daily estimate 7d)' },
    
    // INTERAÇÕES
    'Votantes (Quem votou em você - 30d)': { 'en': 'Voters (Who voted on you - 30d)' },
    'Seus Últimos Votos (7d)': { 'en': 'Your Last Votes (7d)' },
    'Top Commenters (Quem comentou em você - 30d)': { 'en': 'Top Commenters (Who commented on you - 30d)' },
    'Top Comentados (Para quem você comentou - 30d)': { 'en': 'Top Commented (Who you commented on - 30d)' },
    'Nenhum voto dado nos últimos 7 dias.': { 'en': 'No votes given in the last 7 days.' },
    'Nenhum votante nos últimos 30 dias.': { 'en': 'No voters in the last 30 days.' },
    'Nenhum comentário feito nos últimos 30 dias.': { 'en': 'No comments made in the last 30 days.' },
    'Nenhum comentário recebido nos últimos 30 dias.': { 'en': 'No comments received in the last 30 days.' },

    // ESTATÍSTICAS DA CONTA
    'Estatísticas da Conta': { 'en': 'Account Statistics' },
    'Voting Power (VP)': { 'en': 'Voting Power (VP)' },
    'Blurt Power (BP)': { 'en': 'Blurt Power (BP)' },
    'Blurt Líquido': { 'en': 'Liquid Blurt' },
    'APR Estimado (Curation 7d)': { 'en': 'Estimated APR (Curation 7d)' }, // NOVO

    // LOGS
    'Logs': { 'en': 'Logs' },

    // CONFIG & DETALHES
    'Config & detalhes': { 'en': 'Config & Details' },
    'Opções e notas técnicas': { 'en': 'Options and technical notes' },
    'Busca histórico de operações (get_account_history) para extrair curation_reward e author_reward.': { 'en': 'Fetches operation history (get_account_history) to extract curation_reward and author_reward.' },
    'Busca posts recentes via get_discussions_by_blog (limit configurable) e usa get_content para ler pending_payout_value e cashout_time.': { 'en': 'Fetches recent posts via get_discussions_by_blog (limit configurable) and uses get_content to read pending_payout_value and cashout_time.' },
    'Estimativa de pending curation: usa fator de curation_ratio (padrão 25%). Isso é apenas uma estimativa — cálculo real depende dos votos e regras da rede.': { 'en': 'Pending curation estimate: uses curation_ratio factor (default 25%). This is only an estimate — the real calculation depends on votes and network rules.' },
    'Limite de posts (get_discussions_by_blog)': { 'en': 'Post limit (get_discussions_by_blog)' },
    'Exportar CSV (30 dias)': { 'en': 'Export CSV (30 days)' },

    // COMO USAR
    'Como usar': { 'en': 'How to use' },
    'Informe sua conta e um RPC funcional.': { 'en': 'Enter your account and a functional RPC node.' },
    'Clique em Buscar. Aguarde os requests (pode demorar se limite grande).': { 'en': 'Click Fetch. Wait for the requests (may take longer if limit is high).' },
    'Os gráficos serão preenchidos com as somas diárias dos últimos 30 dias.': { 'en': 'The charts will be filled with the daily sums of the last 30 days.' },
    'Aviso: dependendo do RPC, algumas chamadas podem falhar por limite de taxa — troque o endpoint se necessário.': { 'en': 'Warning: depending on the RPC, some calls may fail due to rate limits — change the endpoint if necessary.' },

    // FOOTER
    'Feito rápido — sinta-se livre para pedir ajustes (cores, fontes, algoritmo de estimativa etc.).': { 'en': 'Made quickly — feel free to ask for adjustments (colors, fonts, estimate algorithm, etc.).' },

    // STATUS E ERROS
    'Calculando...': { 'en': 'Calculating...' },
    'Buscando...': { 'en': 'Fetching...' },
    'Erro geral:': { 'en': 'General Error:' },
    'Erro:': { 'en': 'Error:' },
    'Informe a conta.': { 'en': 'Please enter the account.' },
    'Execute a busca antes de exportar.': { 'en': 'Execute the search before exporting.' },
    
    // TEXTOS DINÂMICOS (UNIDADES E PLURALIZAÇÃO)
    'BLURT (estim. total)': { 'en': 'BLURT (total estim.)' },
    'BLURT': { 'en': 'BLURT' },
    'votos': { 'en': 'votes' },
    'voto': { 'en': 'vote' },
    'vezes': { 'en': 'times' },
    'vez': { 'en': 'time' },
    // CHART LABELS
    'Estimated Pending Curation (7d, diário)': { 'en': 'Estimated Pending Curation (7d, daily)' },
    'Pending Author (7d, diário)': { 'en': 'Pending Author (7d, daily)' },
};

/**
 * A função principal para traduzir o conteúdo.
 * @param {string} lang - O código do idioma (ex: 'en', 'pt').
 */
export function translate(lang) {
    const titleEl = document.querySelector('title');
    if (titleEl && titleEl.hasAttribute('data-i18n')) {
        const key = titleEl.getAttribute('data-i18n'); // O texto em PT
        
        if (lang === 'pt') {
            titleEl.textContent = key; // Reverte para PT
        } else {
            const translation = translations[key];
            if (translation && translation[lang]) {
                titleEl.textContent = translation[lang]; // Traduz para EN
            } else {
                titleEl.textContent = key; // Fallback para PT
            }
        }
    }
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n'); // O texto original em PT
        
        if (lang === 'pt') {
            // Se o idioma for PT, reverte o texto para a chave (o texto em PT)
            el.textContent = key;
        } else {
            // Se for EN, busca a tradução
            const translation = translations[key];
            if (translation && translation[lang]) {
                el.textContent = translation[lang]; // Traduz
            } else {
                el.textContent = key; // Fallback (mantém PT se não houver tradução)
            }
        }
    });
}