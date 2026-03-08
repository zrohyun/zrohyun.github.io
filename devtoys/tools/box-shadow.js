/**
 * Tool: Box Shadow Generator
 */
window.mountTool_box_shadow = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                
                <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column; gap: 1.25rem;">
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <label style="color: var(--text-secondary); font-size: 0.875rem;">Horizontal Offset (X)</label>
                            <span id="bs-x-val" style="color: var(--text-primary); font-family: monospace;">0px</span>
                        </div>
                        <input type="range" id="bs-x" min="-50" max="50" value="0" style="width: 100%; accent-color: var(--accent-primary);">
                    </div>
                    
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <label style="color: var(--text-secondary); font-size: 0.875rem;">Vertical Offset (Y)</label>
                            <span id="bs-y-val" style="color: var(--text-primary); font-family: monospace;">10px</span>
                        </div>
                        <input type="range" id="bs-y" min="-50" max="50" value="10" style="width: 100%; accent-color: var(--accent-primary);">
                    </div>
                    
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <label style="color: var(--text-secondary); font-size: 0.875rem;">Blur Radius</label>
                            <span id="bs-blur-val" style="color: var(--text-primary); font-family: monospace;">15px</span>
                        </div>
                        <input type="range" id="bs-blur" min="0" max="100" value="15" style="width: 100%; accent-color: var(--accent-primary);">
                    </div>
                    
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <label style="color: var(--text-secondary); font-size: 0.875rem;">Spread Radius</label>
                            <span id="bs-spread-val" style="color: var(--text-primary); font-family: monospace;">-3px</span>
                        </div>
                        <input type="range" id="bs-spread" min="-50" max="50" value="-3" style="width: 100%; accent-color: var(--accent-primary);">
                    </div>

                    <div style="display: flex; gap: 1rem;">
                         <div style="flex: 1;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Shadow Color</label>
                            <input type="color" id="bs-color" value="#000000" style="width: 100%; height: 40px; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); cursor: pointer;">
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <label style="color: var(--text-secondary); font-size: 0.875rem;">Opacity</label>
                                <span id="bs-opacity-val" style="color: var(--text-primary); font-family: monospace;">0.3</span>
                            </div>
                            <input type="range" id="bs-opacity" min="0" max="1" step="0.05" value="0.3" style="width: 100%; accent-color: var(--accent-primary); margin-top: 10px;">
                        </div>
                    </div>

                    <div>
                        <label class="custom-checkbox">
                            <input type="checkbox" id="bs-inset">
                            <span>Inset Shadow (Inner)</span>
                        </label>
                    </div>
                </div>

                <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem; text-align: center;">Preview</label>
                    
                    <div style="flex: 1; background-color: var(--bg-primary); border-radius: var(--border-radius-md); border: 1px dashed var(--border-color); display: flex; align-items: center; justify-content: center; min-height: 250px; margin-bottom: 1.5rem;">
                        <div id="bs-preview" style="width: 200px; height: 200px; background-color: var(--bg-secondary); border-radius: var(--border-radius-md);"></div>
                    </div>

                    <div style="position: relative;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <label style="color: var(--text-secondary); font-size: 0.875rem;">CSS Code</label>
                            <button id="btn-copy-css" class="btn btn-primary btn-sm" style="padding: 0.4rem 0.75rem;">
                                <i data-lucide="copy" style="width: 1rem; height: 1rem; margin-right: 0.25rem;"></i> Copy CSS
                            </button>
                        </div>
                        <code id="bs-code" style="display: block; width: 100%; padding: 1rem; background-color: var(--bg-tertiary); color: var(--accent-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); font-family: monospace; font-size: 0.875rem;"></code>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .custom-checkbox { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; user-select: none; }
            .custom-checkbox input { width: 1.125rem; height: 1.125rem; accent-color: var(--accent-primary); cursor: pointer; }
            .custom-checkbox span { color: var(--text-primary); font-size: 0.875rem; }
        </style>
    `;

    const preview = document.getElementById('bs-preview');
    const code = document.getElementById('bs-code');

    const x = document.getElementById('bs-x');
    const y = document.getElementById('bs-y');
    const blur = document.getElementById('bs-blur');
    const spread = document.getElementById('bs-spread');
    const color = document.getElementById('bs-color');
    const opacity = document.getElementById('bs-opacity');
    const inset = document.getElementById('bs-inset');

    function hexToRgba(hex, alpha) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function update() {
        document.getElementById('bs-x-val').textContent = x.value + 'px';
        document.getElementById('bs-y-val').textContent = y.value + 'px';
        document.getElementById('bs-blur-val').textContent = blur.value + 'px';
        document.getElementById('bs-spread-val').textContent = spread.value + 'px';
        document.getElementById('bs-opacity-val').textContent = opacity.value;

        const isInset = inset.checked ? 'inset ' : '';
        const rgba = hexToRgba(color.value, opacity.value);
        const cssVal = `${isInset}${x.value}px ${y.value}px ${blur.value}px ${spread.value}px ${rgba}`;

        preview.style.boxShadow = cssVal;
        code.textContent = `box-shadow: ${cssVal};`;
    }

    [x, y, blur, spread, opacity].forEach(el => el.addEventListener('input', update));
    [color, inset].forEach(el => el.addEventListener('change', update));

    document.getElementById('btn-copy-css').addEventListener('click', function () {
        navigator.clipboard.writeText(code.textContent);
        const originalHtml = this.innerHTML;
        this.innerHTML = `<i data-lucide="check" style="width: 1rem; height: 1rem; margin-right: 0.25rem;"></i> Copied!`;
        lucide.createIcons({ root: this });
        setTimeout(() => {
            this.innerHTML = originalHtml;
            lucide.createIcons({ root: this });
        }, 2000);
    });

    // Initial pass
    update();
};
