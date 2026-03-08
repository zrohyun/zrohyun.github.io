/**
 * Tool: Password Generator
 */
window.mountTool_password_generator = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="background-color: var(--bg-tertiary); padding: 2rem; border-radius: var(--border-radius-md); margin-bottom: 2rem; border: 1px solid var(--border-color); position: relative; display: flex; align-items: center;">
                <input type="text" id="pwd-output" style="width: 100%; background: transparent; border: none; font-size: 2rem; font-family: monospace; color: var(--text-primary); text-align: center; font-weight: 600;" readonly>
                <div style="position: absolute; right: 1rem; display: flex; gap: 0.5rem;">
                    <button id="btn-copy-pwd" class="icon-btn" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color);" title="Copy">
                        <i data-lucide="copy"></i>
                    </button>
                    <button id="btn-refresh-pwd" class="icon-btn" style="background-color: var(--accent-primary); color: white; border: none;" title="Regenerate">
                        <i data-lucide="refresh-cw"></i>
                    </button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <label style="color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;">Password Length</label>
                        <span id="length-val" style="color: var(--accent-primary); font-weight: 700;">16</span>
                    </div>
                    <input type="range" id="pwd-length" min="4" max="64" value="16" style="width: 100%; accent-color: var(--accent-primary); cursor: pointer;">
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <label class="custom-checkbox">
                        <input type="checkbox" id="chk-uppercase" checked>
                        <span>Include Uppercase (A-Z)</span>
                    </label>
                    <label class="custom-checkbox">
                        <input type="checkbox" id="chk-lowercase" checked>
                        <span>Include Lowercase (a-z)</span>
                    </label>
                    <label class="custom-checkbox">
                        <input type="checkbox" id="chk-numbers" checked>
                        <span>Include Numbers (0-9)</span>
                    </label>
                    <label class="custom-checkbox">
                        <input type="checkbox" id="chk-symbols" checked>
                        <span>Include Symbols (!@#$...)</span>
                    </label>
                </div>
            </div>
            
            <div style="margin-top: 2rem;">
                <div style="height: 6px; width: 100%; background-color: var(--bg-tertiary); border-radius: 3px; overflow: hidden;">
                    <div id="pwd-strength" style="height: 100%; width: 0%; transition: all 0.3s ease; background-color: var(--danger);"></div>
                </div>
                <div id="pwd-strength-text" style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 0.5rem; text-align: right; text-transform: uppercase;">Very Weak</div>
            </div>
        </div>

        <style>
            .custom-checkbox { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; user-select: none; }
            .custom-checkbox input { width: 1.125rem; height: 1.125rem; accent-color: var(--accent-primary); cursor: pointer; }
            .custom-checkbox span { color: var(--text-primary); font-size: 0.9rem; }
            #pwd-output:focus { outline: none; }
        </style>
    `;

    const out = document.getElementById('pwd-output');
    const lenSlider = document.getElementById('pwd-length');
    const lenVal = document.getElementById('length-val');

    const chkUpper = document.getElementById('chk-uppercase');
    const chkLower = document.getElementById('chk-lowercase');
    const chkNum = document.getElementById('chk-numbers');
    const chkSym = document.getElementById('chk-symbols');

    const strengthBar = document.getElementById('pwd-strength');
    const strengthText = document.getElementById('pwd-strength-text');

    const chars = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        num: '0123456789',
        sym: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    function generate() {
        let charset = '';
        if (chkUpper.checked) charset += chars.upper;
        if (chkLower.checked) charset += chars.lower;
        if (chkNum.checked) charset += chars.num;
        if (chkSym.checked) charset += chars.sym;

        if (!charset) {
            chkLower.checked = true;
            charset += chars.lower;
        }

        const length = parseInt(lenSlider.value);
        let pwd = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            pwd += charset[array[i] % charset.length];
        }

        out.value = pwd;
        updateStrength(pwd);
    }

    function updateStrength(pwd) {
        let score = 0;
        if (pwd.length > 8) score += 1;
        if (pwd.length > 12) score += 1;
        if (pwd.length >= 16) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[a-z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        let width = '0%', color = 'var(--danger)', text = 'Very Weak';

        if (score > 5) {
            width = '100%'; color = 'var(--success)'; text = 'Very Strong';
        } else if (score > 4) {
            width = '80%'; color = 'var(--success)'; text = 'Strong';
        } else if (score > 3) {
            width = '60%'; color = 'var(--warning)'; text = 'Good';
        } else if (score > 2) {
            width = '40%'; color = 'var(--warning)'; text = 'Fair';
        } else {
            width = '20%'; color = 'var(--danger)'; text = 'Weak';
        }

        strengthBar.style.width = width;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }

    lenSlider.addEventListener('input', (e) => {
        lenVal.textContent = e.target.value;
        generate();
    });

    [chkUpper, chkLower, chkNum, chkSym].forEach(chk => {
        chk.addEventListener('change', generate);
    });

    document.getElementById('btn-refresh-pwd').addEventListener('click', () => {
        const icon = document.querySelector('#btn-refresh-pwd i');
        icon.classList.add('lucide-spin');
        generate();
        setTimeout(() => icon.classList.remove('lucide-spin'), 300);
    });

    document.getElementById('btn-copy-pwd').addEventListener('click', function () {
        if (out.value) {
            navigator.clipboard.writeText(out.value);
            const icon = this.querySelector('i');
            icon.setAttribute('data-lucide', 'check');
            lucide.createIcons({ root: this });
            this.style.color = 'var(--success)';

            setTimeout(() => {
                icon.setAttribute('data-lucide', 'copy');
                lucide.createIcons({ root: this });
                this.style.color = '';
            }, 1500);
        }
    });

    // Initial Gen
    generate();
};
