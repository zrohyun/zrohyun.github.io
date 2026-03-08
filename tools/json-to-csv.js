/**
 * Tool: JSON to CSV Converter
 */
window.mountTool_json_to_csv = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">JSON Array Input</label>
                    <textarea id="json-input" style="width: 100%; height: 300px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" placeholder='[\n  {"id": 1, "name": "Alice"},\n  {"id": 2, "name": "Bob"}\n]'></textarea>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">CSV Output</label>
                    <textarea id="csv-output" style="width: 100%; height: 300px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace; white-space: pre;" readonly></textarea>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <button id="btn-convert" class="btn btn-primary">
                    <i data-lucide="arrow-right-left"></i> Convert to CSV
                </button>
                
                <button id="btn-copy-csv" class="btn btn-secondary">
                    <i data-lucide="copy"></i> Copy CSV
                </button>
            </div>
            <div id="json-error" style="color: var(--danger); font-size: 0.875rem; display: none;"></div>
        </div>
    `;

    const input = document.getElementById('json-input');
    const output = document.getElementById('csv-output');
    const errorMsg = document.getElementById('json-error');

    function escapeCSV(val) {
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    document.getElementById('btn-convert').addEventListener('click', () => {
        errorMsg.style.display = 'none';
        const txt = input.value.trim();
        if (!txt) return;

        try {
            const parsed = JSON.parse(txt);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                throw new Error("Input must be a non-empty JSON array of objects.");
            }

            // Extract headers
            const headers = new Set();
            parsed.forEach(obj => {
                if (typeof obj === 'object' && obj !== null) {
                    Object.keys(obj).forEach(k => headers.add(k));
                }
            });

            const headerArr = Array.from(headers);
            let csv = headerArr.map(escapeCSV).join(',') + '\n';

            parsed.forEach(obj => {
                if (typeof obj === 'object' && obj !== null) {
                    const row = headerArr.map(h => escapeCSV(obj[h]));
                    csv += row.join(',') + '\n';
                }
            });

            output.value = csv;
        } catch (e) {
            errorMsg.textContent = "Error: " + e.message;
            errorMsg.style.display = 'block';
        }
    });

    document.getElementById('btn-copy-csv').addEventListener('click', function () {
        if (output.value) {
            navigator.clipboard.writeText(output.value);
            const originalHtml = this.innerHTML;
            this.innerHTML = `<i data-lucide="check" style="color: var(--success)"></i> Copied!`;
            lucide.createIcons({ root: this });
            setTimeout(() => {
                this.innerHTML = originalHtml;
                lucide.createIcons({ root: this });
            }, 2000);
        }
    });
};
