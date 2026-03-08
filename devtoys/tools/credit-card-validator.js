/**
 * Tool: Credit Card Validator
 */
window.mountTool_credit_card_validator = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel" style="max-width: 600px; margin: 0 auto;">
            <div style="margin-bottom: 2rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">Credit Card Number</label>
                <div style="position: relative;">
                    <i id="cc-brand-icon" data-lucide="credit-card" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); width: 1.5rem; height: 1.5rem;"></i>
                    <input type="text" id="cc-input" placeholder="xxxx xxxx xxxx xxxx" style="width: 100%; padding: 1rem 1rem 1rem 3.5rem; font-size: 1.25rem; background-color: var(--bg-primary); color: var(--text-primary); border: 2px solid var(--border-color); border-radius: var(--border-radius-md); letter-spacing: 0.1em; font-family: monospace;">
                </div>
            </div>

            <div id="cc-result" style="display: none; padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color); background-color: var(--bg-tertiary);">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div id="cc-status-icon" style="width: 3rem; height: 3rem; border-radius: 50%; display: flex; align-items: center; justify-content: center;"></div>
                    <div>
                        <div id="cc-status-text" style="font-size: 1.25rem; font-weight: 700;">Valid</div>
                        <div id="cc-brand-text" style="color: var(--text-secondary); text-transform: capitalize;">Visa</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Luhn Algorithm Check</div>
                        <div id="cc-luhn-res" style="font-weight: 500;">Passed</div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Length Check</div>
                        <div id="cc-len-res" style="font-weight: 500;">Valid (16 digits)</div>
                    </div>
                </div>
            </div>
            
            <p style="text-align: center; margin-top: 1.5rem; color: var(--text-tertiary); font-size: 0.875rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <i data-lucide="shield-check" style="width: 1rem; height: 1rem;"></i> Safe & Offline - No data is sent to external servers.
            </p>
        </div>
        <style>
            #cc-input:focus { outline: none; border-color: var(--accent-primary); }
        </style>
    `;

    lucide.createIcons({ root: container });

    const input = document.getElementById('cc-input');
    const resultBox = document.getElementById('cc-result');
    const statusIcon = document.getElementById('cc-status-icon');
    const statusText = document.getElementById('cc-status-text');
    const brandText = document.getElementById('cc-brand-text');
    const luhnRes = document.getElementById('cc-luhn-res');
    const lenRes = document.getElementById('cc-len-res');

    const cardPatterns = [
        { name: 'Visa', pattern: /^4/, lengths: [13, 16, 19] },
        { name: 'Mastercard', pattern: /^(5[1-5]|2[2-7])/, lengths: [16] },
        { name: 'American Express', pattern: /^3[47]/, lengths: [15] },
        { name: 'Discover', pattern: /^(6011|65|64[4-9]|622)/, lengths: [16] },
        { name: 'Diners Club', pattern: /^3(?:0[0-5]|[68][0-9])/, lengths: [14] },
        { name: 'JCB', pattern: /^(?:2131|1800|35\d{3})/, lengths: [16] },
        { name: 'UnionPay', pattern: /^62/, lengths: [16, 17, 18, 19] }
    ];

    function checkLuhn(cardNo) {
        let s = 0;
        let doubleDigit = false;
        for (let i = cardNo.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNo.charAt(i), 10);
            if (doubleDigit) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            s += digit;
            doubleDigit = !doubleDigit;
        }
        return s % 10 == 0;
    }

    input.addEventListener('input', (e) => {
        // Auto format with spaces
        let val = e.target.value.replace(/\D/g, '');
        e.target.value = val.replace(/(\d{4})/g, '$1 ').trim();

        if (val.length === 0) {
            resultBox.style.display = 'none';
            return;
        }

        resultBox.style.display = 'block';

        let brandStr = 'Unknown Card Brand';
        let isLengthValid = false;
        let expectedLengths = [];

        for (let p of cardPatterns) {
            if (p.pattern.test(val)) {
                brandStr = p.name;
                expectedLengths = p.lengths;
                if (p.lengths.includes(val.length)) isLengthValid = true;
                break;
            }
        }

        const isLuhnValid = checkLuhn(val) && val.length > 0;
        const fullyValid = isLuhnValid && (expectedLengths.length === 0 ? val.length >= 13 : isLengthValid);

        brandText.textContent = brandStr;
        luhnRes.textContent = isLuhnValid ? "Passed" : "Failed";
        luhnRes.style.color = isLuhnValid ? "var(--success)" : "var(--danger)";

        lenRes.textContent = `${val.length} digits ${isLengthValid ? '(Valid)' : ''}`;

        if (fullyValid) {
            statusText.textContent = "Valid Card Number";
            statusText.style.color = "var(--success)";
            statusIcon.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
            statusIcon.innerHTML = `<i data-lucide="check" style="color: var(--success); width: 1.5rem; height: 1.5rem;"></i>`;
            input.style.borderColor = "var(--success)";
        } else {
            statusText.textContent = "Invalid Card Number";
            statusText.style.color = "var(--danger)";
            statusIcon.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
            statusIcon.innerHTML = `<i data-lucide="x" style="color: var(--danger); width: 1.5rem; height: 1.5rem;"></i>`;
            input.style.borderColor = "var(--danger)";
        }

        lucide.createIcons({ root: resultBox });
    });
};
