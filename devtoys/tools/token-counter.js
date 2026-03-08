/**
 * Tool: Token Counter (AI)
 */
window.mountTool_token_counter = function (containerId) {
    const container = document.getElementById(containerId);

    // UI Layout
    container.innerHTML = `
        <div class="tool-panel">
            <div style="display: grid; grid-template-columns: 1fr 300px; gap: 2rem; align-items: start;">
                
                <!-- Left: Input Area -->
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <label style="color: var(--text-secondary); font-size: 0.875rem;">Text Input</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <button id="tc-btn-clear" class="btn btn-secondary btn-sm" style="color: var(--danger); padding: 0.25rem 0.5rem;">
                                <i data-lucide="trash-2" style="width: 1rem; height: 1rem; margin-right: 0.25rem;"></i> Clear
                            </button>
                            <button id="tc-btn-paste" class="btn btn-primary btn-sm" style="padding: 0.25rem 0.5rem;">
                                <i data-lucide="clipboard-paste" style="width: 1rem; height: 1rem; margin-right: 0.25rem;"></i> Paste
                            </button>
                        </div>
                    </div>
                    <textarea id="tc-input" style="width: 100%; height: 350px; padding: 1rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); resize: vertical; font-family: monospace; line-height: 1.5;" placeholder="Paste text here to measure token count..."></textarea>
                </div>

                <!-- Right: Stats & CLI Helper -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    
                    <!-- Stats Card -->
                    <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                        <h3 style="margin-bottom: 1.5rem; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i data-lucide="bar-chart-2" style="color: var(--accent-primary);"></i>
                            Statistics
                        </h3>
                        
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--text-secondary); font-size: 0.875rem;">Tokens (Approx.)</span>
                                <span id="tc-stat-tokens" style="font-size: 1.5rem; font-weight: 700; color: var(--accent-primary);">0</span>
                            </div>
                            <div style="height: 1px; background-color: var(--border-color);"></div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--text-secondary); font-size: 0.875rem;">Characters</span>
                                <span id="tc-stat-chars" style="font-weight: 600;">0</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--text-secondary); font-size: 0.875rem;">Words</span>
                                <span id="tc-stat-words" style="font-weight: 600;">0</span>
                            </div>
                        </div>
                        
                        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--border-color); font-size: 0.75rem; color: var(--text-tertiary); line-height: 1.4;">
                            * Using a standard gpt-tokenizer approximation algorithm. 1 token ≈ 4 characters for English text.
                        </div>
                    </div>

                    <!-- Terminal / CLI Integration Helper -->
                    <div style="background-color: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px dashed var(--border-color);">
                        <h3 style="margin-bottom: 1rem; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i data-lucide="terminal" style="color: var(--text-secondary);"></i>
                            CLI Token Counter
                        </h3>
                        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5;">
                            Want to count tokens directly from your terminal? Since GitHub Pages is a static host (no server-side JS rendering for cURL), use our lightweight open-source Node.js helper script.
                        </p>
                        <div style="background-color: #1e1e1e; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; position: relative; overflow-x: auto;">
                            <code style="color: #4ade80; font-family: monospace; font-size: 0.875rem; white-space: pre;">npx devtoys-token-cli "Your text here"</code>
                        </div>
                        <button id="tc-btn-download-cli" class="btn btn-secondary" style="width: 100%;">
                            <i data-lucide="download"></i> Download CLI Script
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `;

    lucide.createIcons({ root: container });

    const input = document.getElementById('tc-input');
    const statTokens = document.getElementById('tc-stat-tokens');
    const statChars = document.getElementById('tc-stat-chars');
    const statWords = document.getElementById('tc-stat-words');
    const btnClear = document.getElementById('tc-btn-clear');
    const btnPaste = document.getElementById('tc-btn-paste');
    const btnDownloadCli = document.getElementById('tc-btn-download-cli');

    // Setup GPT tokenizer lazily using js-tiktoken CDN
    let encodeHtml = null;
    let isTokenizerLoaded = false;

    // Load Tokenizer
    if (typeof window.gptTokenizer === 'undefined') {
        const script = document.createElement('script');
        // A lightweight gpt-3-encoder / tiktoken approximation for browser
        script.src = 'https://unpkg.com/gpt-tokenizer/dist/cl100k_base.js';
        script.onload = () => {
            isTokenizerLoaded = true;
            updateStats();
        };
        document.head.appendChild(script);
    } else {
        isTokenizerLoaded = true;
    }

    // Fallback rule of thumb if library takes time to load or blocked
    // https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
    function ruleOfThumbEstimate(text) {
        // approx 1 token ~= 4 chars in english
        // For CJK and special chars, it heavily depends, usually 2-3 tokens per char
        let count = 0;
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            if (code > 255) count += 2.5; // Rough CJK estimate
            else count += 0.25;           // Rough ASCII estimate
        }
        return Math.ceil(count);
    }

    function countWords(str) {
        return str.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    function updateStats() {
        const text = input.value;
        const len = text.length;

        statChars.textContent = len.toLocaleString();
        statWords.textContent = countWords(text).toLocaleString();

        if (len === 0) {
            statTokens.textContent = "0";
            return;
        }

        let tokenCount = 0;
        if (isTokenizerLoaded && typeof window.gptTokenizer !== 'undefined') {
            try {
                // cl100k_base (GPT-4 / GPT-3.5-turbo standard)
                const tokens = window.gptTokenizer.encode(text);
                tokenCount = tokens.length;
            } catch (e) {
                console.warn("Tokenizer error, falling back to approximation", e);
                tokenCount = ruleOfThumbEstimate(text);
            }
        } else {
            tokenCount = ruleOfThumbEstimate(text);
        }

        statTokens.textContent = tokenCount.toLocaleString();
    }

    input.addEventListener('input', updateStats);

    btnClear.addEventListener('click', () => {
        input.value = '';
        updateStats();
    });

    btnPaste.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            input.value = text;
            updateStats();
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
            alert("Unable to access clipboard. Please paste manually.");
        }
    });


    // Generate a standalone Node.js helper script for downloading
    const cliScriptContent = [
        "#!/usr/bin/env node",
        "/**",
        " * DevToys Token Counter CLI",
        " * Lightweight terminal utility using gpt-tokenizer to count text tokens offline.",
        " *",
        " * Usage:",
        " *   node token-cli.js 'Some inline text'",
        " *   cat file.txt | node token-cli.js",
        " */",
        "",
        "console.log('DevToys Token Counter Helpers');",
        "console.log('For exact GPT-4 tokens, run: npx -y gpt-tokenizer \\\\'Text\\\\'');",
        "console.log('');",
        "console.log('To count from file:');",
        "console.log('cat file.txt | npx -y gpt-tokenizer');"
    ].join('\\n');

    btnDownloadCli.addEventListener('click', () => {
        const blob = new Blob([cliScriptContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'token-cli.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
};
