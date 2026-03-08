/**
 * Tool: ASCII to HEX Convert
 */
window.mountTool_ascii_hex_converter = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; gap: 1rem;">
                 <div style="flex: 1; min-width: 250px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <label style="color: var(--text-secondary); font-size: 0.875rem;">ASCII Text</label>
                        <button class="btn-copy-sm" data-target="ascii-data"><i data-lucide="copy" style="width: 1rem; height: 1rem;"></i></button>
                    </div>
                    <textarea id="ascii-data" style="width: 100%; height: 250px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;"></textarea>
                 </div>
                 
                 <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <button id="btn-to-hex" class="btn btn-primary" title="Convert to HEX">
                         <i data-lucide="arrow-right"></i>
                    </button>
                    <button id="btn-to-ascii" class="btn btn-secondary" title="Convert to ASCII">
                         <i data-lucide="arrow-left"></i>
                    </button>
                 </div>

                 <div style="flex: 1; min-width: 250px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <label style="color: var(--text-secondary); font-size: 0.875rem;">HEX Encoding</label>
                        <button class="btn-copy-sm" data-target="hex-data"><i data-lucide="copy" style="width: 1rem; height: 1rem;"></i></button>
                    </div>
                    <textarea id="hex-data" style="width: 100%; height: 250px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;"></textarea>
                 </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="checkbox" id="hex-spaces" checked style="width: 1rem; height: 1rem; accent-color: var(--accent-primary);">
                <label for="hex-spaces" style="color: var(--text-secondary); font-size: 0.875rem;">Include spaces in HEX</label>
            </div>
            <div id="conv-error" style="color: var(--danger); font-size: 0.875rem; margin-top: 1rem; display: none;"></div>
        </div>
        <style>
            .btn-copy-sm { background: none; border: none; cursor: pointer; padding: 0.2rem; border-radius: 4px; color: var(--text-tertiary); display:flex; align-items: center;}
            .btn-copy-sm:hover { background: var(--bg-tertiary); color: var(--text-primary); }
        </style>
    `;

    const asciiBox = document.getElementById('ascii-data');
    const hexBox = document.getElementById('hex-data');
    const spaceCheck = document.getElementById('hex-spaces');
    const errorBox = document.getElementById('conv-error');

    document.getElementById('btn-to-hex').addEventListener('click', () => {
        errorBox.style.display = 'none';
        try {
            const str = asciiBox.value;
            let result = '';
            for (let i = 0; i < str.length; i++) {
                let hex = str.charCodeAt(i).toString(16);
                result += ('00' + hex).slice(-2) + (spaceCheck.checked ? ' ' : '');
            }
            hexBox.value = result.trim();
        } catch (e) { errorBox.style.display = 'block'; errorBox.textContent = e.message; }
    });

    document.getElementById('btn-to-ascii').addEventListener('click', () => {
        errorBox.style.display = 'none';
        try {
            const hex = hexBox.value.replace(/\s+/g, '');
            let str = '';
            for (let i = 0; i < hex.length; i += 2) {
                let code = parseInt(hex.substr(i, 2), 16);
                if (isNaN(code)) throw new Error("Invalid HEX sequence");
                str += String.fromCharCode(code);
            }
            asciiBox.value = str;
        } catch (e) { errorBox.style.display = 'block'; errorBox.textContent = e.message; }
    });

    document.querySelectorAll('.btn-copy-sm').forEach(btn => {
        btn.addEventListener('click', function () {
            const target = document.getElementById(this.getAttribute('data-target'));
            if (target.value) {
                navigator.clipboard.writeText(target.value);
                const originalHtml = this.innerHTML;
                this.innerHTML = `<i data-lucide="check" style="width: 1rem; height: 1rem; color: var(--success)"></i>`;
                lucide.createIcons({ root: this.parentElement });
                setTimeout(() => { this.innerHTML = originalHtml; lucide.createIcons({ root: this.parentElement }); }, 2000);
            }
        });
    });

    lucide.createIcons({ root: container });
};
