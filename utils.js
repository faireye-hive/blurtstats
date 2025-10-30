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