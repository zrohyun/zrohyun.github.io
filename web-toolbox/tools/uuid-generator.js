/**
 * Tool: UUID Generator
 */
window.mountTool_uuid_generator = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <label style="color: var(--text-secondary); font-size: 0.875rem;">Generate Quantity:</label>
                    <input type="number" id="uuid-count" value="1" min="1" max="500" style="width: 100px; padding: 0.5rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
                </div>
                
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="uuid-uppercase" style="width: 1rem; height: 1rem; accent-color: var(--accent-primary);">
                    <label for="uuid-uppercase" style="color: var(--text-secondary); font-size: 0.875rem; cursor: pointer;">Uppercase</label>
                </div>
                
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="uuid-hyphens" checked style="width: 1rem; height: 1rem; accent-color: var(--accent-primary);">
                    <label for="uuid-hyphens" style="color: var(--text-secondary); font-size: 0.875rem; cursor: pointer;">Include Hyphens</label>
                </div>

                <button id="btn-generate-uuid" class="btn btn-primary">
                    <i data-lucide="refresh-cw"></i> Generate UUIDs
                </button>
            </div>

            <div>
                <label style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">
                    Generated UUIDs (v4)
                    <button id="btn-copy-uuid" class="btn-copy-sm" style="display: flex; align-items: center; gap: 0.25rem;">
                        <i data-lucide="copy" style="width:1rem; height:1rem"></i> Copy All
                    </button>
                </label>
                <textarea id="uuid-output" style="width: 100%; height: 350px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace; font-size: 1rem;" readonly></textarea>
            </div>
        </div>
        <style>
            .btn-copy-sm { background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 0.2rem; border-radius: 4px; }
            .btn-copy-sm:hover { color: var(--text-primary); background: var(--bg-tertiary); }
        </style>
    `;

    const countInput = document.getElementById('uuid-count');
    const upperCheck = document.getElementById('uuid-uppercase');
    const hyphenCheck = document.getElementById('uuid-hyphens');
    const output = document.getElementById('uuid-output');

    // standard UUID v4 generator using crypto API
    function generateUUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    function doGenerate() {
        let count = parseInt(countInput.value) || 1;
        if (count > 500) count = 500;

        const isUpper = upperCheck.checked;
        const hasHyphens = hyphenCheck.checked;

        let results = [];
        for (let i = 0; i < count; i++) {
            let id = generateUUID();
            if (!hasHyphens) id = id.replace(/-/g, '');
            if (isUpper) id = id.toUpperCase();
            results.push(id);
        }

        output.value = results.join('\n');
    }

    document.getElementById('btn-generate-uuid').addEventListener('click', () => {
        const icon = document.querySelector('#btn-generate-uuid i');
        icon.classList.add('lucide-spin');
        doGenerate();
        setTimeout(() => icon.classList.remove('lucide-spin'), 300);
    });

    document.getElementById('btn-copy-uuid').addEventListener('click', function () {
        if (output.value) {
            navigator.clipboard.writeText(output.value);
            const originalHtml = this.innerHTML;
            this.innerHTML = `<i data-lucide="check" style="width:1rem; height:1rem; color: var(--success)"></i> Copied!`;
            lucide.createIcons({ root: this.parentElement });
            setTimeout(() => {
                this.innerHTML = originalHtml;
                lucide.createIcons({ root: this.parentElement });
            }, 2000);
        }
    });

    // Generate once on load
    doGenerate();
};
