/**
 * Tool: Text Diff Checker
 */
window.mountTool_text_diff = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Original Text</label>
                    <textarea id="diff-original" style="width: 100%; height: 200px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" placeholder="Enter original text here..."></textarea>
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Modified Text</label>
                    <textarea id="diff-modified" style="width: 100%; height: 200px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" placeholder="Enter modified text here..."></textarea>
                </div>
            </div>
            
            <div style="display: flex; gap: 0.75rem; margin-bottom: 2rem;">
                <button id="btn-compare" class="btn btn-primary">
                    <i data-lucide="git-compare"></i> Compare Texts
                </button>
                <button id="btn-clear" class="btn btn-secondary" style="color: var(--danger)">
                    <i data-lucide="trash-2"></i> Clear Both
                </button>
            </div>

            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Difference Result</label>
                <div id="diff-output" style="width: 100%; min-height: 200px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); font-family: monospace; white-space: pre-wrap; overflow-x: auto;">
                    <span style="color: var(--text-tertiary);">Click 'Compare Texts' to see differences...</span>
                </div>
            </div>
        </div>

        <style>
            .diff-added { background-color: rgba(16, 185, 129, 0.2); color: #10b981; }
            .diff-removed { background-color: rgba(239, 68, 68, 0.2); color: #ef4444; text-decoration: line-through; }
            .diff-line { display: block; border-left: 2px solid transparent; padding-left: 0.5rem; }
            .diff-line.added { border-left-color: #10b981; background-color: rgba(16, 185, 129, 0.05); }
            .diff-line.removed { border-left-color: #ef4444; background-color: rgba(239, 68, 68, 0.05); }
        </style>
    `;

    // Basic word/line diff implementation (simplified for vanilla JS without heavy libraries)
    document.getElementById('btn-compare').addEventListener('click', () => {
        const originalStr = document.getElementById('diff-original').value;
        const modifiedStr = document.getElementById('diff-modified').value;
        const output = document.getElementById('diff-output');

        if (!originalStr && !modifiedStr) {
            output.innerHTML = '<span style="color: var(--text-tertiary);">Please enter text in both fields to compare.</span>';
            return;
        }

        const origLines = originalStr.split('\n');
        const modLines = modifiedStr.split('\n');

        let html = '';
        const maxLines = Math.max(origLines.length, modLines.length);

        for (let i = 0; i < maxLines; i++) {
            const oLine = origLines[i] !== undefined ? origLines[i] : null;
            const mLine = modLines[i] !== undefined ? modLines[i] : null;

            if (oLine === mLine) {
                html += `<span class="diff-line">${escapeHtml(oLine)}</span>`;
            } else if (oLine !== null && mLine !== null) {
                html += `<span class="diff-line removed">- ${escapeHtml(oLine)}</span>`;
                html += `<span class="diff-line added">+ ${escapeHtml(mLine)}</span>`;
            } else if (oLine !== null) {
                html += `<span class="diff-line removed">- ${escapeHtml(oLine)}</span>`;
            } else if (mLine !== null) {
                html += `<span class="diff-line added">+ ${escapeHtml(mLine)}</span>`;
            }
        }

        output.innerHTML = html || 'Texts are identical.';
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
        document.getElementById('diff-original').value = '';
        document.getElementById('diff-modified').value = '';
        document.getElementById('diff-output').innerHTML = '<span style="color: var(--text-tertiary);">Click \'Compare Texts\' to see differences...</span>';
    });

    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};
