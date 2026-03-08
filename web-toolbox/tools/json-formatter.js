/**
 * Tool: JSON Formatter
 */
window.mountTool_json_formatter = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Input JSON</label>
                    <textarea id="json-input" style="width: 100%; height: 300px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" placeholder='{"hello": "world"}'></textarea>
                </div>
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Output JSON</label>
                    <textarea id="json-output" style="width: 100%; height: 300px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" readonly></textarea>
                </div>
            </div>
            
            <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: space-between;">
                <div style="display: flex; gap: 0.75rem;">
                    <button id="btn-format" class="btn btn-primary">
                        <i data-lucide="align-left"></i> Format (2 spaces)
                    </button>
                    <button id="btn-minify" class="btn btn-secondary">
                        <i data-lucide="minimize-2"></i> Minify
                    </button>
                    <button id="btn-clear" class="btn btn-secondary" style="color: var(--danger)">
                        <i data-lucide="trash-2"></i> Clear
                    </button>
                </div>
                
                <button id="btn-copy" class="btn btn-secondary">
                    <i data-lucide="copy"></i> Copy Output
                </button>
            </div>
            <div id="json-error" style="color: var(--danger); margin-top: 1rem; font-size: 0.875rem; display: none;"></div>
        </div>
    `;

    // Script Logic
    const inputEl = document.getElementById('json-input');
    const outputEl = document.getElementById('json-output');
    const errorEl = document.getElementById('json-error');

    function processJson(action) {
        errorEl.style.display = 'none';
        const raw = inputEl.value.trim();
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            if (action === 'format') {
                outputEl.value = JSON.stringify(parsed, null, 2);
            } else if (action === 'minify') {
                outputEl.value = JSON.stringify(parsed);
            }
        } catch (e) {
            errorEl.textContent = `Invalid JSON: ${e.message}`;
            errorEl.style.display = 'block';
        }
    }

    document.getElementById('btn-format').addEventListener('click', () => processJson('format'));
    document.getElementById('btn-minify').addEventListener('click', () => processJson('minify'));

    document.getElementById('btn-clear').addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
        errorEl.style.display = 'none';
    });

    document.getElementById('btn-copy').addEventListener('click', () => {
        if (outputEl.value) {
            navigator.clipboard.writeText(outputEl.value);
            const btn = document.getElementById('btn-copy');
            const originalHtml = btn.innerHTML;
            btn.innerHTML = `<i data-lucide="check" style="color: var(--success)"></i> Copied!`;
            lucide.createIcons({ root: btn });
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                lucide.createIcons({ root: btn });
            }, 2000);
        }
    });
};
