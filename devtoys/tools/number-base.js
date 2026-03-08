/**
 * Tool: Number Base Converter
 */
window.mountTool_number_base = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 2rem;">
                
                <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column; gap: 1rem;">
                    <div>
                        <label style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.875rem;">
                            Decimal (Base 10)
                        </label>
                        <input type="text" id="nb-decimal" class="nb-input" placeholder="e.g. 255" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: monospace; font-size: 1rem;">
                    </div>
                    <div>
                        <label style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.875rem;">
                            Binary (Base 2)
                        </label>
                        <input type="text" id="nb-binary" class="nb-input" placeholder="e.g. 11111111" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: monospace; font-size: 1rem;">
                    </div>
                    <div>
                        <label style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.875rem;">
                            Octal (Base 8)
                        </label>
                        <input type="text" id="nb-octal" class="nb-input" placeholder="e.g. 377" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: monospace; font-size: 1rem;">
                    </div>
                    <div>
                        <label style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.875rem;">
                            Hexadecimal (Base 16)
                        </label>
                        <input type="text" id="nb-hex" class="nb-input" placeholder="e.g. ff" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: monospace; font-size: 1rem; text-transform: uppercase;">
                    </div>
                </div>
            </div>
            
            <button id="btn-clear-nb" class="btn btn-secondary" style="color: var(--danger)">
                 <i data-lucide="trash-2"></i> Clear All
            </button>
            <div id="nb-error" style="color: var(--danger); font-size: 0.875rem; margin-top: 1rem; display: none;"></div>
        </div>

        <style>
            .nb-input:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
        </style>
    `;

    const decIn = document.getElementById('nb-decimal');
    const binIn = document.getElementById('nb-binary');
    const octIn = document.getElementById('nb-octal');
    const hexIn = document.getElementById('nb-hex');
    const errorBox = document.getElementById('nb-error');

    function updateFromDecimal(dec) {
        if (isNaN(dec) || dec === null) {
            binIn.value = octIn.value = hexIn.value = '';
            return;
        }
        let n = BigInt(dec);
        if (n < 0n) n = 0n; // Basic support for non-negative
        binIn.value = n.toString(2);
        octIn.value = n.toString(8);
        hexIn.value = n.toString(16).toUpperCase();
    }

    function handleInput(e, base) {
        errorBox.style.display = 'none';
        let val = e.target.value.trim().replace(/\s+/g, '');
        if (!val) {
            decIn.value = binIn.value = octIn.value = hexIn.value = '';
            return;
        }

        try {
            // Validate characters based on base using regex
            const regexes = {
                2: /^[01]+$/,
                8: /^[0-7]+$/,
                10: /^[0-9]+$/,
                16: /^[0-9a-fA-F]+$/
            };

            if (!regexes[base].test(val)) {
                throw new Error("Invalid characters for base " + base);
            }

            // parseInt doesn't handle very large numbers well, use BigInt
            let decStr = base === 10 ? val : '';
            if (base !== 10) {
                // simple base conversion for bigInt
                let n = 0n;
                let b = BigInt(base);
                for (let i = 0; i < val.length; i++) {
                    let charCode = val.charCodeAt(i);
                    let v = 0n;
                    if (charCode >= 48 && charCode <= 57) v = BigInt(charCode - 48);
                    else if (charCode >= 65 && charCode <= 70) v = BigInt(charCode - 55);
                    else if (charCode >= 97 && charCode <= 102) v = BigInt(charCode - 87);
                    n = (n * b) + v;
                }
                decStr = n.toString(10);
            }

            if (e.target !== decIn) decIn.value = decStr;
            if (e.target !== binIn) binIn.value = BigInt(decStr).toString(2);
            if (e.target !== octIn) octIn.value = BigInt(decStr).toString(8);
            if (e.target !== hexIn) hexIn.value = BigInt(decStr).toString(16).toUpperCase();

        } catch (err) {
            errorBox.textContent = err.message;
            errorBox.style.display = 'block';
        }
    }

    decIn.addEventListener('input', (e) => handleInput(e, 10));
    binIn.addEventListener('input', (e) => handleInput(e, 2));
    octIn.addEventListener('input', (e) => handleInput(e, 8));
    hexIn.addEventListener('input', (e) => handleInput(e, 16));

    document.getElementById('btn-clear-nb').addEventListener('click', () => {
        decIn.value = binIn.value = octIn.value = hexIn.value = '';
        errorBox.style.display = 'none';
    });

    lucide.createIcons({ root: container });
};
