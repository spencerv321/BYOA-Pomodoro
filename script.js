class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25 minutes in seconds
        this.breakTime = 5 * 60; // 5 minutes in seconds
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.isWorkTime = true;
        this.timer = null;

        // DOM elements
        this.timeDisplay = document.querySelector('.time-display');
        this.modeIndicator = document.querySelector('.mode-indicator');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.toggleButton = document.getElementById('toggle-mode');
        this.add5MinButton = document.getElementById('add-5-min');
        this.toggleButton.className = 'break-mode'; // Initial state for work time
        this.progressBar = document.querySelector('.progress');
        this.sessionStats = document.querySelector('.session-stats');

        // Event listeners
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.toggleButton.addEventListener('click', () => this.toggleMode());
        this.add5MinButton.addEventListener('click', () => this.addFiveMinutes());

        this.updateDisplay();
        this.loadSessionStats();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timer = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timer);
        }
    }

    reset() {
        this.pause();
        this.isWorkTime = true;
        this.timeLeft = this.workTime;
        this.updateDisplay();
        this.modeIndicator.textContent = 'Current Mode: Work';
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.switchMode();
        }
    }

    switchMode() {
        if (!this.isWorkTime) {
            this.incrementSessionCount();
        }
        this.isWorkTime = !this.isWorkTime;
        this.timeLeft = this.isWorkTime ? this.workTime : this.breakTime;
        this.modeIndicator.textContent = this.isWorkTime ? 'Current Mode: Work' : 'Current Mode: Break';
        this.toggleButton.textContent = this.isWorkTime ? 'Switch to Break' : 'Switch to Work';
        this.toggleButton.className = this.isWorkTime ? 'break-mode' : 'work-mode';
        this.updateDisplay();
    }

    toggleMode() {
        this.pause();
        this.switchMode();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        // Update progress bar
        const total = this.isWorkTime ? this.workTime : this.breakTime;
        const percent = 100 * (1 - this.timeLeft / total);
        this.progressBar.style.width = `${percent}%`;
    }

    addFiveMinutes() {
        this.timeLeft += 300;
        this.updateDisplay();
    }

    loadSessionStats() {
        const today = new Date().toISOString().slice(0, 10);
        const stats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}');
        if (stats.date !== today) {
            this.sessionCount = 0;
            this.saveSessionStats(today, 0);
        } else {
            this.sessionCount = stats.count || 0;
        }
        this.updateSessionStatsDisplay();
    }

    saveSessionStats(date, count) {
        localStorage.setItem('pomodoroStats', JSON.stringify({ date, count }));
    }

    incrementSessionCount() {
        const today = new Date().toISOString().slice(0, 10);
        this.sessionCount = (this.sessionCount || 0) + 1;
        this.saveSessionStats(today, this.sessionCount);
        this.updateSessionStatsDisplay();
    }

    updateSessionStatsDisplay() {
        this.sessionStats.textContent = `Pomodoros completed today: ${this.sessionCount}`;
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();

    // Dark mode toggle logic
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    // Load preference
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
    }
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });
}); 