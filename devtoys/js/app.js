/**
 * DevToys - Core Application Logic
 * Handles Routing, Theme toggling, Sidebar generation, and Tool initialization.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Intercept Curl requests early (only works if executed, but good for demo/concept)
    if (navigator.userAgent.toLowerCase().includes('curl') || navigator.userAgent.toLowerCase().includes('wget')) {
        document.body.innerHTML = `
<pre>
DevToys Token Counter CLI helper:
To count tokens for a string from your terminal, use:
npx -y gpt-tokenizer "Your text here"

To count tokens from a file:
cat file.txt | npx -y gpt-tokenizer
</pre>`;
        return;
    }

    const App = {
        state: {
            currentTheme: localStorage.getItem('theme') || 'light',
            currentToolId: location.hash.replace('#', '') || null,
        },

        elements: {
            body: document.body,
            sidebarNav: document.getElementById('sidebar-nav'),
            themeToggle: document.getElementById('theme-toggle'),
            toolViewContainer: document.getElementById('tool-view-container'),
            breadcrumbs: document.getElementById('breadcrumbs'),
            search: document.getElementById('tool-search'),

            // Mobile specific
            sidebar: document.getElementById('sidebar'),
            mobileMenuOpenBtn: document.getElementById('mobile-menu-open'),
            mobileMenuCloseBtn: document.getElementById('mobile-menu-close'),
        },

        init() {
            this.applyTheme(this.state.currentTheme);
            this.generateSidebarItems();
            this.setupEventListeners();
            this.handleRoute(); // Initial load
        },

        setupEventListeners() {
            // Theme toggling
            this.elements.themeToggle.addEventListener('click', () => {
                const newTheme = this.state.currentTheme === 'dark' ? 'light' : 'dark';
                this.applyTheme(newTheme);
            });

            // Hash change routing
            window.addEventListener('hashchange', () => {
                this.state.currentToolId = location.hash.replace('#', '');
                this.handleRoute();

                // Close sidebar on mobile after navigation
                if (window.innerWidth <= 768) {
                    this.elements.sidebar.classList.remove('open');
                }
            });

            // Mobile menu toggles
            this.elements.mobileMenuOpenBtn.addEventListener('click', () => {
                this.elements.sidebar.classList.add('open');
            });
            this.elements.mobileMenuCloseBtn.addEventListener('click', () => {
                this.elements.sidebar.classList.remove('open');
            });

            // Search functionality
            this.elements.search.addEventListener('input', (e) => this.handleSearch(e.target.value));

            // Setup category collapse toggles
            this.elements.sidebarNav.addEventListener('click', (e) => {
                const categoryBtn = e.target.closest('.nav-category-btn');
                if (categoryBtn) {
                    const categoryDiv = categoryBtn.parentElement;
                    categoryDiv.classList.toggle('collapsed');
                }
            });
        },

        applyTheme(theme) {
            this.state.currentTheme = theme;
            this.elements.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        },

        generateSidebarItems() {
            let html = '';
            TOOLBOX_CONFIG.categories.forEach(category => {
                html += `
                    <div class="nav-category" id="cat-${category.id}">
                        <button class="nav-category-btn">
                            <span class="category-title">
                                <i data-lucide="${category.icon}"></i>
                                ${category.name}
                            </span>
                            <i data-lucide="chevron-down" class="chevron-icon"></i>
                        </button>
                        <ul class="nav-item-list">
                            ${category.tools.map(tool => `
                                <li>
                                    <a href="#${tool.id}" class="nav-link" data-tool-id="${tool.id}">
                                        ${tool.name}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            });
            this.elements.sidebarNav.innerHTML = html;
            // re-init icons for newly added HTML
            lucide.createIcons();
        },

        handleSearch(query) {
            query = query.toLowerCase().trim();
            const categories = this.elements.sidebarNav.querySelectorAll('.nav-category');

            categories.forEach(categoryEle => {
                const links = categoryEle.querySelectorAll('.nav-link');
                let hasVisibleTool = false;

                links.forEach(link => {
                    const toolName = link.textContent.toLowerCase();
                    if (toolName.includes(query)) {
                        link.parentElement.style.display = 'block';
                        hasVisibleTool = true;
                    } else {
                        link.parentElement.style.display = 'none';
                    }
                });

                // expand and show category if there's a match, else hide
                if (query === '') {
                    categoryEle.style.display = 'block';
                    categoryEle.classList.remove('collapsed');
                } else {
                    categoryEle.style.display = hasVisibleTool ? 'block' : 'none';
                    if (hasVisibleTool) categoryEle.classList.remove('collapsed');
                }
            });
        },

        updateActiveSidebarLink() {
            // Remove active classes
            document.querySelectorAll('.nav-link.active').forEach(el => el.classList.remove('active'));

            if (!this.state.currentToolId) return;

            const activeLink = document.querySelector(`.nav-link[data-tool-id="${this.state.currentToolId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                // Ensure parent category is not collapsed
                const categoryDiv = activeLink.closest('.nav-category');
                if (categoryDiv) {
                    categoryDiv.classList.remove('collapsed');
                }
            }
        },

        updateBreadcrumbs(toolInfo) {
            if (!toolInfo) {
                this.elements.breadcrumbs.innerHTML = `<span>Welcome</span>`;
                return;
            }
            this.elements.breadcrumbs.innerHTML = `
                <span>${toolInfo.categoryName}</span>
                <i data-lucide="chevron-right" class="breadcrumb-separator"></i>
                <span class="breadcrumb-current">${toolInfo.name}</span>
            `;
            lucide.createIcons({ root: this.elements.breadcrumbs });
        },

        handleRoute() {
            this.updateActiveSidebarLink();

            if (!this.state.currentToolId) {
                this.renderWelcomeScreen();
                return;
            }

            const toolInfo = ALL_TOOLS.find(t => t.id === this.state.currentToolId);
            if (!toolInfo) {
                this.renderWelcomeScreen();
                return;
            }

            this.updateBreadcrumbs(toolInfo);
            this.loadTool(toolInfo);
        },

        renderWelcomeScreen() {
            this.updateBreadcrumbs(null);

            let featuredHtml = '';
            // Just picking the first few tools as featured for the demo
            ALL_TOOLS.slice(0, 6).forEach(tool => {
                const category = TOOLBOX_CONFIG.categories.find(c => c.id === tool.categoryId);
                featuredHtml += `
                    <div class="tool-card" onclick="location.hash='${tool.id}'">
                        <div class="tool-card-header">
                            <div class="tool-card-icon">
                                <i data-lucide="${category.icon}"></i>
                            </div>
                            <h3>${tool.name}</h3>
                        </div>
                        <p>${tool.description}</p>
                    </div>
                `;
            });

            this.elements.toolViewContainer.innerHTML = `
                <div class="welcome-screen fade-in">
                    <div class="welcome-hero">
                        <div class="hero-icon-wrapper">
                            <i data-lucide="zap" class="hero-icon"></i>
                        </div>
                        <h1>All the web tools you need,<br><span class="text-gradient">in one place</span></h1>
                        <p>70+ Ready-to-Use Tools • Anytime, Anywhere • Privacy First</p>
                    </div>
                    
                    <div class="featured-tools-section">
                        <h2><span class="emoji">🔥</span> Featured Tools <span class="emoji">🔥</span></h2>
                        <div class="tools-grid">
                            ${featuredHtml}
                        </div>
                    </div>
                </div>
            `;
            lucide.createIcons({ root: this.elements.toolViewContainer });
        },

        loadTool(toolInfo) {
            // We will dynamically load the JS associated with the tool
            // Create a loading state
            this.elements.toolViewContainer.innerHTML = `
                <div class="fade-in" style="display:flex; justify-content:center; padding: 4rem;">
                    <i data-lucide="loader-2" class="lucide-spin" style="width: 2rem; height: 2rem; color: var(--text-tertiary)"></i>
                </div>
            `;
            lucide.createIcons({ root: this.elements.toolViewContainer });

            // Generate Base Shell for the Tool UI
            const baseHtml = `
                <div class="fade-in">
                    <div class="tool-header">
                        <h1>${toolInfo.name}</h1>
                        <p>${toolInfo.description}</p>
                    </div>
                    <div id="${toolInfo.id}-mount-point"></div>
                </div>
            `;

            // Setup script loading
            const scriptId = `script-tool-${toolInfo.id}`;
            let script = document.getElementById(scriptId);

            // Give a tiny timeout for the animation to look fluid
            setTimeout(() => {
                this.elements.toolViewContainer.innerHTML = baseHtml;

                if (script) {
                    // Script already loaded once, just call mount function if exists
                    if (window[`mountTool_${toolInfo.id.replace(/-/g, '_')}`]) {
                        window[`mountTool_${toolInfo.id.replace(/-/g, '_')}`](`${toolInfo.id}-mount-point`);
                        lucide.createIcons({ root: this.elements.toolViewContainer });
                    }
                } else {
                    // Load script dynamically
                    script = document.createElement('script');
                    script.id = scriptId;
                    script.src = `tools/${toolInfo.id}.js`;
                    script.onerror = () => {
                        document.getElementById(`${toolInfo.id}-mount-point`).innerHTML = `
                            <div class="tool-panel" style="text-align:center; padding: 3rem;">
                                <i data-lucide="construction" style="width: 3rem; height: 3rem; color: var(--warning); margin-bottom: 1rem;"></i>
                                <h3>Tool Under Construction</h3>
                                <p>The file 'tools/${toolInfo.id}.js' was not found.</p>
                            </div>
                        `;
                        lucide.createIcons({ root: this.elements.toolViewContainer });
                    };
                    script.onload = () => {
                        if (window[`mountTool_${toolInfo.id.replace(/-/g, '_')}`]) {
                            window[`mountTool_${toolInfo.id.replace(/-/g, '_')}`](`${toolInfo.id}-mount-point`);
                            lucide.createIcons({ root: this.elements.toolViewContainer });
                        }
                    }
                    document.body.appendChild(script);
                }
            }, 150);
        }
    };

    // Style utility for lucide spin
    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .lucide-spin { animation: spin 2s linear infinite; }`;
    document.head.appendChild(style);

    // Boot App
    App.init();
});
