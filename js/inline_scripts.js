/**
 * ANAYAT-AI INLINE SCRIPTS
 * Advanced JavaScript for Bot Dashboard Functionality
 * Version: 2.0.0
 * Author: Anayat Team
 */

// ==========================================
// 🎯 CORE UTILITY FUNCTIONS
// ==========================================

const ANAYAT = {
    // Configuration
    config: {
        apiBaseUrl: 'http://localhost:3000/api',
        version: '2.0.0',
        defaultTheme: 'dark'
    },

    // State management
    state: {
        authToken: localStorage.getItem('anayat_token'),
        user: JSON.parse(localStorage.getItem('anayat_user') || '{}'),
        botStatus: 'offline',
        currentTab: 'deploy'
    },

    // Initialize application
    init: function() {
        console.log('🚀 ANAYAT-AI Dashboard Initializing...');
        this.setupEventListeners();
        this.loadUserPreferences();
        this.checkBotStatus();
        this.startRealTimeUpdates();
        
        // Show welcome notification
        this.showNotification('ANAYAT-AI Dashboard Loaded!', 'success');
    },

    // ==========================================
    // 🎯 EVENT HANDLERS SETUP
    // ==========================================

    setupEventListeners: function() {
        // Tab navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab || e.target.textContent.toLowerCase());
            });
        });

        // Form submissions
        document.getElementById('deployForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDeployment();
        });

        document.getElementById('configForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveConfiguration();
        });

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.target.dataset.action);
            });
        });

        // Terminal input
        document.getElementById('terminalInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleTerminalCommand(e.target.value);
                e.target.value = '';
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1': e.preventDefault(); this.switchTab('deploy'); break;
                    case '2': e.preventDefault(); this.switchTab('configure'); break;
                    case '3': e.preventDefault(); this.switchTab('monitor'); break;
                    case 'r': e.preventDefault(); this.restartBot(); break;
                    case 'l': e.preventDefault(); this.viewLogs(); break;
                }
            }
        });
    },

    // ==========================================
    // 🎯 TAB MANAGEMENT
    // ==========================================

    switchTab: function(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected tab
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
            
            // Add active class to clicked nav item
            event.target.classList.add('active');
            
            // Update state
            this.state.currentTab = tabName;
            
            // Tab-specific initialization
            this.onTabChange(tabName);
        }
    },

    onTabChange: function(tabName) {
        switch(tabName) {
            case 'monitor':
                this.updateSystemStats();
                break;
            case 'terminal':
                this.focusTerminal();
                break;
            case 'logs':
                this.loadLogs();
                break;
        }
    },

    // ==========================================
    // 🚀 DEPLOYMENT FUNCTIONS
    // ==========================================

    handleDeployment: function() {
        const formData = new FormData(document.getElementById('deployForm'));
        const deploymentData = Object.fromEntries(formData);
        
        this.showLoader('deployBtn', 'Deploying...');
        
        // Simulate deployment process
        this.simulateDeployment(deploymentData);
    },

    simulateDeployment: async function(data) {
        const steps = [
            { name: 'Validating Input', duration: 1000 },
            { name: 'Checking Dependencies', duration: 1500 },
            { name: 'Installing Packages', duration: 2000 },
            { name: 'Configuring Bot', duration: 1000 },
            { name: 'Starting Services', duration: 1500 }
        ];

        const progressBar = document.getElementById('deployProgress');
        const resultBox = document.getElementById('deployResult');
        
        try {
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                const progress = ((i + 1) / steps.length) * 100;
                
                this.updateProgress(progressBar, progress);
                this.updateTerminal(`📦 ${step.name}...`);
                
                await this.delay(step.duration);
                
                // Simulate random success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    this.updateTerminal(`✅ ${step.name} - Completed`);
                } else {
                    throw new Error(`Failed at: ${step.name}`);
                }
            }
            
            // Deployment successful
            this.showResult(resultBox, '✅ Deployment Completed Successfully!', 'success');
            this.updateBotStatus('online');
            this.hideLoader('deployBtn', 'Deploy Complete');
            
        } catch (error) {
            this.showResult(resultBox, `❌ Deployment Failed: ${error.message}`, 'error');
            this.hideLoader('deployBtn', 'Retry Deployment');
        }
    },

    // ==========================================
    // ⚙️ CONFIGURATION FUNCTIONS
    // ==========================================

    saveConfiguration: function() {
        const formData = new FormData(document.getElementById('configForm'));
        const configData = Object.fromEntries(formData);
        
        // Save to localStorage (simulate API call)
        localStorage.setItem('anayat_config', JSON.stringify(configData));
        
        this.showNotification('Configuration saved successfully!', 'success');
        
        // Update bot with new configuration
        this.updateBotConfig(configData);
    },

    updateBotConfig: async function(config) {
        try {
            // Simulate API call
            await this.apiCall('/config/update', 'POST', config);
            this.showNotification('Bot configuration updated!', 'success');
        } catch (error) {
            this.showNotification('Failed to update bot config', 'error');
        }
    },

    // ==========================================
    // 📊 MONITORING FUNCTIONS
    // ==========================================

    updateSystemStats: function() {
        // Update CPU usage
        const cpuUsage = Math.floor(Math.random() * 100);
        document.getElementById('cpuUsage').textContent = `${cpuUsage}%`;
        document.getElementById('cpuUsage').style.color = this.getUsageColor(cpuUsage);
        
        // Update memory usage
        const memoryUsage = Math.floor(Math.random() * 512) + 128;
        document.getElementById('memoryUsage').textContent = `${memoryUsage} MB`;
        
        // Update uptime
        const uptime = this.formatUptime(Math.floor(Math.random() * 86400));
        document.getElementById('uptime').textContent = uptime;
        
        // Update bot status
        const statusIndicator = document.getElementById('botStatus');
        statusIndicator.innerHTML = `${this.getStatusIcon()} ${this.state.botStatus.toUpperCase()}`;
    },

    getUsageColor: function(usage) {
        if (usage < 50) return '#00ff88';
        if (usage < 80) return '#ffaa00';
        return '#ff4444';
    },

    getStatusIcon: function() {
        switch(this.state.botStatus) {
            case 'online': return '🟢';
            case 'offline': return '🔴';
            case 'starting': return '🟡';
            default: return '⚪';
        }
    },

    formatUptime: function(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    },

    // ==========================================
    // 💻 TERMINAL FUNCTIONS
    // ==========================================

    handleTerminalCommand: function(command) {
        if (!command.trim()) return;
        
        const terminal = document.getElementById('terminalOutput');
        this.addTerminalLine(terminal, `$ ${command}`);
        
        // Process command
        setTimeout(() => {
            const response = this.processTerminalCommand(command);
            this.addTerminalLine(terminal, response);
            terminal.scrollTop = terminal.scrollHeight;
        }, 500);
    },

    processTerminalCommand: function(command) {
        const cmd = command.toLowerCase().trim();
        
        switch(cmd) {
            case 'status':
                return `Bot Status: ${this.state.botStatus}\nUptime: ${document.getElementById('uptime').textContent}`;
                
            case 'users':
                return `Total Users: ${Math.floor(Math.random() * 1000) + 100}\nActive Today: ${Math.floor(Math.random() * 100)}`;
                
            case 'restart':
                this.restartBot();
                return 'Restarting bot...';
                
            case 'clear':
                document.getElementById('terminalOutput').innerHTML = '';
                return 'Terminal cleared';
                
            case 'help':
                return `Available commands: status, users, restart, clear, help`;
                
            default:
                return `Command not found: ${command}\nType 'help' for available commands`;
        }
    },

    addTerminalLine: function(terminal, text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = text;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    },

    focusTerminal: function() {
        document.getElementById('terminalInput')?.focus();
    },

    updateTerminal: function(message) {
        const terminal = document.getElementById('terminalOutput');
        if (terminal) {
            this.addTerminalLine(terminal, message);
        }
    },

    // ==========================================
    // 🔧 BOT MANAGEMENT FUNCTIONS
    // ==========================================

    restartBot: function() {
        this.showNotification('Restarting bot...', 'warning');
        this.updateBotStatus('starting');
        
        // Simulate restart process
        setTimeout(() => {
            this.updateBotStatus('online');
            this.showNotification('Bot restarted successfully!', 'success');
        }, 3000);
    },

    stopBot: function() {
        if (confirm('Are you sure you want to stop the bot?')) {
            this.updateBotStatus('offline');
            this.showNotification('Bot stopped', 'warning');
        }
    },

    updateBot: function() {
        this.showLoader('updateBtn', 'Updating...');
        
        // Simulate update process
        setTimeout(() => {
            this.hideLoader('updateBtn', 'Update Complete');
            this.showNotification('Bot updated to latest version!', 'success');
        }, 4000);
    },

    updateBotStatus: function(status) {
        this.state.botStatus = status;
        document.querySelectorAll('.bot-status').forEach(el => {
            el.textContent = status.toUpperCase();
            el.className = `bot-status status-${status}`;
        });
    },

    checkBotStatus: function() {
        // Simulate status check
        setInterval(() => {
            if (this.state.botStatus === 'online') {
                // Randomly change status to simulate real environment
                if (Math.random() > 0.95) {
                    this.updateBotStatus('offline');
                }
            }
        }, 10000);
    },

    // ==========================================
    // 🎯 QUICK ACTIONS HANDLER
    // ==========================================

    handleQuickAction: function(action) {
        switch(action) {
            case 'restart':
                this.restartBot();
                break;
            case 'stop':
                this.stopBot();
                break;
            case 'update':
                this.updateBot();
                break;
            case 'backup':
                this.createBackup();
                break;
            case 'logs':
                this.viewLogs();
                break;
            case 'deploy':
                this.switchTab('deploy');
                break;
            default:
                console.log('Unknown action:', action);
        }
    },

    createBackup: function() {
        this.showNotification('Creating backup...', 'info');
        
        // Simulate backup process
        setTimeout(() => {
            const backupData = {
                timestamp: new Date().toISOString(),
                users: Math.floor(Math.random() * 1000),
                config: localStorage.getItem('anayat_config')
            };
            
            this.downloadJSON(backupData, `anayat-backup-${Date.now()}.json`);
            this.showNotification('Backup created and downloaded!', 'success');
        }, 2000);
    },

    viewLogs: function() {
        this.switchTab('terminal');
        this.updateTerminal('=== SYSTEM LOGS ===');
        this.updateTerminal('Loading recent logs...');
        
        // Simulate logs loading
        setTimeout(() => {
            this.updateTerminal('[INFO] Bot started successfully');
            this.updateTerminal('[INFO] Connected to WhatsApp');
            this.updateTerminal('[INFO] 150 users loaded');
        }, 1000);
    },

    // ==========================================
    // 🔌 API COMMUNICATION FUNCTIONS
    // ==========================================

    apiCall: async function(endpoint, method = 'GET', data = null) {
        const url = `${this.config.apiBaseUrl}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Authorization': `Bearer ${this.state.authToken}`,
                'Content-Type': 'application/json'
            }
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'API request failed');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // ==========================================
    // 🎨 UI UTILITY FUNCTIONS
    // ==========================================

    showLoader: function(buttonId, text) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.innerHTML = `<div class="loader"></div> ${text}`;
        }
    },

    hideLoader: function(buttonId, text) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.textContent = text;
        }
    },

    updateProgress: function(progressBar, percentage) {
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    },

    showResult: function(element, message, type) {
        if (element) {
            element.style.display = 'block';
            element.className = `result-box ${type}`;
            element.innerHTML = message;
        }
    },

    showNotification: function(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${this.getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        // Add styles if not already added
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    z-index: 1000;
                    animation: slideInRight 0.3s ease;
                    max-width: 300px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-success { background: #00ff88; }
                .notification-error { background: #ff4444; }
                .notification-warning { background: #ffaa00; }
                .notification-info { background: #6a0dad; }
                .notification-close { 
                    background: none; 
                    border: none; 
                    color: white; 
                    cursor: pointer;
                    font-size: 18px;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    getNotificationIcon: function(type) {
        switch(type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '💡';
        }
    },

    // ==========================================
    // 💾 STORAGE & PREFERENCES
    // ==========================================

    loadUserPreferences: function() {
        const theme = localStorage.getItem('anayat_theme') || this.config.defaultTheme;
        this.applyTheme(theme);
        
        const config = localStorage.getItem('anayat_config');
        if (config) {
            this.populateConfigForm(JSON.parse(config));
        }
    },

    applyTheme: function(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    },

    populateConfigForm: function(config) {
        Object.keys(config).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
             
