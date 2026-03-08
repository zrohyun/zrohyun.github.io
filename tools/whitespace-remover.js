/**
 * Tool: Whitespace Remover
 */
window.mountTool_whitespace_remover = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Text with Whitespace</label>
                    <textarea id="ws-input" style="width: 100%; height: 300px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-size: 1rem;" placeholder="Paste text here..."></textarea>
                </div>
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Result</label>
                    <textarea id="ws-output" style="width: 100%; height: 300px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-size: 1rem;" readonly></textarea>
                </div>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button class="btn btn-primary action-btn" data-action="all">
                    Remove All Whitespace
                </button>
                <button class="btn btn-secondary action-btn" data-action="trim">
                    Trim Ends (Leading/Trailing)
                </button>
                <button class="btn btn-secondary action-btn" data-action="extra">
                    Remove Extra Spaces
                </button>
                <button class="btn btn-secondary action-btn" data-action="newlines">
                    Remove Line Breaks
                </button>
            </div>
        </div>
    `;

    const input = document.getElementById('ws-input');
    const output = document.getElementById('ws-output');

    const actions = {
        all: text => text.replace(/\s+/g, ''),
        trim: text => text.trim(),
        extra: text => text.replace(/[ \t]{2,}/g, ' ').trim(),
        newlines: text => text.replace(/[\r\n]+/g, ' ')
    };

    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.closest('.action-btn').getAttribute('data-action');
            if (actions[action] && input.value) {
                output.value = actions[action](input.value);
            }
        });
    });
};
