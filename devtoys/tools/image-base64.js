/**
 * Tool: Image Base64 Converter
 */
window.mountTool_image_base64 = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Image to Base64 (Upload)</label>
                    
                    <div id="img-dropzone" style="height: 200px; border: 2px dashed var(--border-color); border-radius: var(--border-radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: var(--bg-secondary); cursor: pointer; transition: all 0.2s ease; margin-bottom: 1rem;">
                        <i data-lucide="upload-cloud" style="width: 3rem; height: 3rem; color: var(--accent-primary); margin-bottom: 1rem;"></i>
                        <span style="color: var(--text-secondary); font-weight: 500;">Click or Drag Image Here</span>
                        <input type="file" id="img-input" accept="image/*" style="display: none;">
                    </div>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">
                        Base64 Output
                        <button id="btn-copy-img-b64" class="btn-copy-sm">
                            <i data-lucide="copy" style="width: 1rem; height: 1rem;"></i>
                        </button>
                    </label>
                    <textarea id="img-b64-output" style="width: 100%; height: 200px; padding: 1rem; background-color: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace;" readonly></textarea>
                </div>

                <div style="flex: 1; min-width: 300px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Base64 to Image (Input)</label>
                    <textarea id="img-b64-input" style="width: 100%; height: 200px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace; margin-bottom: 1rem;" placeholder="data:image/png;base64,..."></textarea>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">
                        Image Preview
                        <button id="btn-download-img" class="btn btn-secondary btn-sm" style="display: none; padding: 0.4rem 0.75rem;">
                            <i data-lucide="download" style="width: 1rem; height: 1rem; margin-right: 0.25rem;"></i> Download
                        </button>
                    </div>
                    
                    <div style="height: 200px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); background-color: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                        <img id="img-preview" style="max-width: 100%; max-height: 100%; display: none; object-fit: contain;">
                        <div id="img-placeholder" style="color: var(--text-tertiary);">Preview Image</div>
                    </div>
                </div>
            </div>
            <div id="img-error" style="color: var(--danger); font-size: 0.875rem; margin-top: 1rem; display: none;"></div>
        </div>
        <style>
            .btn-copy-sm { background: none; border: none; cursor: pointer; color: var(--text-tertiary); display: flex; align-items:center; }
            .btn-copy-sm:hover { color: var(--text-primary); }
            #img-dropzone:hover { border-color: var(--accent-primary); background-color: rgba(59, 130, 246, 0.05); }
        </style>
    `;

    lucide.createIcons({ root: container });

    const fileInput = document.getElementById('img-input');
    const dropzone = document.getElementById('img-dropzone');
    const b64Outbox = document.getElementById('img-b64-output');

    const b64Inbox = document.getElementById('img-b64-input');
    const previewImg = document.getElementById('img-preview');
    const placeholder = document.getElementById('img-placeholder');
    const btnDownload = document.getElementById('btn-download-img');
    const errorBox = document.getElementById('img-error');

    // Encode
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--accent-primary)';
    });
    dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--border-color)';
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--border-color)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    });

    function processFile(file) {
        if (!file.type.startsWith('image/')) {
            showError("Please select a valid image file.");
            return;
        }
        errorBox.style.display = 'none';
        const reader = new FileReader();
        reader.onload = (e) => {
            b64Outbox.value = e.target.result;
            // auto load to preview
            b64Inbox.value = e.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }

    // Decode / Preview
    b64Inbox.addEventListener('input', updatePreview);

    function updatePreview() {
        const val = b64Inbox.value.trim();
        errorBox.style.display = 'none';

        if (!val) {
            previewImg.style.display = 'none';
            placeholder.style.display = 'block';
            btnDownload.style.display = 'none';
            return;
        }

        // basic validation for data url
        if (val.startsWith('data:image/') || /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(val)) {
            previewImg.src = val.startsWith('data:image/') ? val : 'data:image/png;base64,' + val;
            previewImg.onload = () => {
                previewImg.style.display = 'block';
                placeholder.style.display = 'none';
                btnDownload.style.display = 'inline-flex';
            };
            previewImg.onerror = () => {
                showError("Cannot render image. Base64 string might be invalid or not an image.");
                previewImg.style.display = 'none';
                placeholder.style.display = 'block';
                btnDownload.style.display = 'none';
            };
        } else {
            showError("Invalid Base64 image data.");
            previewImg.style.display = 'none';
            placeholder.style.display = 'block';
            btnDownload.style.display = 'none';
        }
    }

    btnDownload.addEventListener('click', () => {
        if (previewImg.src) {
            const a = document.createElement('a');
            a.href = previewImg.src;
            a.download = `image_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    document.getElementById('btn-copy-img-b64').addEventListener('click', function () {
        if (b64Outbox.value) {
            navigator.clipboard.writeText(b64Outbox.value);
            const ref = this;
            const orig = ref.innerHTML;
            ref.innerHTML = `<i data-lucide="check" style="width:1rem;height:1rem;color: var(--success)"></i>`;
            lucide.createIcons({ root: ref.parentElement });
            setTimeout(() => { ref.innerHTML = orig; lucide.createIcons({ root: ref.parentElement }); }, 2000);
        }
    });

    function showError(msg) {
        errorBox.textContent = msg;
        errorBox.style.display = 'block';
    }
};
