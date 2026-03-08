/**
 * Tool: Gradient Text Generator
 */
window.mountTool_gradient_text = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="background-color: var(--bg-primary); border: 1px dashed var(--border-color); border-radius: var(--border-radius-md); padding: 3rem; display: flex; align-items: center; justify-content: center; min-height: 250px; margin-bottom: 2rem;">
                <h2 id="gt-preview" style="font-size: 4rem; font-weight: 800; text-align: center; margin: 0; background-clip: text; -webkit-background-clip: text; color: transparent; background-image: linear-gradient(to right, #3b82f6, #8b5cf6);">
                    Gradient Text
                </h2>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Text String</label>
                    <input type="text" id="gt-text" value="Gradient Text" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Direction</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <select id="gt-direction" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); cursor: pointer;">
                            <option value="to right">To Right (→)</option>
                            <option value="to left">To Left (←)</option>
                            <option value="to bottom">To Bottom (↓)</option>
                            <option value="to top">To Top (↑)</option>
                            <option value="to bottom right">Bottom Right (↘)</option>
                            <option value="to top right">Top Right (↗)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Start Color</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="color" id="gt-color1" value="#3b82f6" style="width: 40px; height: 40px; padding: 0; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); cursor: pointer;">
                        <input type="text" id="gt-color1-txt" value="#3b82f6" style="flex: 1; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
                    </div>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">End Color</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="color" id="gt-color2" value="#8b5cf6" style="width: 40px; height: 40px; padding: 0; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); cursor: pointer;">
                        <input type="text" id="gt-color2-txt" value="#8b5cf6" style="flex: 1; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
                    </div>
                </div>
            </div>

            <div>
                 <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <label style="color: var(--text-secondary); font-size: 0.875rem;">CSS Code</label>
                    <button id="btn-copy-gt-css" class="btn btn-primary btn-sm" style="padding: 0.4rem 0.75rem;">
                        <i data-lucide="copy" style="width: 1rem; height: 1rem; margin-right: 0.25rem;"></i> Copy CSS
                    </button>
                </div>
                <pre id="gt-code" style="display: block; width: 100%; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); font-family: monospace; font-size: 0.875rem;"></pre>
            </div>
        </div>
    `;

    const text = document.getElementById('gt-text');
    const direction = document.getElementById('gt-direction');
    const c1 = document.getElementById('gt-color1');
    const c1t = document.getElementById('gt-color1-txt');
    const c2 = document.getElementById('gt-color2');
    const c2t = document.getElementById('gt-color2-txt');

    const preview = document.getElementById('gt-preview');
    const codeOut = document.getElementById('gt-code');

    function syncColor(src, dest) { dest.value = src.value; update(); }

    c1.addEventListener('input', () => syncColor(c1, c1t));
    c1t.addEventListener('input', () => syncColor(c1t, c1));
    c2.addEventListener('input', () => syncColor(c2, c2t));
    c2t.addEventListener('input', () => syncColor(c2t, c2));

    function update() {
        preview.textContent = text.value;
        const grad = `linear-gradient(${direction.value}, ${c1.value}, ${c2.value})`;
        preview.style.backgroundImage = grad;

        const css = `background: ${grad};
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
color: transparent;`;

        codeOut.textContent = css;
    }

    text.addEventListener('input', update);
    direction.addEventListener('change', update);

    document.getElementById('btn-copy-gt-css').addEventListener('click', function () {
        navigator.clipboard.writeText(codeOut.textContent);
        const originalHtml = this.innerHTML;
        this.innerHTML = `<i data-lucide="check" style="width: 1rem; height: 1rem; margin-right: 0.25rem;"></i> Copied!`;
        lucide.createIcons({ root: this });
        setTimeout(() => {
            this.innerHTML = originalHtml;
            lucide.createIcons({ root: this });
        }, 2000);
    });

    update();
};
