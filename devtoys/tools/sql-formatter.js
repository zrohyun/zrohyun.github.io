/**
 * Tool: SQL Formatter (Basic)
 */
window.mountTool_sql_formatter = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Input SQL Query</label>
                    <textarea id="sql-input" style="width: 100%; height: 350px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" placeholder="SELECT id, name FROM users WHERE id = 1;"></textarea>
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Formatted SQL</label>
                    <textarea id="sql-output" style="width: 100%; height: 350px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" readonly></textarea>
                </div>
            </div>
            
            <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: space-between;">
                <div style="display: flex; gap: 0.75rem;">
                    <button id="btn-format-sql" class="btn btn-primary">
                        <i data-lucide="align-left"></i> Format SQL
                    </button>
                    <button id="btn-minify-sql" class="btn btn-secondary">
                        <i data-lucide="minimize-2"></i> Minify
                    </button>
                </div>
                <button id="btn-copy-sql" class="btn btn-secondary">
                    <i data-lucide="copy"></i> Copy Output
                </button>
            </div>
        </div>
    `;

    const input = document.getElementById('sql-input');
    const output = document.getElementById('sql-output');

    // A very basic SQL formatter focusing on standard keywords
    function formatSql(sql) {
        let text = sql.replace(/\s+/g, ' ');

        const keywords = [
            'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'UPDATE', 'DELETE', 'INSERT INTO', 'VALUES',
            'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'LEFT JOIN', 'RIGHT JOIN',
            'INNER JOIN', 'OUTER JOIN', 'JOIN', 'ON', 'UNION', 'CREATE', 'ALTER', 'DROP', 'SET'
        ];

        keywords.forEach(kw => {
            const regex = new RegExp(`\\b${kw}\\b`, 'gi');
            text = text.replace(regex, `\n${kw.toUpperCase()}`);
        });

        // Add indentation (rudimentary)
        let formatted = '';
        text.split('\n').filter(l => l.trim()).forEach(line => {
            line = line.trim();
            if (line.startsWith('AND ') || line.startsWith('OR ')) {
                formatted += '  ' + line + '\n';
            } else {
                formatted += line + '\n';
            }
        });

        return formatted.trim();
    }

    function minifySql(sql) {
        return sql.replace(/\s+/g, ' ').trim();
    }

    document.getElementById('btn-format-sql').addEventListener('click', () => {
        if (input.value) output.value = formatSql(input.value);
    });

    document.getElementById('btn-minify-sql').addEventListener('click', () => {
        if (input.value) output.value = minifySql(input.value);
    });

    document.getElementById('btn-copy-sql').addEventListener('click', function () {
        if (output.value) {
            navigator.clipboard.writeText(output.value);
            const ref = this;
            const orig = ref.innerHTML;
            ref.innerHTML = `<i data-lucide="check" style="color: var(--success)"></i> Copied!`;
            lucide.createIcons({ root: ref });
            setTimeout(() => { ref.innerHTML = orig; lucide.createIcons({ root: ref }); }, 2000);
        }
    });

    lucide.createIcons({ root: container });
};
