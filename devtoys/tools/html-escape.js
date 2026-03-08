/**
 * Tool: HTML Escape / Unescape
 */
window.mountTool_html_escape = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Input Data</label>
                <textarea id="html-in" style="width: 100%; height: 150px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" placeholder="<div>Hello & Welcome</div>"></textarea>
            </div>
            
            <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                <button id="btn-escape" class="btn btn-primary">
                    Escape HTML
                </button>
                <button id="btn-unescape" class="btn btn-secondary">
                    Unescape HTML
                </button>
            </div>

            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Output Result</label>
                <div style="position: relative;">
                    <textarea id="html-out" style="width: 100%; height: 150px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" readonly></textarea>
                    <button id="btn-copy-html" class="btn btn-secondary" style="position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.4rem 0.75rem;">
                        <i data-lucide="copy" style="width: 1rem; height: 1rem;"></i> Copy
                    </button>
                </div>
            </div>
        </div>
    `;

    const input = document.getElementById('html-in');
    const output = document.getElementById('html-out');

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function unescapeHtml(text) {
        const doc = new DOMParser().parseFromString(text, "text/html");
        return doc.documentElement.textContent;
    }

    document.getElementById('btn-escape').addEventListener('click', () => {
        if (input.value) output.value = escapeHtml(input.value);
    });

    document.getElementById('btn-unescape').addEventListener('click', () => {
        if (input.value) output.value = unescapeHtml(input.value);
    });

    document.getElementById('btn-copy-html').addEventListener('click', function () {
        if (output.value) {
            navigator.clipboard.writeText(output.value);
            const ref = this;
            const orig = ref.innerHTML;
            ref.innerHTML = `<i data-lucide="check" style="width: 1rem; height: 1rem; color: var(--success)"></i> Copied!`;
            lucide.createIcons({ root: ref });
            setTimeout(() => { ref.innerHTML = orig; lucide.createIcons({ root: ref }); }, 2000);
        }
    });

    lucide.createIcons({ root: container });
};
