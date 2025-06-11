class PomodoroTimer {
    constructor() {
        this.timeLeft = 30 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        
        // DOM elements
        this.timeDisplay = document.querySelector('.time-display');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.modeButtons = document.querySelectorAll('.mode');
        
        // Bind event listeners
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.modeButtons.forEach(button => {
            button.addEventListener('click', () => this.setMode(button));
        });
        
        // Initialize display
        this.updateDisplay();
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    this.reset();
                    // Play a sound or show notification when timer ends
                    this.showCelebration();
                }
            }, 1000);
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timerId);
        }
    }
    
    reset() {
        this.pause();
        this.timeLeft = parseInt(document.querySelector('.mode.active').dataset.time) * 60;
        this.updateDisplay();
    }
    
    setMode(button) {
        this.modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.reset();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showCelebration() {
        const gifs = [
            'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',
            'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
            'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
            'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
            'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif'
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = 9999;

        const img = document.createElement('img');
        img.src = randomGif;
        img.alt = 'Celebration!';
        img.style.maxWidth = '80vw';
        img.style.maxHeight = '60vh';
        img.style.borderRadius = '16px';
        img.style.boxShadow = '0 4px 32px rgba(0,0,0,0.3)';
        img.style.marginBottom = '2rem';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.padding = '0.75rem 2rem';
        closeBtn.style.fontSize = '1.2rem';
        closeBtn.style.background = '#2563eb';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '8px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        closeBtn.addEventListener('click', () => document.body.removeChild(overlay));

        overlay.appendChild(img);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 