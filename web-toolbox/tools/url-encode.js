/**
 * Tool: URL Encode/Decode
 */
window.mountTool_url_encode = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Input String</label>
                <textarea id="url-input" style="width: 100%; height: 150px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" placeholder="https://example.com/?q=hello world"></textarea>
            </div>
            
            <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                <button id="btn-enc-comp" class="btn btn-primary">
                    EncodeURIComponent
                </button>
                <button id="btn-dec-comp" class="btn btn-secondary">
                    DecodeURIComponent
                </button>
                <button id="btn-enc-url" class="btn btn-primary" style="background-color: var(--accent-gradient-start);">
                    EncodeURI
                </button>
                <button id="btn-dec-url" class="btn btn-secondary">
                    DecodeURI
                </button>
            </div>

            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Output Result</label>
                <div style="position: relative;">
                    <textarea id="url-output" style="width: 100%; height: 150px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" readonly></textarea>
                    <button id="btn-copy-url" class="btn btn-secondary" style="position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.4rem 0.75rem;">
                        <i data-lucide="copy" style="width: 1rem; height: 1rem;"></i> Copy
                    </button>
                </div>
            </div>
        </div>
    `;

    const inputEl = document.getElementById('url-input');
    const outputEl = document.getElementById('url-output');

    document.getElementById('btn-enc-comp').addEventListener('click', () => {
        try { outputEl.value = encodeURIComponent(inputEl.value); } catch (e) { outputEl.value = e.message; }
    });

    document.getElementById('btn-dec-comp').addEventListener('click', () => {
        try { outputEl.value = decodeURIComponent(inputEl.value); } catch (e) { outputEl.value = e.message; }
    });

    document.getElementById('btn-enc-url').addEventListener('click', () => {
        try { outputEl.value = encodeURI(inputEl.value); } catch (e) { outputEl.value = e.message; }
    });

    document.getElementById('btn-dec-url').addEventListener('click', () => {
        try { outputEl.value = decodeURI(inputEl.value); } catch (e) { outputEl.value = e.message; }
    });

    document.getElementById('btn-copy-url').addEventListener('click', function () {
        if (outputEl.value) {
            navigator.clipboard.writeText(outputEl.value);
            const originalHtml = this.innerHTML;
            this.innerHTML = `<i data-lucide="check" style="width: 1rem; height: 1rem; color: var(--success)"></i> Copied!`;
            lucide.createIcons({ root: this });
            setTimeout(() => {
                this.innerHTML = originalHtml;
                lucide.createIcons({ root: this });
            }, 2000);
        }
    });
};
