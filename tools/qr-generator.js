/**
 * Tool: QR Code Generator
 */
window.mountTool_qr_generator = function (containerId) {
    const container = document.getElementById(containerId);

    // Dynamically load qrcode library if not present
    if (typeof QRCode === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.onload = () => initQR();
        document.head.appendChild(script);
    } else {
        initQR();
    }

    function initQR() {
        container.innerHTML = `
            <div class="tool-panel" style="display: flex; flex-wrap: wrap; gap: 2rem;">
                <div style="flex: 1; min-width: 300px;">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Text or URL</label>
                        <textarea id="qr-input" style="width: 100%; height: 120px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; margin-bottom: 1rem;" placeholder="https://web-toolbox.dev"></textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Foreground Color</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="color" id="qr-color-dark" value="#000000" style="width: 40px; height: 40px; padding: 0; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); cursor: pointer;">
                                <input type="text" id="qr-color-dark-text" value="#000000" style="flex: 1; padding: 0.5rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
                            </div>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Background Color</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="color" id="qr-color-light" value="#ffffff" style="width: 40px; height: 40px; padding: 0; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); cursor: pointer;">
                                <input type="text" id="qr-color-light-text" value="#ffffff" style="flex: 1; padding: 0.5rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                         <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Size (px)</label>
                         <input type="range" id="qr-size-slider" min="100" max="600" step="50" value="250" style="width: 100%; accent-color: var(--accent-primary);">
                         <div style="text-align: right; color: var(--text-secondary); font-size: 0.875rem;"><span id="qr-size-val">250</span>x<span id="qr-size-val2">250</span></div>
                    </div>

                    <button id="btn-generate-qr" class="btn btn-primary" style="width: 100%;">
                        Generate QR Code
                    </button>
                </div>

                <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: var(--bg-tertiary); border: 1px dashed var(--border-color); border-radius: var(--border-radius-md); padding: 2rem;">
                    <div id="qr-code-wrapper" style="background-color: white; padding: 1rem; border-radius: 0.5rem; box-shadow: var(--shadow-md); margin-bottom: 1.5rem; display: none;"></div>
                    <div id="qr-placeholder" style="color: var(--text-tertiary); text-align: center;">
                        <i data-lucide="qr-code" style="width: 4rem; height: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>Your QR code will appear here</p>
                    </div>
                    
                    <button id="btn-download-qr" class="btn btn-secondary" style="display: none;">
                        <i data-lucide="download"></i> Download PNG
                    </button>
                </div>
            </div>
        `;
        lucide.createIcons({ root: container });

        const input = document.getElementById('qr-input');
        const colorDark = document.getElementById('qr-color-dark');
        const colorDarkText = document.getElementById('qr-color-dark-text');
        const colorLight = document.getElementById('qr-color-light');
        const colorLightText = document.getElementById('qr-color-light-text');
        const slider = document.getElementById('qr-size-slider');
        const sizeVal = document.getElementById('qr-size-val');
        const sizeVal2 = document.getElementById('qr-size-val2');

        const wrapper = document.getElementById('qr-code-wrapper');
        const placeholder = document.getElementById('qr-placeholder');
        const btnDownload = document.getElementById('btn-download-qr');

        let qrcode = null;

        // Sync colors
        colorDark.addEventListener('input', e => colorDarkText.value = e.target.value);
        colorDarkText.addEventListener('input', e => colorDark.value = e.target.value);
        colorLight.addEventListener('input', e => colorLightText.value = e.target.value);
        colorLightText.addEventListener('input', e => colorLight.value = e.target.value);

        slider.addEventListener('input', e => {
            sizeVal.textContent = e.target.value;
            sizeVal2.textContent = e.target.value;
        });

        function generate() {
            const text = input.value.trim();
            if (!text) return;

            const size = parseInt(slider.value);

            wrapper.innerHTML = '';
            placeholder.style.display = 'none';
            wrapper.style.display = 'block';
            btnDownload.style.display = 'inline-flex';

            qrcode = new QRCode(wrapper, {
                text: text,
                width: size,
                height: size,
                colorDark: colorDarkText.value,
                colorLight: colorLightText.value,
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        document.getElementById('btn-generate-qr').addEventListener('click', generate);

        btnDownload.addEventListener('click', () => {
            const img = wrapper.querySelector('img');
            const canvas = wrapper.querySelector('canvas');

            let url;
            if (img && img.src) url = img.src;
            else if (canvas) url = canvas.toDataURL("image/png");

            if (url) {
                const a = document.createElement('a');
                a.href = url;
                a.download = `qrcode_${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    }
};
