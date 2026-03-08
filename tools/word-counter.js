/**
 * Tool: Word Counter
 */
window.mountTool_word_counter = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); text-align: center; border: 1px solid var(--border-color);">
                    <div id="stat-chars" style="font-size: 2.5rem; font-weight: 700; color: var(--accent-primary); line-height: 1;">0</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem; font-weight: 500;">Characters</div>
                </div>
                <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); text-align: center; border: 1px solid var(--border-color);">
                    <div id="stat-words" style="font-size: 2.5rem; font-weight: 700; color: var(--accent-primary); line-height: 1;">0</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem; font-weight: 500;">Words</div>
                </div>
                <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); text-align: center; border: 1px solid var(--border-color);">
                    <div id="stat-lines" style="font-size: 2.5rem; font-weight: 700; color: var(--accent-primary); line-height: 1;">0</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem; font-weight: 500;">Lines</div>
                </div>
                <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); text-align: center; border: 1px solid var(--border-color);">
                    <div id="stat-bytes" style="font-size: 2.5rem; font-weight: 700; color: var(--accent-primary); line-height: 1;">0</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem; font-weight: 500;">Bytes</div>
                </div>
            </div>

            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <label style="color: var(--text-secondary); font-size: 0.875rem;">Text Input</label>
                    <button id="btn-clear" class="btn-copy-sm" style="color: var(--danger); font-size: 0.875rem; display: flex; align-items: center; gap: 0.25rem;">
                        <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i> Clear
                    </button>
                </div>
                <textarea id="text-input" style="width: 100%; height: 250px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-size: 1rem;" placeholder="Type or paste your text here..."></textarea>
            </div>
        </div>

        <style>
            .btn-copy-sm { background: none; border: none; cursor: pointer; padding: 0.2rem; border-radius: 4px; }
            .btn-copy-sm:hover { background: var(--bg-tertiary); }
            #text-input:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
        </style>
    `;

    const input = document.getElementById('text-input');
    const charsEl = document.getElementById('stat-chars');
    const wordsEl = document.getElementById('stat-words');
    const linesEl = document.getElementById('stat-lines');
    const bytesEl = document.getElementById('stat-bytes');

    function updateStats() {
        const text = input.value;
        charsEl.textContent = text.length;

        // Count words (excluding completely empty lines/spaces)
        const wordArr = text.match(/\b[-?a-zA-Z0-9가-힣_]+\b/g) || [];
        wordsEl.textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

        linesEl.textContent = text === '' ? 0 : text.split('\n').length;
        bytesEl.textContent = new Blob([text]).size;
    }

    input.addEventListener('input', updateStats);

    document.getElementById('btn-clear').addEventListener('click', () => {
        input.value = '';
        updateStats();
    });

    // Initial pass in case there's cached input
    updateStats();
};
