/**
 * Tool: CSV to JSON Converter
 */
window.mountTool_csv_to_json = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">CSV Input</label>
                    <textarea id="csv-input" style="width: 100%; height: 300px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace; white-space: pre;" placeholder="id,name,age\n1,Alice,30\n2,Bob,25"></textarea>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">JSON Output</label>
                    <textarea id="json-output" style="width: 100%; height: 300px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" readonly></textarea>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <button id="btn-convert" class="btn btn-primary">
                        <i data-lucide="arrow-right-left"></i> Convert to JSON
                    </button>
                    <label class="custom-checkbox">
                        <input type="checkbox" id="csv-has-header" checked>
                        <span>First row is header</span>
                    </label>
                </div>
                
                <button id="btn-copy-json" class="btn btn-secondary">
                    <i data-lucide="copy"></i> Copy JSON
                </button>
            </div>
            <div id="csv-error" style="color: var(--danger); font-size: 0.875rem; display: none;"></div>
        </div>
        <style>
            .custom-checkbox { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none; }
            .custom-checkbox input { width: 1rem; height: 1rem; accent-color: var(--accent-primary); cursor: pointer; }
            .custom-checkbox span { color: var(--text-secondary); font-size: 0.875rem; }
        </style>
    `;

    const input = document.getElementById('csv-input');
    const output = document.getElementById('json-output');
    const errorMsg = document.getElementById('csv-error');
    const hasHeader = document.getElementById('csv-has-header');

    // Simple CSV parser supporting basic quotes
    function parseCSV(str) {
        const arr = [];
        let quote = false;
        let row = 0, col = 0;

        for (let c = 0; c < str.length; c++) {
            let cc = str[c], nc = str[c + 1];
            arr[row] = arr[row] || [];
            arr[row][col] = arr[row][col] || '';

            if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
            if (cc == '"') { quote = !quote; continue; }
            if (cc == ',' && !quote) { ++col; continue; }
            if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
            if (cc == '\n' && !quote) { ++row; col = 0; continue; }
            if (cc == '\r' && !quote) { ++row; col = 0; continue; }

            arr[row][col] += cc;
        }
        return arr;
    }

    document.getElementById('btn-convert').addEventListener('click', () => {
        errorMsg.style.display = 'none';
        const txt = input.value.trim();
        if (!txt) return;

        try {
            const parsed = parseCSV(txt);
            if (parsed.length === 0) return;

            let result;
            if (hasHeader.checked) {
                const headers = parsed[0];
                result = [];
                for (let i = 1; i < parsed.length; i++) {
                    if (parsed[i].length === 1 && parsed[i][0] === "") continue; // skip empty rows
                    const obj = {};
                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j]] = parsed[i][j];
                    }
                    result.push(obj);
                }
            } else {
                result = parsed;
            }

            output.value = JSON.stringify(result, null, 2);
        } catch (e) {
            errorMsg.textContent = "Error parsing CSV: " + e.message;
            errorMsg.style.display = 'block';
        }
    });

    document.getElementById('btn-copy-json').addEventListener('click', function () {
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
