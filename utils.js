// Função auxiliar para obter elementos por ID
export const $ = id => document.getElementById(id);

// Função para formatar strings de recompensa (remover moeda e converter para float)
export const fmt = (s) => 
    s ? s.replace(/ BLURT| BLURT_POWER| BLURT\$| VESTS/g, '').trim() : '0.000';

// Função para formatar timestamp em chave de data (YYYY-MM-DD)
export function toDateKey(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
}

// Função para logar mensagens no elemento <pre id="log">
export function log(...t) { 
    $('log').textContent += [...t].join(' ') + '\n'; 
}

const langToCurrencyCodeMap = {
    en: 'USD', // English → Dollar
    de: 'EUR', // Deutsch → Euro
    es: 'EUR', // Español → Euro
    fr: 'EUR', // Français → Euro
    pl: 'PLN', // Polski → Zloty polonês
    pt: 'BRL', // Português → Real brasileiro
    ja: 'JPY', // Japonês → Iene japonês
    zh: 'CNY', // Chinês → Yuan chinês
};

/**
 * Mapeia o código da moeda para o seu símbolo de exibição comum.
 */
const currencyCodeToSymbolMap = {
    USD: ' $ ',
    EUR: ' € ',
    BRL: ' R$ ',
    PLN: ' zł ', // Símbolo para Złoty Polonês
    JPY: ' ¥ ',
    CNY: ' ¥ ',
    // Adicione mais moedas se necessário, ex: 'CAD': 'C$'
};

/**
 * Retorna o símbolo de moeda sugerido com base no código do idioma.
 * * @param {string} langCode - O código do idioma (ex: 'pt', 'en').
 * @returns {string} O símbolo da moeda (ex: 'R$', '$', '€') ou string vazia se o idioma/moeda não for mapeado.
 */
export function getCurrencySymbolByLang(langCode) {
    // Garante que o código do idioma seja minúsculo para correspondência
    const code = langCode.toLowerCase();
    
    // 1. Obtém o código ISO da moeda a partir do código do idioma
    const currencyCode = langToCurrencyCodeMap[code];

    if (!currencyCode) {
        return ''; // Retorna string vazia se o idioma não for suportado
    }
    
    // 2. Obtém o símbolo a partir do código da moeda
    // Retorna o próprio código da moeda como fallback se o símbolo não estiver mapeado
    return currencyCodeToSymbolMap[currencyCode] || currencyCode;
}

