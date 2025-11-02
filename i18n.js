// i18n.js

/**
 * Mapeamento de traduções. A chave é o texto original em PT-BR.
 * @type {object}
 */
export const translations = {
    // HEADER
    'Blurt Rewards Dashboard': { 
        'en': 'Blurt Rewards Dashboard',
        'pl': 'Panel Nagród Blurt',
        'de': 'Blurt Rewards Dashboard',
        'zh': 'Blurt 奖励仪表板',
        'es': 'Panel de Recompensas de Blurt',
        'fr': 'Tableau de Bord des Récompenses Blurt',
        'ja': 'Blurt報酬ダッシュボード',
    },
    'Últimos 30 dias — recompensas recebidas e estimativas de pending (próx. 7 dias)': { 
        'en': 'Last 30 days — received rewards and pending estimates (next 7 days)',
        'pl': 'Ostatnie 30 dni — otrzymane nagrody i szacowane oczekujące (następne 7 dni)',
        'de': 'Letzte 30 Tage — erhaltene Belohnungen und geschätzte ausstehende (nächste 7 Tage)',
        'zh': '过去 30 天 — 已收到的奖励和待处理预估 (接下来的 7 天)',
        'es': 'Últimos 30 días — recompensas recibidas y estimaciones pendientes (próx. 7 días)',
        'fr': '30 derniers jours — récompenses reçues et estimations en attente (prochaines 7 jours)',
        'ja': '過去30日間 — 受け取った報酬と保留中の見積もり (今後7日間)',
    },
    
    // CONTROLS
    'Conta:': { 
        'en': 'Account:',
        'pl': 'Konto:',
        'de': 'Konto:',
        'zh': '账户:',
        'es': 'Cuenta:',
        'fr': 'Compte :',
        'ja': 'アカウント:',
    },
    'RPC / nodo:': { 
        'en': 'RPC / Node:',
        'pl': 'RPC / Węzeł:',
        'de': 'RPC / Node:',
        'zh': 'RPC / 节点:',
        'es': 'RPC / Nodo:',
        'fr': 'RPC / Nœud :',
        'ja': 'RPC / ノード:',
    },
    'Custom...': { 
        'en': 'Custom...', // NOVO
        'pl': 'Własny...',
        'de': 'Benutzerdefiniert...',
        'zh': '自定义...',
        'es': 'Personalizado...',
        'fr': 'Personnalisé...',
        'ja': 'カスタム...',
    },
    'Buscar': { 
        'en': 'Fetch',
        'pl': 'Pobierz',
        'de': 'Abrufen',
        'zh': '获取',
        'es': 'Buscar',
        'fr': 'Récupérer',
        'ja': '取得',
    },
    'Dica: aumente limite se tiver muitas postagens': { 
        'en': 'Tip: increase limit if you have many posts',
        'pl': 'Wskazówka: zwiększ limit, jeśli masz wiele postów',
        'de': 'Tipp: Erhöhen Sie das Limit, wenn Sie viele Beiträge haben',
        'zh': '提示: 如果您有很多帖子，请增加限制',
        'es': 'Consejo: aumente el límite si tiene muchas publicaciones',
        'fr': 'Conseil : augmentez la limite si vous avez beaucoup de publications',
        'ja': 'ヒント: 投稿が多い場合は制限を増やしてください',
    },
    'Este site usa as chamadas JSON-RPC da API "condenser_api" (get_account_history, get_discussions_by_blog, get_content). Configure o RPC caso o padrão não funcione.': { 
        'en': 'This site uses JSON-RPC calls from the "condenser_api" (get_account_history, get_discussions_by_blog, get_content). Configure the RPC if the default one does not work.',
        'pl': 'Ta strona używa wywołań JSON-RPC z API "condenser_api" (get_account_history, get_discussions_by_blog, get_content). Skonfiguruj węzeł RPC, jeśli domyślny nie działa.',
        'de': 'Diese Seite verwendet JSON-RPC-Aufrufe der "condenser_api" (get_account_history, get_discussions_by_blog, get_content). Konfigurieren Sie den RPC, falls der Standard nicht funktioniert.',
        'zh': '本网站使用 "condenser_api" 的 JSON-RPC 调用 (get_account_history, get_discussions_by_blog, get_content)。如果默认节点不工作，请配置 RPC。',
        'es': 'Este sitio utiliza llamadas JSON-RPC de la API "condenser_api" (get_account_history, get_discussions_by_blog, get_content). Configure el RPC si el predeterminado no funciona.',
        'fr': 'Ce site utilise les appels JSON-RPC de l\'API "condenser_api" (get_account_history, get_discussions_by_blog, get_content). Configurez le RPC si celui par défaut ne fonctionne pas.',
        'ja': 'このサイトは "condenser_api" API (get_account_history, get_discussions_by_blog, get_content) の JSON-RPC 呼び出しを使用します。デフォルトが機能しない場合は RPC を設定してください。',
    },
    
    // RESUMO & GRÁFICO
    'Resumo (30 dias)': { 
        'en': 'Summary (30 days)',
        'pl': 'Podsumowanie (30 dni)',
        'de': 'Zusammenfassung (30 Tage)',
        'zh': '摘要 (30 天)',
        'es': 'Resumen (30 días)',
        'fr': 'Résumé (30 jours)',
        'ja': '概要 (30日間)',
    },
    'Atualizado:': { 
        'en': 'Updated:',
        'pl': 'Zaktualizowano:',
        'de': 'Aktualisiert:',
        'zh': '更新于:',
        'es': 'Actualizado:',
        'fr': 'Mis à jour :',
        'ja': '更新日時:',
    },
    'Curation recebido': { 
        'en': 'Curation received',
        'pl': 'Otrzymana Kuracja',
        'de': 'Erhaltene Kuratierung',
        'zh': '已收到的策展奖励',
        'es': 'Curación recibida',
        'fr': 'Curation reçue',
        'ja': 'キュレーション受取',
    },
    'Author recebido': { 
        'en': 'Author received',
        'pl': 'Otrzymana Nagroda Autorska',
        'de': 'Erhaltene Autoren-Belohnung',
        'zh': '已收到的作者奖励',
        'es': 'Autor recibido',
        'fr': 'Récompense d\'auteur reçue',
        'ja': '著者報酬受取',
    },
    'Pending author (7d)': { 
        'en': 'Pending author (7d)',
        'pl': 'Oczekująca Nagroda Autorska (7d)',
        'de': 'Ausstehende Autoren-Belohnung (7T)',
        'zh': '待处理作者奖励 (7天)',
        'es': 'Autor pendiente (7d)',
        'fr': 'Auteur en attente (7j)',
        'ja': '保留中の著者報酬 (7日間)',
    },
    'Estimated pending curation (7d)': { 
        'en': 'Estimated pending curation (7d)',
        'pl': 'Szacowana oczekująca Kuracja (7d)',
        'de': 'Geschätzte ausstehende Kuratierung (7T)',
        'zh': '预估待处理策展奖励 (7天)',
        'es': 'Estimación de curación pendiente (7d)',
        'fr': 'Estimation curation en attente (7j)',
        'ja': '保留中のキュレーション見積もり (7日間)',
    },
    'Legenda': { 
        'en': 'Legend',
        'pl': 'Legenda',
        'de': 'Legende',
        'zh': '图例',
        'es': 'Leyenda',
        'fr': 'Légende',
        'ja': '凡例',
    },
    'Curation (received)': { 
        'en': 'Curation (received)',
        'pl': 'Kuracja (otrzymana)',
        'de': 'Kuratierung (erhalten)',
        'zh': '策展 (已收到)',
        'es': 'Curación (recibida)',
        'fr': 'Curation (reçue)',
        'ja': 'キュレーション (受取済)',
    },
    'Author (received)': { 
        'en': 'Author (received)',
        'pl': 'Nagroda Autorska (otrzymana)',
        'de': 'Autoren-Belohnung (erhalten)',
        'zh': '作者奖励 (已收到)',
        'es': 'Autor (recibido)',
        'fr': 'Auteur (reçu)',
        'ja': '著者報酬 (受取済)',
    },
    'Curation pending (estimativa diária 7d)': { 
        'en': 'Curation pending (daily estimate 7d)',
        'pl': 'Oczekująca Kuracja (dzienny szacunek 7d)',
        'de': 'Ausstehende Kuratierung (tägliche Schätzung 7T)',
        'zh': '待处理策展奖励 (7天每日预估)',
        'es': 'Curación pendiente (estimación diaria 7d)',
        'fr': 'Curation en attente (estimation quotidienne 7j)',
        'ja': '保留中のキュレーション (7日間、日次見積もり)',
    },
    
    // INTERAÇÕES
    'Votantes (Quem votou em você - 30d)': { 
        'en': 'Voters (Who voted on you - 30d)',
        'pl': 'Głosujący (Kto na Ciebie głosował - 30d)',
        'de': 'Wähler (Wer hat für Sie gestimmt - 30T)',
        'zh': '投票者 (谁给您投了票 - 30天)',
        'es': 'Votantes (Quién votó por usted - 30d)',
        'fr': 'Votants (Ceux qui ont voté pour vous - 30j)',
        'ja': '投票者 (あなたに投票した人 - 30日間)',
    },
    'Seus Últimos Votos (7d)': { 
        'en': 'Your Last Votes (7d)',
        'pl': 'Twoje Ostatnie Głosy (7d)',
        'de': 'Ihre letzten Stimmen (7T)',
        'zh': '您的最后投票 (7天)',
        'es': 'Sus Últimos Votos (7d)',
        'fr': 'Vos Derniers Votes (7j)',
        'ja': 'あなたの最後の投票 (7日間)',
    },
    'Top Commenters (Quem comentou em você - 30d)': { 
        'en': 'Top Commenters (Who commented on you - 30d)',
        'pl': 'Najlepsi Komentujący (Kto skomentował Twoje posty - 30d)',
        'de': 'Top-Kommentatoren (Wer hat Sie kommentiert - 30T)',
        'zh': '热门评论者 (谁评论了您 - 30天)',
        'es': 'Top Commenters (Quién le comentó - 30d)',
        'fr': 'Meilleurs Commentateurs (Ceux qui vous ont commenté - 30j)',
        'ja': 'トップコメント投稿者 (あなたにコメントした人 - 30日間)',
    },
    'Top Comentados (Para quem você comentou - 30d)': { 
        'en': 'Top Commented (Who you commented on - 30d)',
        'pl': 'Najczęściej Komentowani (Kogo skomentowałeś - 30d)',
        'de': 'Top-Kommentiert (Wen Sie kommentiert haben - 30T)',
        'zh': '热门被评论者 (您评论了谁 - 30天)',
        'es': 'Top Comentados (A quién comentó - 30d)',
        'fr': 'Top Commentés (Ceux que vous avez commentés - 30j)',
        'ja': 'トップ被コメント者 (あなたがコメントした人 - 30日間)',
    },
    'Nenhum voto dado nos últimos 7 dias.': { 
        'en': 'No votes given in the last 7 days.',
        'pl': 'Brak oddanych głosów w ciągu ostatnich 7 dni.',
        'de': 'In den letzten 7 Tagen wurden keine Stimmen abgegeben.',
        'zh': '过去 7 天内没有投出任何票。',
        'es': 'Ningún voto emitido en los últimos 7 días.',
        'fr': 'Aucun vote émis au cours des 7 derniers jours.',
        'ja': '過去7日間に投票はありません。',
    },
    'Nenhum votante nos últimos 30 dias.': { 
        'en': 'No voters in the last 30 days.',
        'pl': 'Brak głosujących w ciągu ostatnich 30 dni.',
        'de': 'Keine Wähler in den letzten 30 Tagen.',
        'zh': '过去 30 天内没有投票者。',
        'es': 'Ningún votante en los últimos 30 días.',
        'fr': 'Aucun votant au cours des 30 derniers jours.',
        'ja': '過去30日間に投票者はいません。',
    },
    'Nenhum comentário feito nos últimos 30 dias.': { 
        'en': 'No comments made in the last 30 days.',
        'pl': 'Brak komentarzy dodanych w ciągu ostatnich 30 dni.',
        'de': 'In den letzten 30 Tagen wurden keine Kommentare abgegeben.',
        'zh': '过去 30 天内没有发表评论。',
        'es': 'Ningún comentario realizado en los últimos 30 días.',
        'fr': 'Aucun commentaire effectué au cours des 30 derniers jours.',
        'ja': '過去30日間にコメントはありません。',
    },
    'Nenhum comentário recebido nos últimos 30 dias.': { 
        'en': 'No comments received in the last 30 days.',
        'pl': 'Brak otrzymanych komentarzy w ciągu ostatnich 30 dni.',
        'de': 'In den letzten 30 Tagen wurden keine Kommentare erhalten.',
        'zh': '过去 30 天内没有收到评论。',
        'es': 'Ningún comentario recibido en los últimos 30 días.',
        'fr': 'Aucun commentaire reçu au cours des 30 derniers jours.',
        'ja': '過去30日間にコメントは受信されていません。',
    },

    // ESTATÍSTICAS DA CONTA
    'Estatísticas da Conta': { 
        'en': 'Account Statistics',
        'pl': 'Statystyki Konta',
        'de': 'Kontostatistiken',
        'zh': '账户统计',
        'es': 'Estadísticas de la Cuenta',
        'fr': 'Statistiques du Compte',
        'ja': 'アカウント統計',
    },
    'Voting Power (VP)': { 
        'en': 'Voting Power (VP)',
        'pl': 'Siła Głosowania (VP)',
        'de': 'Voting Power (VP)',
        'zh': '投票能力 (VP)',
        'es': 'Poder de Voto (VP)',
        'fr': 'Puissance de Vote (VP)',
        'ja': '投票力 (VP)',
    },
    'Blurt Power (BP)': { 
        'en': 'Blurt Power (BP)',
        'pl': 'Blurt Power (BP)',
        'de': 'Blurt Power (BP)',
        'zh': 'Blurt Power (BP)',
        'es': 'Blurt Power (BP)',
        'fr': 'Blurt Power (BP)',
        'ja': 'Blurt Power (BP)',
    },
    'Blurt Líquido': { 
        'en': 'Liquid Blurt',
        'pl': 'Blurt Płynny',
        'de': 'Liquid Blurt',
        'zh': '流动 Blurt',
        'es': 'Blurt Líquido',
        'fr': 'Blurt Liquide',
        'ja': '流動性 Blurt',
    },
    'APR Estimado (Curation 7d)': { 
        'en': 'Estimated APR (Curation 7d)', // NOVO
        'pl': 'Szacowany APR (Kuracja 7d)',
        'de': 'Geschätzter APR (Kuratierung 7T)',
        'zh': '预估年利率 (策展 7天)',
        'es': 'APR Estimado (Curación 7d)',
        'fr': 'APR Estimé (Curation 7j)',
        'ja': '推定APR (キュレーション 7日間)',
    },

    // PLACEHOLDER & HINT (adicionados na última interação)
    'ex: seuusuario': { 
        'en': 'ex: yourusername',
        'pl': 'np.: twojanazwa',
        'de': 'z.B.: ihrbenutzername',
        'zh': '例如: 您的用户名',
        'es': 'ej: suusuario',
        'fr': 'ex: votreutilisateur',
        'ja': '例: あなたのユーザー名',
    },
    'Username': { // Mantido conforme fornecido, embora 'seu usuario?' fosse o texto
        'en': 'your username?',
        'pl': 'twoja nazwa użytkownika?',
        'de': 'ihr Benutzername?',
        'zh': '您的用户名?',
        'es': '¿su nombre de usuario?',
        'fr': 'votre nom d\'utilisateur ?',
        'ja': 'あなたのユーザー名ですか？',
    },

    // CONFIG & DETALHES
    'Exportar CSV': { 
        'en': 'Exportar CSV',
        'pl': 'Exportar CSV',
        'de': 'Exportar CSV',
        'zh': 'Exportar CSV',
        'es': 'Exportar CSV',
        'fr': 'Exportar CSV',
        'ja': 'Exportar CSV',
    },
    'Opções e notas técnicas': { 
        'en': 'Options and technical notes',
        'pl': 'Opcje i notatki techniczne',
        'de': 'Optionen und technische Hinweise',
        'zh': '选项和技术说明',
        'es': 'Opciones y notas técnicas',
        'fr': 'Options et notes techniques',
        'ja': 'オプションと技術ノート',
    },
    'Busca histórico de operações (get_account_history) para extrair curation_reward e author_reward.': { 
        'en': 'Fetches operation history (get_account_history) to extract curation_reward and author_reward.',
        'pl': 'Pobiera historię operacji (get_account_history) w celu wyodrębnienia curation_reward e author_reward.',
        'de': 'Ruft den Verlauf der Operationen (get_account_history) ab, um curation_reward und author_reward zu extrahieren.',
        'zh': '获取操作历史记录 (get_account_history) 以提取 curation_reward 和 author_reward。',
        'es': 'Busca historial de operaciones (get_account_history) para extraer curation_reward y author_reward.',
        'fr': 'Récupère l\'historique des opérations (get_account_history) pour extraire curation_reward et author_reward.',
        'ja': '操作履歴 (get_account_history) を取得し、curation_reward と author_reward を抽出します。',
    },
    'Busca posts recentes via get_discussions_by_blog (limit configurable) e usa get_content para ler pending_payout_value e cashout_time.': { 
        'en': 'Fetches recent posts via get_discussions_by_blog (limit configurable) and uses get_content to read pending_payout_value and cashout_time.',
        'pl': 'Pobiera najnowsze posty poprzez get_discussions_by_blog (konfigurowalny limit) i używa get_content do odczytania pending_payout_value i cashout_time.',
        'de': 'Ruft aktuelle Beiträge über get_discussions_by_blog (Limit konfigurierbar) ab und verwendet get_content, um pending_payout_value und cashout_time zu lesen.',
        'zh': '通过 get_discussions_by_blog 获取最新帖子 (可配置限制) 并使用 get_content 读取 pending_payout_value 和 cashout_time。',
        'es': 'Busca publicaciones recientes a través de get_discussions_by_blog (límite configurable) y usa get_content para leer pending_payout_value y cashout_time.',
        'fr': 'Récupère les posts récents via get_discussions_by_blog (limite configurable) et utilise get_content pour lire pending_payout_value et cashout_time.',
        'ja': 'get_discussions_by_blog 経由で最近の投稿を取得し (制限設定可能)、get_content を使用して pending_payout_value と cashout_time を読み取ります。',
    },
    'Estimativa de pending curation: usa fator de curation_ratio (padrão 25%). Isso é apenas uma estimativa — cálculo real depende dos votos e regras da rede.': { 
        'en': 'Pending curation estimate: uses curation_ratio factor (default 25%). This is only an estimate — the real calculation depends on votes and network rules.',
        'pl': 'Szacowanie oczekującej kuracji: używa współczynnika curation_ratio (domyślnie 25%). Jest to tylko oszacowanie — rzeczywiste obliczenia zależą od głosów i zasad sieci.',
        'de': 'Schätzung der ausstehenden Kuratierung: Verwendet den curation_ratio-Faktor (Standard 25 %). Dies ist nur eine Schätzung — die tatsächliche Berechnung hängt von Stimmen und Netzwerkregeln ab.',
        'zh': '待处理策展奖励预估: 使用策展比例因子 (默认为 25%)。这只是一个估计 — 实际计算取决于投票和网络规则。',
        'es': 'Estimación de curación pendiente: utiliza factor de curation_ratio (predeterminado 25%). Esto es solo una estimación — el cálculo real depende de los votos y las reglas de la red.',
        'fr': 'Estimation curation en attente : utilise le facteur curation_ratio (par défaut 25%). Ce n\'est qu\'une estimation — le calcul réel dépend des votes et des règles du réseau.',
        'ja': '保留中のキュレーションの見積もり: curation_ratio ファクター (デフォルト 25%) を使用します。これは単なる見積もりであり、実際の計算は投票とネットワークルールに依存します。',
    },
    'Limite de posts (get_discussions_by_blog)': { 
        'en': 'Post limit (get_discussions_by_blog)',
        'pl': 'Limit postów (get_discussions_by_blog)',
        'de': 'Beitragslimit (get_discussions_by_blog)',
        'zh': '帖子限制 (get_discussions_by_blog)',
        'es': 'Límite de publicaciones (get_discussions_by_blog)',
        'fr': 'Limite de posts (get_discussions_by_blog)',
        'ja': '投稿制限 (get_discussions_by_blog)',
    },
    'Exportar CSV (30 dias)': { 
        'en': 'Export CSV (30 days)',
        'pl': 'Eksportuj CSV (30 dni)',
        'de': 'CSV exportieren (30 Tage)',
        'zh': '导出 CSV (30 天)',
        'es': 'Exportar CSV (30 días)',
        'fr': 'Exporter CSV (30 jours)',
        'ja': 'CSVをエクスポート (30日間)',
    },

    // LOGS
    'Logs': { 
        'en': 'Logs',
        'pl': 'Logi',
        'de': 'Protokolle',
        'zh': '日志',
        'es': 'Registros',
        'fr': 'Journaux',
        'ja': 'ログ',
    },

    // COMO USAR
    'Como usar': { 
        'en': 'How to use',
        'pl': 'Jak używać',
        'de': 'Wie man es benutzt',
        'zh': '如何使用',
        'es': 'Cómo usar',
        'fr': 'Comment utiliser',
        'ja': '使用方法',
    },
    'Informe sua conta e um RPC funcional.': { 
        'en': 'Enter your account and a functional RPC node.',
        'pl': 'Wprowadź swoje konto i działający węzeł RPC.',
        'de': 'Geben Sie Ihr Konto und einen funktionsfähigen RPC-Node ein.',
        'zh': '输入您的账户和一个可用的 RPC 节点。',
        'es': 'Ingrese su cuenta y un nodo RPC funcional.',
        'fr': 'Entrez votre compte et un nœud RPC fonctionnel.',
        'ja': 'アカウントと機能するRPCノードを入力してください。',
    },
    'Clique em Buscar. Aguarde os requests (pode demorar se limite grande).': { 
        'en': 'Click Fetch. Wait for the requests (may take longer if limit is high).',
        'pl': 'Kliknij Pobierz. Poczekaj na żądania (może to potrwać dłużej, jeśli limit jest wysoki).',
        'de': 'Klicken Sie auf Abrufen. Warten Sie auf die Anfragen (kann bei hohem Limit länger dauern).',
        'zh': '点击获取。等待请求 (如果限制高，可能需要更长时间)。',
        'es': 'Haga clic en Buscar. Espere las solicitudes (puede tardar más si el límite es alto).',
        'fr': 'Cliquez sur Récupérer. Attendez les requêtes (cela peut prendre plus de temps si la limite est élevée).',
        'ja': '取得をクリックしてください。リクエストを待機します (制限が大きい場合は時間がかかることがあります)。',
    },
    'Os gráficos serão preenchidos com as somas diárias dos últimos 30 dias.': { 
        'en': 'The charts will be filled with the daily sums of the last 30 days.',
        'pl': 'Wykresy zostaną wypełnione dziennymi sumami z ostatnich 30 dni.',
        'de': 'Die Diagramme werden mit den täglichen Summen der letzten 30 Tage gefüllt.',
        'zh': '图表将填充过去 30 天的每日总和。',
        'es': 'Los gráficos se llenarán con las sumas diarias de los últimos 30 días.',
        'fr': 'Les graphiques seront remplis avec les sommes quotidiennes des 30 derniers jours.',
        'ja': 'チャートには過去30日間の日次合計が入力されます。',
    },
    'Aviso: dependendo do RPC, algumas chamadas podem falhar por limite de taxa — troque o endpoint se necessário.': { 
        'en': 'Warning: depending on the RPC, some calls may fail due to rate limits — change the endpoint if necessary.',
        'pl': 'Ostrzeżenie: w zależności od węzła RPC, niektóre wywołania mogą zakończyć się niepowodzeniem z powodu limitów szybkości — zmień punkt końcowy, jeśli to konieczne.',
        'de': 'Warnung: Abhängig vom RPC können einige Aufrufe aufgrund von Ratenbegrenzungen fehlschlagen — ändern Sie gegebenenfalls den Endpunkt.',
        'zh': '警告: 根据 RPC 的不同，一些调用可能会因速率限制而失败 — 如有必要，请更改端点。',
        'es': 'Advertencia: dependiendo del RPC, algunas llamadas pueden fallar debido a límites de tasa — cambie el endpoint si es necesario.',
        'fr': 'Avertissement : selon le RPC, certains appels peuvent échouer en raison de limites de débit — changez le point de terminaison si nécessaire.',
        'ja': '警告: RPCによっては、レート制限により一部の呼び出しが失敗する場合があります。必要に応じてエンドポイントを変更してください。',
    },

    // FOOTER
    'Criado por @bgo.': { 
        'en': 'Created by @bgo.',
        'pl': 'Utworzone przez @bgo',
        'de': 'Erstellt von @bgo',
        'zh': '由 @bgo 创建',
        'es': 'Creado por @bgo',
        'fr': 'Créé par @bgo',
        'ja': '@bgo によって作成されました',
    },

    // STATUS E ERROS
    'Calculando...': { 
        'en': 'Calculating...',
        'pl': 'Obliczanie...',
        'de': 'Wird berechnet...',
        'zh': '正在计算...',
        'es': 'Calculando...',
        'fr': 'Calcul en cours...',
        'ja': '計算中...',
    },
    'Buscando...': { 
        'en': 'Fetching...',
        'pl': 'Pobieranie...',
        'de': 'Wird abgerufen...',
        'zh': '正在获取...',
        'es': 'Buscando...',
        'fr': 'Récupération en cours...',
        'ja': '取得中...',
    },
    'Erro geral:': { 
        'en': 'General Error:',
        'pl': 'Błąd ogólny:',
        'de': 'Allgemeiner Fehler:',
        'zh': '一般错误:',
        'es': 'Error general:',
        'fr': 'Erreur générale :',
        'ja': '一般エラー:',
    },
    'Erro:': { 
        'en': 'Error:',
        'pl': 'Błąd:',
        'de': 'Fehler:',
        'zh': '错误:',
        'es': 'Error:',
        'fr': 'Erreur :',
        'ja': 'エラー:',
    },
    'Informe a conta.': { 
        'en': 'Please enter the account.',
        'pl': 'Wprowadź konto.',
        'de': 'Bitte geben Sie das Konto ein.',
        'zh': '请输入账户。',
        'es': 'Por favor ingrese la cuenta.',
        'fr': 'Veuillez entrer le compte.',
        'ja': 'アカウントを入力してください。',
    },
    'Execute a busca antes de exportar.': { 
        'en': 'Execute the search before exporting.',
        'pl': 'Wykonaj pobieranie przed eksportem.',
        'de': 'Führen Sie die Abfrage vor dem Exportieren aus.',
        'zh': '导出前请执行获取操作。',
        'es': 'Ejecute la búsqueda antes de exportar.',
        'fr': 'Exécutez la recherche avant d\'exporter.',
        'ja': 'エクスポート前に検索を実行してください。',
    },
    
    // TEXTOS DINÂMICOS (UNIDADES E PLURALIZAÇÃO)
    'BLURT (estim. total)': { 
        'en': 'BLURT (total estim.)',
        'pl': 'BLURT (szac. suma)',
        'de': 'BLURT (Gesamtschätzung)',
        'zh': 'BLURT (总预估)',
        'es': 'BLURT (estim. total)',
        'fr': 'BLURT (estim. totale)',
        'ja': 'BLURT (合計見積)',
    },
    'BLURT': { 
        'en': 'BLURT',
        'pl': 'BLURT',
        'de': 'BLURT',
        'zh': 'BLURT',
        'es': 'BLURT',
        'fr': 'BLURT',
        'ja': 'BLURT',
    },
    'votos': { 
        'en': 'votes',
        'pl': 'głosów',
        'de': 'Stimmen',
        'zh': '票',
        'es': 'votos',
        'fr': 'votes',
        'ja': '票',
    },
    'voto': { 
        'en': 'vote',
        'pl': 'głos',
        'de': 'Stimme',
        'zh': '票',
        'es': 'voto',
        'fr': 'vote',
        'ja': '票',
    },
    'vezes': { 
        'en': 'times',
        'pl': 'razy',
        'de': 'Mal',
        'zh': '次',
        'es': 'veces',
        'fr': 'fois',
        'ja': '回',
    },
    'vez': { 
        'en': 'time',
        'pl': 'raz',
        'de': 'Mal',
        'zh': '次',
        'es': 'vez',
        'fr': 'fois',
        'ja': '回',
    },
    // CHART LABELS
    'Estimated Pending Curation (7d, diário)': { 
        'en': 'Estimated Pending Curation (7d, daily)',
        'pl': 'Szacowana Oczekująca Kuracja (7d, dziennie)',
        'de': 'Geschätzte ausstehende Kuratierung (7T, täglich)',
        'zh': '预估待处理策展奖励 (7天, 每日)',
        'es': 'Estimación Curación Pendiente (7d, diaria)',
        'fr': 'Estimation Curation en Attente (7j, quotidienne)',
        'ja': '保留中のキュレーション見積もり (7日間、日次)',
    },
    'Pending Author (7d, diário)': { 
        'en': 'Pending Author (7d, daily)',
        'pl': 'Oczekująca Nagroda Autorska (7d, dziennie)',
        'de': 'Ausstehende Autoren-Belohnung (7T, täglich)',
        'zh': '待处理作者奖励 (7天, 每日)',
        'es': 'Autor Pendiente (7d, diario)',
        'fr': 'Auteur en Attente (7j, quotidien)',
        'ja': '保留中の著者報酬 (7日間、日次)',
    },  
    'Buscando account_history...': {
    "en": "Fetching account_history...",
    "pl": "Pobieranie historii konta...",
    "de": "Kontoverlauf wird abgerufen...",
    "zh": "正在获取账户历史记录...",
    "es": "Buscando historial de cuenta...",
    "fr": "Récupération de l'historique du compte...",
    "ja": "アカウント履歴を取得中..."
  },
  'Buscando recompensas pendentes (posts e comentários)...': {
    "en": "Fetching pending rewards (posts and comments)...",
    "pl": "Pobieranie oczekujących nagród (posty i komentarze)...",
    "de": "Abrufen ausstehender Belohnungen (Beiträge und Kommentare)...",
    "zh": "正在获取待定奖励（帖子和评论）...",
    "es": "Buscando recompensas pendientes (publicaciones y comentarios)...",
    "fr": "Récupération des récompenses en attente (articles et commentaires)...",
    "ja": "保留中の報酬を取得中（投稿とコメント）..."
  },
  '--- Iniciando busca por POSTS pendentes ---':{
    "en": "--- Starting search for pending POSTS ---",
    "pl": "--- Rozpoczynanie wyszukiwania oczekujących POSTÓW ---",
    "de": "--- Suche nach ausstehenden BEITRÄGEN wird gestartet ---",
    "zh": "--- 开始搜索待处理的帖子 ---",
    "es": "--- Iniciando búsqueda de PUBLICACIONES pendientes ---",
    "fr": "--- Démarrage de la recherche des ARTICLES en attente ---",
    "ja": "--- 保留中の投稿の検索を開始 ---"
  },
  '--- Iniciando busca por COMENTÁRIOS pendentes ---': {
    "en": "--- Starting search for pending COMMENTS ---",
    "pl": "--- Rozpoczynanie wyszukiwania oczekujących KOMENTARZY ---",
    "de": "--- Suche nach ausstehenden KOMMENTAREN wird gestartet ---",
    "zh": "--- 开始搜索待处理的评论 ---",
    "es": "--- Iniciando búsqueda de COMENTARIOS pendientes ---",
    "fr": "--- Démarrage de la recherche des COMMENTAIRES en attente ---",
    "ja": "--- 保留中のコメントの検索を開始 ---"
  },
  'Busca de pendentes concluída.':{
    "en": "Pending search completed.",
    "pl": "Wyszukiwanie oczekujących zakończone.",
    "de": "Suche nach ausstehenden abgeschlossen.",
    "zh": "待处理搜索完成。",
    "es": "Búsqueda de pendientes completada.",
    "fr": "Recherche des éléments en attente terminée.",
    "ja": "保留中の検索が完了しました。"
  },
  'Buscando histórico de VOTOS dos últimos 7 dias...': {
    "en": "Fetching VOTES history from the last 7 days...",
    "pl": "Pobieranie historii GŁOSÓW z ostatnich 7 dni...",
    "de": "Abrufen der STIMMEN-Historie der letzten 7 Tage...",
    "zh": "正在获取过去7天的投票历史...",
    "es": "Buscando historial de VOTOS de los últimos 7 días...",
    "fr": "Récupération de l'historique des VOTES des 7 derniers jours...",
    "ja": "過去7日間の投票履歴を取得中..."
  },
  'Buscando Vesting Share Price (BLURT/VESTS)...': {
    "en": "Fetching Vesting Share Price (BLURT/VESTS)...",
    "pl": "Pobieranie ceny udziałów Vesting (BLURT/VESTS)...",
    "de": "Abrufen des Vesting-Anteilspreises (BLURT/VESTS)...",
    "zh": "正在获取锁仓股份价格（BLURT/VESTS）...",
    "es": "Buscando precio de participación en vesting (BLURT/VESTS)...",
    "fr": "Récupération du prix des parts de blocage (BLURT/VESTS)...",
    "ja": "ベスティングシェア価格 (BLURT/VESTS) を取得中..."
  },
  'Buscando interações sociais (votos recebidos, votos dados, comentários)...':{
    "en": "Fetching social interactions (received votes, given votes, comments)...",
    "pl": "Pobieranie interakcji społecznych (otrzymane głosy, oddane głosy, komentarze)...",
    "de": "Abrufen sozialer Interaktionen (erhaltene Stimmen, abgegebene Stimmen, Kommentare)...",
    "zh": "正在获取社交互动（收到的投票、发出的投票、评论）...",
    "es": "Buscando interacciones sociales (votos recibidos, votos dados, comentarios)...",
    "fr": "Récupération des interactions sociales (votes reçus, votes donnés, commentaires)...",
    "ja": "ソーシャルインタラクションを取得中（受け取った投票、送った投票、コメント）..."
  },
'Buscando dados da conta': {
    "en": "Fetching account data",
    "pl": "Pobieranie danych konta",
    "de": "Kontodaten werden abgerufen",
    "zh": "正在获取账户数据",
    "es": "Buscando datos de la cuenta",
    "fr": "Récupération des données du compte",
    "ja": "アカウントデータを取得中"
  },
  'Votos dados (7d, contagem):': {
    "en": "Votes given (7d, count):",
    "pl": "Oddane głosy (7d, liczba):",
    "de": "Abgegebene Stimmen (7T, Anzahl):",
    "zh": "已投赞成票 (7天, 计数):",
    "es": "Votos dados (7d, recuento):",
    "fr": "Votes donnés (7j, décompte) :",
    "ja": "付与された投票 (7日間、カウント):"
  },
  'Votos recebidos:': {
    "en": "Votes received:",
    "pl": "Otrzymane głosy:",
    "de": "Erhaltene Stimmen:",
    "zh": "收到赞成票:",
    "es": "Votos recibidos:",
    "fr": "Votes reçus :",
    "ja": "受信した投票:"
  },
  'ops recebidas:': {
    "en": "ops received:",
    "pl": "odebrane operacje:",
    "de": "erhaltene Operationen:",
    "zh": "收到的操作:",
    "es": "operaciones recibidas:",
    "fr": "opérations reçues :",
    "ja": "受信したオペレーション:"
  },
  'Erro ao processar item:': {
    "en": "Error processing item:",
    "pl": "Błąd przetwarzania elementu:",
    "de": "Fehler bei der Verarbeitung des Elements:",
    "zh": "处理项目时出错:",
    "es": "Error al procesar el elemento:",
    "fr": "Erreur lors du traitement de l'élément :",
    "ja": "アイテム処理エラー:"
  },
  'Votos recentes (7d) encontrados:': {
    "en": "Recent votes (7d) found:",
    "pl": "Znaleziono ostatnie głosy (7d):",
    "de": "Kürzliche Stimmen (7T) gefunden:",
    "zh": "找到近期投票 (7天):",
    "es": "Votos recientes (7d) encontrados:",
    "fr": "Votes récents (7j) trouvés :",
    "ja": "最近の投票 (7日間) が見つかりました:"
  },
'Estimativa de recompensa de curadoria (7d):': {
    "en": "Curation reward estimate (7d):",
    "pl": "Szacowana nagroda za kurację (7d):",
    "de": "Schätzung der Kurationsbelohnung (7T):",
    "zh": "策展奖励预估 (7天):",
    "es": "Estimación de recompensa por curación (7d):",
    "fr": "Estimation de récompense de curation (7j) :",
    "ja": "キュレーション報酬の見積もり (7日間):"
  },
  'Parâmetros inválidos: é necessário account, rpc e rpcCallFn (função).': {
    "en": "Invalid parameters: account, rpc, and rpcCallFn (function) are required.",
    "pl": "Nieprawidłowe parametry: wymagane są account, rpc i rpcCallFn (funkcja).",
    "de": "Ungültige Parameter: account, rpc und rpcCallFn (Funktion) sind erforderlich.",
    "zh": "参数无效: 需要 account、rpc 和 rpcCallFn (函数)。",
    "es": "Parámetros inválidos: se requieren account, rpc y rpcCallFn (función).",
    "fr": "Paramètres invalides : account, rpc et rpcCallFn (fonction) sont requis.",
    "ja": "無効なパラメーター: account, rpc, および rpcCallFn (関数) が必要です。"
  },
  'Idioma:': { 'en': 'Language:', 'de': 'Sprache:', 'es': 'Idioma:', 'fr': 'Langue:', 'pl': 'Język:', 'ja': '言語:', 'zh': '语言:' },
};

/* template
,
  '':{
    "en": "",
    "pl": "",
    "de": "",
    "zh": "",
    "es": "",
    "fr": "",
    "ja": ""
  }
 */

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

    // NOVO: Adicione a lógica para traduzir o placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = translations[key];
        
        if (translation && translation[lang]) {
            el.setAttribute('placeholder', translation[lang]);
        } else {
            // Se não houver tradução, garante que o placeholder padrão seja usado
            el.setAttribute('placeholder', key);
        }
    });



}