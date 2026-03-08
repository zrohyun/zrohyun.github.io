/**
 * Tool: XML Formatter
 */
window.mountTool_xml_formatter = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Input XML</label>
                    <textarea id="xml-input" style="width: 100%; height: 350px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" placeholder="<root><item>Hello</item></root>"></textarea>
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Output XML</label>
                    <textarea id="xml-output" style="width: 100%; height: 350px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" readonly></textarea>
                </div>
            </div>
            
            <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: space-between;">
                <div style="display: flex; gap: 0.75rem;">
                    <button id="btn-format-xml" class="btn btn-primary">
                        <i data-lucide="align-left"></i> Format XML
                    </button>
                    <button id="btn-minify-xml" class="btn btn-secondary">
                        <i data-lucide="minimize-2"></i> Minify
                    </button>
                    <button id="btn-clear-xml" class="btn btn-secondary" style="color: var(--danger)">
                        <i data-lucide="trash-2"></i> Clear
                    </button>
                </div>
                <button id="btn-copy-xml" class="btn btn-secondary">
                    <i data-lucide="copy"></i> Copy Output
                </button>
            </div>
        </div>
    `;

    const input = document.getElementById('xml-input');
    const output = document.getElementById('xml-output');

    // Basic XML Formatter using regex
    function formatXml(xml) {
        let formatted = '';
        let pad = 0;
        // removing empty text nodes and splitting tags
        xml = xml.replace(/(>)\s*(<)/g, '$1\r\n$2');
        xml.split('\r\n').forEach(function (node) {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad != 0) { pad -= 1; }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            let padding = '';
            for (let i = 0; i < pad; i++) { padding += '  '; }
            formatted += padding + node + '\r\n';
            pad += indent;
        });
        return formatted.trim();
    }

    function minifyXml(xml) {
        return xml.replace(/\>[\r\n ]+\</g, "><").replace(/(<[^\/][^>]*>)\s+([^<])/g, "$1$2").replace(/([^>])\s+(<\/[^>]*>)/g, "$1$2").trim();
    }

    document.getElementById('btn-format-xml').addEventListener('click', () => {
        if (input.value) output.value = formatXml(input.value);
    });

    document.getElementById('btn-minify-xml').addEventListener('click', () => {
        if (input.value) output.value = minifyXml(input.value);
    });

    document.getElementById('btn-clear-xml').addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });

    document.getElementById('btn-copy-xml').addEventListener('click', function () {
        if (output.value) {
            navigator.clipboard.writeText(output.value);
            const ref = this;
            const orig = ref.innerHTML;
            ref.innerHTML = `<i data-lucide="check" style="color: var(--success)"></i> Copied!`;
            lucide.createIcons({ root: ref });
            setTimeout(() => { ref.innerHTML = orig; lucide.createIcons({ root: ref }); }, 2000);
        }
    });

    lucide.createIcons({ root: container });
};
