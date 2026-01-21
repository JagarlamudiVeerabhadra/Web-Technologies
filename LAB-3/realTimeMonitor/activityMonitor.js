class RealTimeActivityMonitor {
    constructor() {
        this.activities = [];
        this.stats = {
            clicks: 0,
            keypresses: 0,
            focusChanges: 0,
            totalEvents: 0,
            warnings: 0
        };
        this.lastMinuteClicks = [];
        this.sessionStart = Date.now();
        this.init();
    }

    init() {
        this.attachGlobalEventListeners();
        this.attachDemoEventListeners();
        this.updateStatsDisplay();
        this.startActivityCheck();
    }

    attachGlobalEventListeners() {
        // Capture and bubble phases for comprehensive tracking
        ['click', 'keydown', 'focus', 'focusin', 'focusout'].forEach(eventType => {
            document.addEventListener(eventType, (e) => this.logActivity(e, 'capture'), true);  // Capture phase
            document.addEventListener(eventType, (e) => this.logActivity(e, 'bubble'), false);  // Bubble phase
        });

        // Throttled mousemove to prevent spam (not in requirements but useful)
        let mouseMoveTimer;
        document.addEventListener('mousemove', (e) => {
            clearTimeout(mouseMoveTimer);
            mouseMoveTimer = setTimeout(() => this.logActivity(e, 'mousemove'), 100);
        });
    }

    attachDemoEventListeners() {
        // Enhanced tracking on demo elements
        document.querySelector('.demo-area').addEventListener('scroll', (e) => {
            this.logActivity(e, 'scroll');
        });
    }

    logActivity(event, phase) {
        const timestamp = Date.now();
        const activity = {
            id: this.stats.totalEvents + 1,
            timestamp,
            type: event.type,
            phase,
            target: event.target.nodeName + (event.target.id ? `#${event.target.id}` : '') + 
                   (event.target.className ? `.${Array.from(event.target.classList).join('.')}` : ''),
            coordinates: event.type === 'click' || event.type === 'mousemove' ? 
                        { x: event.clientX, y: event.clientY } : null,
            key: event.key || null,
            timeSinceLast: timestamp - (this.activities[this.activities.length - 1]?.timestamp || this.sessionStart),
            suspicious: false
        };

        this.activities.push(activity);
        this.updateStats(event.type);
        this.checkSuspiciousActivity(activity);
        this.updateActivityLog();
        this.trimActivityLog();
    }

    updateStats(eventType) {
        switch(eventType) {
            case 'click':
                this.stats.clicks++;
                this.lastMinuteClicks.push(Date.now());
                break;
            case 'keydown':
                this.stats.keypresses++;
                break;
            case 'focus':
            case 'focusin':
            case 'focusout':
                this.stats.focusChanges++;
                break;
        }
        this.stats.totalEvents++;
    }

    checkSuspiciousActivity(activity) {
        const now = Date.now();
        
        // Threshold 1: 50+ clicks total
        if (this.stats.clicks >= 50) {
            activity.suspicious = true;
            this.triggerWarning('High click volume detected (50+ clicks)', 'clicks');
        }

        // Threshold 2: 20+ clicks in last minute
        const minuteAgo = now - 60000;
        const recentClicks = this.lastMinuteClicks.filter(time => time > minuteAgo).length;
        if (recentClicks >= 20) {
            activity.suspicious = true;
            this.triggerWarning(`Rapid clicking: ${recentClicks} clicks/minute`, 'rapid_clicks');
        }

        // Threshold 3: Rapid keypresses (20+ in 5 seconds)
        const recentActivities = this.activities.slice(-20);
        const fiveSecondsAgo = now - 5000;
        const recentKeypresses = recentActivities.filter(a => 
            a.type === 'keydown' && a.timestamp > fiveSecondsAgo
        ).length;
        if (recentKeypresses >= 20) {
            activity.suspicious = true;
            this.triggerWarning(`Rapid typing: ${recentKeypresses} keypresses/5s`, 'rapid_typing');
        }

        // Threshold 4: Frequent focus changes (10+ per minute)
        const recentFocus = recentActivities.filter(a => 
            a.type === 'focus' || a.type === 'focusin' || a.type === 'focusout'
        ).length;
        if (recentFocus >= 10) {
            activity.suspicious = true;
            this.triggerWarning(`Frequent focus switching: ${recentFocus}/min`, 'focus_spam');
        }
    }

    triggerWarning(message, type) {
        this.stats.warnings++;
        const banner = document.getElementById('warningBanner');
        const warningText = document.getElementById('warningText');
        warningText.textContent = message;
        banner.style.display = 'block';
        setTimeout(() => banner.style.display = 'none', 5000);
    }

    updateActivityLog() {
        const logContainer = document.getElementById('activityLog');
        const recentActivities = this.activities.slice(-20); // Show last 20
        
        logContainer.innerHTML = recentActivities.map(activity => {
            const time = new Date(activity.timestamp).toLocaleTimeString();
            const typeClass = activity.suspicious ? 'warning' : 
                            activity.type === 'click' ? 'click' : 
                            activity.type === 'keydown' ? 'keypress' : 'focus';
            
            return `
                <div class="log-entry ${typeClass}">
                    <strong>[${time}]</strong> 
                    <span>${activity.type.toUpperCase()} ${activity.phase}</span><br>
                    <small>Target: ${activity.target}</small><br>
                    ${activity.coordinates ? `Coords: (${activity.coordinates.x}, ${activity.coordinates.y})` : ''}
                    ${activity.key ? `Key: "${activity.key}"` : ''}
                    ${activity.suspicious ? '<strong>⚠️ SUSPICIOUS</strong>' : ''}
                </div>
            `;
        }).join('');
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    updateStatsDisplay() {
        document.getElementById('clickCount').textContent = this.stats.clicks;
        document.getElementById('keyCount').textContent = this.stats.keypresses;
        document.getElementById('focusCount').textContent = this.stats.focusChanges;
        document.getElementById('totalEvents').textContent = this.stats.totalEvents;
        document.getElementById('warningCount').textContent = this.stats.warnings;
    }

    trimActivityLog() {
        // Keep only last 1000 activities to prevent memory issues
        if (this.activities.length > 1000) {
            this.activities = this.activities.slice(-1000);
        }
    }

    startActivityCheck() {
        setInterval(() => {
            this.lastMinuteClicks = this.lastMinuteClicks.filter(time => time > Date.now() - 60000);
            this.updateStatsDisplay();
        }, 1000);
    }

    resetLog() {
        this.activities = [];
        this.stats = { clicks: 0, keypresses: 0, focusChanges: 0, totalEvents: 0, warnings: 0 };
        this.lastMinuteClicks = [];
        document.getElementById('warningBanner').style.display = 'none';
        this.updateActivityLog();
        this.updateStatsDisplay();
    }

    exportLog() {
        const logText = this.activities.map(activity => {
            const time = new Date(activity.timestamp).toISOString();
            return JSON.stringify(activity, null, 2);
        }).join('\n\n---\n\n');
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-log-${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Global instance and initialization
const activityMonitor = new RealTimeActivityMonitor();
