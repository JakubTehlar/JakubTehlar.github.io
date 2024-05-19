class Game {
    constructor() {
        this.holes = document.querySelectorAll('.hole');
        this.scoreBoard = document.querySelector('.score');
        this.moles = document.querySelectorAll('.mole');
        this.lastHole;
        this.timeUp = false;
        this.score = 0; 
        this.playerName = "";
        this.isPaused = false;
        this.timeLeft = 15;
        this.timerTimeout;
        this.currentMusic = document.getElementById('bgMusic1');
        this.volumeControl = document.getElementById('volumeControl');
        this.pauseMusicButton = document.getElementById('pauseMusicButton');
        this.pauseIcon = document.getElementById('pauseIcon');
        this.playIcon = document.getElementById('playIcon');    
    }

    randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    randomHole() {
        const index = Math.floor(Math.random() * this.holes.length);
        const hole = this.holes[index];
        if (hole === this.lastHole) {
            return this.randomHole();
        }
        this.lastHole = hole;
        return hole;
    }

    peep() {
        const time = this.randomTime(500, 1000);
        const hole = this.randomHole();
        hole.classList.add('up');
        setTimeout(() => {
            if (this.isPaused) {
                setTimeout(() => this.checkPause(), 100);
            } else {
                if (!this.timeUp) {
                    this.peep();
                }
                hole.classList.remove('up');
            }
        }, time);
    }

    startGame() {
        this.scoreBoard.textContent = 0;
        this.timeUp = false;
        this.score = 0;
        this.timeLeft = 15;
        clearTimeout(this.timerTimeout);
        this.updateTimer();
        this.toggleMusic();
        this.peep();
    }

    wack(e) {
        if (!e.isTrusted) return;
        this.score++;
        e.target.parentNode.classList.remove('up');
        this.scoreBoard.textContent = this.score;
    }

    pauseGame() {
        this.isPaused = true;
        clearTimeout(this.timerTimeout);
        this.currentMusic.pause();
    }

    resumeGame() {
        this.isPaused = false;
        this.peep();
        this.updateTimer();
        this.currentMusic.play();
    }

    restartGame() {
        this.isPaused = false;
        this.timeUp = false;
        this.score = 0;
        this.timeLeft = 15;
        clearTimeout(this.timerTimeout);
        this.updateTimer();
        this.startGame();
    }

    updateTimer() {
        const timerElement = document.getElementById('timeLeft');
        timerElement.textContent = this.timeLeft;
        this.timeLeft--;
        if (this.timeLeft < 0) {
            this.timeUp = true;
            timerElement.textContent = "Time's up!";
            this.currentMusic.pause();
            return;
        }
        if (!this.isPaused) {
            this.timerTimeout = setTimeout(() => this.updateTimer(), 1000);
        }
    }

    toggleMusic() {
        if (this.currentMusic.paused) {
            this.currentMusic.play();
            this.pauseMusicButton.textContent = "Pause Music";
        } else {
            this.currentMusic.pause();
            this.pauseMusicButton.textContent = "Play Music";
        }
    }

    handleNameFormSubmit(event) {
        event.preventDefault();
        const playerName = document.getElementById('playerName').value;
        if (playerName.trim() !== "") {
            document.getElementById('welcomeName').textContent = playerName;
            document.getElementById('nameSection').style.display = 'none';
            document.getElementById('gameSection').style.display = 'block';
            this.startGame();
        } else {
            alert("Please enter your name to start the game.");
        }
    }

    handlePauseResumeButtonClick() {
        if (this.isPaused) {
            this.pauseIcon.style.display = "inline";
            this.playIcon.style.display = "none";
            this.resumeGame();
        } else {
            this.pauseIcon.style.display = "none";
            this.playIcon.style.display = "inline";
            this.pauseGame();
        }
    }

    handleRestartButtonClick() {
        this.pauseGame();
        if (confirm("Are you sure you want to restart the game?")) {
            this.restartGame();
        } else {
            this.resumeGame();
        }
    }

    handlePauseMusicButtonClick() {
        this.toggleMusic();
    }

    initialize() {
        this.moles.forEach(mole => mole.addEventListener('click', this.wack.bind(this)));
        document.getElementById('nameForm').addEventListener('submit', this.handleNameFormSubmit.bind(this));
        this.pauseResumeButton = document.getElementById('pauseResumeButton');
        this.pauseResumeButton.addEventListener('click', this.handlePauseResumeButtonClick.bind(this));
        document.getElementById('restartButton').addEventListener('click', this.handleRestartButtonClick.bind(this));
        this.pauseMusicButton.addEventListener('click', this.handlePauseMusicButtonClick.bind(this));
        this.currentMusic.addEventListener('ended', this.toggleMusic.bind(this));
        this.currentMusic.play();
    }
}

const game = new Game();
game.initialize();