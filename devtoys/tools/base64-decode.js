/**
 * Tool: Base64 Decode
 */
window.mountTool_base64_decode = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Base64 String to Decode</label>
                <textarea id="b64-dec-input" style="width: 100%; height: 150px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" placeholder="SGVsbG8gV29ybGQ="></textarea>
            </div>
            
            <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
                <button id="btn-decode" class="btn btn-primary">
                    <i data-lucide="arrow-down"></i> Decode Base64
                </button>
            </div>

            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Decoded Text Output</label>
                <div style="position: relative;">
                    <textarea id="b64-dec-output" style="width: 100%; height: 150px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" readonly></textarea>
                    <button id="btn-copy-dec" class="btn btn-secondary" style="position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.4rem 0.75rem;">
                        <i data-lucide="copy" style="width: 1rem; height: 1rem;"></i> Copy
                    </button>
                </div>
            </div>
        </div>
    `;

    const inputEl = document.getElementById('b64-dec-input');
    const outputEl = document.getElementById('b64-dec-output');

    document.getElementById('btn-decode').addEventListener('click', () => {
        try {
            // decode base64, preserving unicode correctly
            outputEl.value = decodeURIComponent(escape(atob(inputEl.value.trim())));
        } catch (e) {
            outputEl.value = `Error decoding Base64: ${e.message}. The string might not be properly encoded.`;
        }
    });

    document.getElementById('btn-copy-dec').addEventListener('click', function () {
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
