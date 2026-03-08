/**
 * Tool: REM to PX Converter
 */
window.mountTool_rem_px = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel" style="max-width: 600px; margin: 0 auto;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; background-color: var(--bg-tertiary); padding: 1rem 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                <label style="font-weight: 500;">Base Font Size (px)</label>
                <input type="number" id="base-px" value="16" min="1" style="width: 80px; padding: 0.5rem; text-align: center; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
            </div>

            <div style="display: flex; align-items: center; gap: 2rem;">
                
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Pixels (PX)</label>
                    <div style="position: relative;">
                        <input type="number" id="val-px" value="16" step="any" style="width: 100%; padding: 1rem 3rem 1rem 1rem; font-size: 1.5rem; font-weight: 600; text-align: right; background-color: var(--bg-primary); color: var(--text-primary); border: 2px solid var(--border-color); border-radius: var(--border-radius-md);">
                        <span style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); font-weight: 600;">px</span>
                    </div>
                </div>

                <i data-lucide="arrow-right-left" style="color: var(--text-tertiary); width: 2rem; height: 2rem; margin-top: 1.5rem;"></i>

                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">REM</label>
                    <div style="position: relative;">
                        <input type="number" id="val-rem" value="1" step="any" style="width: 100%; padding: 1rem 3rem 1rem 1rem; font-size: 1.5rem; font-weight: 600; text-align: right; background-color: var(--bg-primary); color: var(--text-primary); border: 2px solid var(--border-color); border-radius: var(--border-radius-md);">
                        <span style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); font-weight: 600;">rem</span>
                    </div>
                </div>
            </div>

        </div>
        <style>
            input[type=number]:focus { outline: none; border-color: var(--accent-primary); }
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        </style>
    `;

    lucide.createIcons({ root: container });

    const basePx = document.getElementById('base-px');
    const valPx = document.getElementById('val-px');
    const valRem = document.getElementById('val-rem');

    function getBase() {
        return parseFloat(basePx.value) || 16;
    }

    basePx.addEventListener('input', () => {
        valRem.value = +(parseFloat(valPx.value) / getBase()).toFixed(4);
    });

    valPx.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        if (!isNaN(v)) valRem.value = +(v / getBase()).toFixed(4);
    });

    valRem.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        if (!isNaN(v)) valPx.value = +(v * getBase()).toFixed(2);
    });
};
