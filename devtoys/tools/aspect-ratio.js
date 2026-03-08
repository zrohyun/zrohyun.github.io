/**
 * Tool: Aspect Ratio Calculator
 */
window.mountTool_aspect_ratio = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel" style="max-width: 800px; margin: 0 auto;">
            
            <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                
                <div style="flex: 1; min-width: 300px; background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                    <h3 style="margin-bottom: 1.5rem; font-size: 1rem;">1. Set Ratio</h3>
                    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
                        <input type="number" id="ar-w" value="16" min="1" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-size: 1.25rem; text-align: center;">
                        <span style="font-weight: 700; font-size: 1.25rem; color: var(--text-secondary);">:</span>
                        <input type="number" id="ar-h" value="9" min="1" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-size: 1.25rem; text-align: center;">
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                        <button class="btn btn-secondary btn-sm ar-preset" data-w="16" data-h="9">16:9</button>
                        <button class="btn btn-secondary btn-sm ar-preset" data-w="4" data-h="3">4:3</button>
                        <button class="btn btn-secondary btn-sm ar-preset" data-w="1" data-h="1">1:1</button>
                        <button class="btn btn-secondary btn-sm ar-preset" data-w="21" data-h="9">21:9</button>
                        <button class="btn btn-secondary btn-sm ar-preset" data-w="3" data-h="2">3:2</button>
                        <button class="btn btn-secondary btn-sm ar-preset" data-w="9" data-h="16">9:16 (Mobile)</button>
                    </div>
                </div>

                <div style="flex: 1; min-width: 300px; background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                    <h3 style="margin-bottom: 1.5rem; font-size: 1rem;">2. Calculate Dimensions based on Ratio</h3>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Width (W)</label>
                        <input type="number" id="dim-w" value="1920" step="any" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Height (H)</label>
                        <input type="number" id="dim-h" value="1080" step="any" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
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

    const arW = document.getElementById('ar-w');
    const arH = document.getElementById('ar-h');
    const dimW = document.getElementById('dim-w');
    const dimH = document.getElementById('dim-h');

    function getRatio() {
        const w = parseFloat(arW.value) || 16;
        const h = parseFloat(arH.value) || 9;
        return w / h;
    }

    // Handlers
    arW.addEventListener('input', () => { dimH.value = +(parseFloat(dimW.value) / getRatio()).toFixed(2); });
    arH.addEventListener('input', () => { dimH.value = +(parseFloat(dimW.value) / getRatio()).toFixed(2); });

    dimW.addEventListener('input', () => {
        const val = parseFloat(dimW.value);
        if (!isNaN(val)) dimH.value = +(val / getRatio()).toFixed(2);
    });

    dimH.addEventListener('input', () => {
        const val = parseFloat(dimH.value);
        if (!isNaN(val)) dimW.value = +(val * getRatio()).toFixed(2);
    });

    document.querySelectorAll('.ar-preset').forEach(btn => {
        btn.addEventListener('click', (e) => {
            arW.value = e.target.getAttribute('data-w');
            arH.value = e.target.getAttribute('data-h');
            dimH.value = +(parseFloat(dimW.value) / getRatio()).toFixed(2);
        });
    });
};
