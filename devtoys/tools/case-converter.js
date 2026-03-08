/**
 * Tool: Text Case Converter
 */
window.mountTool_case_converter = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Text Input</label>
                <textarea id="case-input" style="width: 100%; height: 200px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-size: 1rem;" placeholder="Type or paste your text here..."></textarea>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                <button class="btn btn-secondary action-btn" data-action="upper">UPPERCASE</button>
                <button class="btn btn-secondary action-btn" data-action="lower">lowercase</button>
                <button class="btn btn-secondary action-btn" data-action="title">Title Case</button>
                <button class="btn btn-secondary action-btn" data-action="camel">camelCase</button>
                <button class="btn btn-secondary action-btn" data-action="pascal">PascalCase</button>
                <button class="btn btn-secondary action-btn" data-action="snake">snake_case</button>
                <button class="btn btn-secondary action-btn" data-action="kebab">kebab-case</button>
            </div>
            
            <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                <label style="color: var(--text-secondary); font-size: 0.875rem;">Result</label>
                <button id="btn-copy" class="btn btn-primary btn-sm" style="padding: 0.5rem 0.75rem;">
                    <i data-lucide="copy" style="width: 1rem; height: 1rem; margin-right: 0.25rem;"></i> Copy
                </button>
            </div>
            <textarea id="case-output" style="width: 100%; height: 200px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-size: 1rem;" readonly></textarea>
        </div>
    `;

    const input = document.getElementById('case-input');
    const output = document.getElementById('case-output');

    const transformers = {
        upper: text => text.toUpperCase(),
        lower: text => text.toLowerCase(),
        title: text => text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
        camel: text => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, ''),
        pascal: text => text.replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()).replace(/\s+/g, ''),
        snake: text => text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || text,
        kebab: text => text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || text,
    };

    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            if (transformers[action] && input.value) {
                output.value = transformers[action](input.value);
            }
        });
    });

    document.getElementById('btn-copy').addEventListener('click', function () {
        if (output.value) {
            navigator.clipboard.writeText(output.value);
            const originalHtml = this.innerHTML;
            this.innerHTML = `<i data-lucide="check" style="width: 1rem; height: 1rem; color: var(--success); margin-right: 0.25rem;"></i> Copied!`;
            lucide.createIcons({ root: this });
            setTimeout(() => {
                this.innerHTML = originalHtml;
                lucide.createIcons({ root: this });
            }, 2000);
        }
    });
};
