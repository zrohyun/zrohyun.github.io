/**
 * Tool: Color Code Converter
 */
window.mountTool_color_converter = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 2rem;">
                
                <div style="flex: 1; min-width: 250px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Color Preview</label>
                    <div id="color-preview" style="width: 100%; height: 120px; border-radius: var(--border-radius-md); background-color: #3b82f6; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center;">
                        <input type="color" id="native-color-picker" value="#3b82f6" style="opacity: 0; width: 100%; height: 100%; cursor: pointer;">
                        <div style="position: absolute; pointer-events: none; background: rgba(0,0,0,0.5); padding: 0.5rem 1rem; border-radius: 20px; color: white; font-weight: 500; font-size: 0.875rem;">Click to Pick</div>
                    </div>
                </div>

                <div style="flex: 2; min-width: 300px; display: flex; flex-direction: column; gap: 1rem;">
                    <div>
                        <label style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.875rem;">
                            HEX <button class="btn-copy-sm" data-target="hex-input"><i data-lucide="copy" style="width:0.875rem; height:0.875rem"></i></button>
                        </label>
                        <input type="text" id="hex-input" class="color-input" value="#3b82f6" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: monospace;">
                    </div>
                    <div>
                        <label style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.875rem;">
                            RGB <button class="btn-copy-sm" data-target="rgb-input"><i data-lucide="copy" style="width:0.875rem; height:0.875rem"></i></button>
                        </label>
                        <input type="text" id="rgb-input" class="color-input" value="rgb(59, 130, 246)" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: monospace;">
                    </div>
                    <div>
                        <label style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.875rem;">
                            HSL <button class="btn-copy-sm" data-target="hsl-input"><i data-lucide="copy" style="width:0.875rem; height:0.875rem"></i></button>
                        </label>
                        <input type="text" id="hsl-input" class="color-input" value="hsl(217, 90%, 60%)" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: monospace;">
                    </div>
                </div>
            </div>
        </div>

        <style>
            .btn-copy-sm { background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 0.2rem; border-radius: 4px; display: inline-flex; align-items:center; }
            .btn-copy-sm:hover { color: var(--text-primary); background: var(--bg-tertiary); }
            .color-input:focus { outline: none; border-color: var(--accent-primary); }
        </style>
    `;

    const preview = document.getElementById('color-preview');
    const picker = document.getElementById('native-color-picker');
    const hexInput = document.getElementById('hex-input');
    const rgbInput = document.getElementById('rgb-input');
    const hslInput = document.getElementById('hsl-input');

    // Utility: HEX to RGB
    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length == 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length == 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Utility: RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        let v = Math.max(r, g, b), cmin = Math.min(r, g, b);
        let c = v - cmin, h = 0, s = 0, l = (v + cmin) / 2;

        if (c == 0) h = 0;
        else if (v == r) h = (g - b) / c % 6;
        else if (v == g) h = (b - r) / c + 2;
        else h = (r - g) / c + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        s = c == 0 ? 0 : c / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    function extractRgb(rgbStr) {
        const match = rgbStr.match(/\d+/g);
        if (match && match.length >= 3) return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
        return [0, 0, 0];
    }

    function updateFromHex(hex) {
        if (/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
            preview.style.backgroundColor = hex;
            picker.value = hex.length === 4 ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex;
            const rgb = hexToRgb(hex);
            rgbInput.value = rgb;
            const rArr = extractRgb(rgb);
            hslInput.value = rgbToHsl(rArr[0], rArr[1], rArr[2]);
        }
    }

    picker.addEventListener('input', (e) => {
        hexInput.value = e.target.value;
        updateFromHex(e.target.value);
    });

    hexInput.addEventListener('input', (e) => updateFromHex(e.target.value));

    // Simple copy functionality
    document.querySelectorAll('.btn-copy-sm').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            navigator.clipboard.writeText(input.value);

            const originalHtml = this.innerHTML;
            this.innerHTML = `<i data-lucide="check" style="width:0.875rem; height:0.875rem; color: var(--success)"></i>`;
            lucide.createIcons({ root: this.parentElement });
            setTimeout(() => {
                this.innerHTML = originalHtml;
                lucide.createIcons({ root: this.parentElement });
            }, 1000);
        });
    });
};
