/**
 * Tool: JWT Decoder
 */
window.mountTool_jwt_decoder = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="margin-bottom: 2rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;">Encoded JWT Token</label>
                <textarea id="jwt-input" style="width: 100%; height: 120px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 2px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace; font-size: 0.875rem; word-break: break-all;" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."></textarea>
                <div id="jwt-error" style="color: var(--danger); font-size: 0.875rem; margin-top: 0.5rem; display: none;"></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; color: #ef4444; font-size: 0.875rem; font-weight: 600;">HEADER: ALGORITHM & TOKEN TYPE</label>
                    <pre id="jwt-header" style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: var(--border-radius-md); font-family: monospace; font-size: 0.875rem; white-space: pre-wrap; overflow-wrap: break-word; color: #ef4444; border: 1px solid var(--border-color); min-height: 100px; margin: 0;"></pre>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; color: #a855f7; font-size: 0.875rem; font-weight: 600;">PAYLOAD: DATA</label>
                    <pre id="jwt-payload" style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: var(--border-radius-md); font-family: monospace; font-size: 0.875rem; white-space: pre-wrap; overflow-wrap: break-word; color: #a855f7; border: 1px solid var(--border-color); min-height: 200px; margin: 0;"></pre>
                </div>
            </div>
            <div style="margin-top: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #3b82f6; font-size: 0.875rem; font-weight: 600;">VERIFY SIGNATURE</label>
                <div id="jwt-signature" style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: var(--border-radius-md); font-family: monospace; font-size: 0.875rem; color: #3b82f6; border: 1px solid var(--border-color); word-break: break-all;"></div>
            </div>
        </div>

        <style>
            .jwt-highlight-header { color: #ef4444; }
            .jwt-highlight-payload { color: #a855f7; }
            .jwt-highlight-signature { color: #3b82f6; }
        </style>
    `;

    const input = document.getElementById('jwt-input');
    const headerOut = document.getElementById('jwt-header');
    const payloadOut = document.getElementById('jwt-payload');
    const signOut = document.getElementById('jwt-signature');
    const errorOut = document.getElementById('jwt-error');

    function decodeJWT(token) {
        errorOut.style.display = 'none';
        headerOut.textContent = '';
        payloadOut.textContent = '';
        signOut.textContent = '';

        if (!token) return;

        const parts = token.split('.');
        if (parts.length !== 3) {
            errorOut.textContent = 'Invalid JWT structure. A JWT must consist of 3 parts separated by dots.';
            errorOut.style.display = 'block';
            return;
        }

        try {
            const h = b64DecodeUnicode(parts[0]);
            const p = b64DecodeUnicode(parts[1]);

            headerOut.textContent = JSON.stringify(JSON.parse(h), null, 2);
            payloadOut.textContent = JSON.stringify(JSON.parse(p), null, 2);
            signOut.textContent = parts[2];

            // Highlight input parts
            input.innerHTML = `<span class="jwt-highlight-header">${parts[0]}</span>.<span class="jwt-highlight-payload">${parts[1]}</span>.<span class="jwt-highlight-signature">${parts[2]}</span>`;
        } catch (e) {
            errorOut.textContent = 'Failed to decode: ' + e.message;
            errorOut.style.display = 'block';
        }
    }

    function b64DecodeUnicode(str) {
        // Handle URL safe base64
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad length to multiple of 4
        while (base64.length % 4) base64 += '=';

        return decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    input.addEventListener('input', (e) => decodeJWT(e.target.value.trim()));

    // Auto-select text on input focus
    input.addEventListener('focus', () => input.select());
};
