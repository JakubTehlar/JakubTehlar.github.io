const timeLimit = 20;

// Intervals for spawning moles
const easyDifficulty = 1200;
const mediumDifficulty = 900;
const hardDifficulty = 500;


class Game {
    constructor() {
        this.score = 0;
        this.timeLeft = timeLimit;
        this.timer = null;
        this.gameInterval = null;
        this.gamePaused = false;
        this.gameStarted = false;
        
        this.nameForm = document.getElementById("nameForm");
        this.nameSection = document.getElementById("nameSection");
        this.gameSection = document.getElementById("gameSection");
        this.submitButton = document.getElementById("submitBtn");
        this.welcomeName = document.getElementById("welcomeName");
        this.playerNameInput = document.getElementById("playerName");
        this.scoreDisplay = document.querySelector(".score");

        this.timeLeftDisplay = document.getElementById("timeLeft");
        this.timerElement = document.getElementById("timer");
        this.timerLeftUnitElement = document.getElementById("timerLeftUnit");

        this.difficultyLevel = document.getElementById("difficultySelect");

        this.bgMusic = document.getElementById("bgMusic1");
        this.volumeControl = document.getElementById("volumeControl");
        this.pauseMusicButton = document.getElementById("pauseMusicButton");
        this.pauseResumeButton = document.getElementById("pauseResumeButton");
        this.restartButton = document.getElementById("restartButton");
        this.muteVolumeIcon = document.getElementById("muteVolumeIcon");
        this.midVolumeIcon = document.getElementById("midVolumeIcon");
        this.maxVolumeIcon = document.getElementById("maxVolumeIcon");

        this.playIcon = document.getElementById("playIcon");
        this.pauseIcon = document.getElementById("pauseIcon");
        this.holes = document.querySelectorAll(".hole");
        this.moles = document.querySelectorAll(".mole");
        this.mapElement = document.getElementById("map");

    }

    initialize() {
        this.submitButton.addEventListener("click", (e) => this.startGame(e));
        this.volumeControl.addEventListener("input", (e) => this.adjustVolume(e));
        this.pauseMusicButton.addEventListener("click", () => this.toggleMusic());
        this.pauseResumeButton.addEventListener("click", () => this.toggleGamePause());
        this.restartButton.addEventListener("click", () => this.restartGame());
        this.moles.forEach(mole => mole.addEventListener("click", () => this.whackMole(mole)));

        // Volume icons
        this.setVolumeIcon();

        this.initializeMap();
    }

    initializeMap() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const map = L.map('map').setView([latitude, longitude], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup('This guy here... That\'s you!')
                    .openPopup();
            }, () => {
                alert("Could not get your location. Please enable location services and refresh the page.");
            });
        } else {
            alert("Geolocation is not supported by your browser");
        }
    }

    startGame(e) {
        e.preventDefault();
        const playerName = this.playerNameInput.value.trim();
        if (playerName) {
            this.welcomeName.textContent = playerName;
            this.nameSection.style.display = "none";
            this.gameSection.style.display = "block";
            this.startGameLogic();
        }
    }

    startGameLogic() {
        this.score = 0;
        this.timeLeft = timeLimit;
        this.scoreDisplay.textContent = this.score;
        this.timerElement.display = "block";
        this.timeLeftDisplay.textContent = this.timeLeft;
        this.gameStarted = true;
        this.gamePaused = false;
        this.bgMusic.volume = 0.5;
        this.volumeControl.value = 0.5;
        this.bgMusic.play();
        this.timer = setInterval(() => this.updateTimer(), 1000);
        switch (this.difficultyLevel.value) {
            case "easy":
                this.setGameInterval(easyDifficulty);
                break;
            case "medium":
                this.setGameInterval(mediumDifficulty);
                break;
            case "hard":
                this.setGameInterval(hardDifficulty);
                break;
            default:
                this.setGameInterval(easyDifficulty);
                break;
        }
    }

    setGameInterval(interval) {
        this.gameInterval = setInterval(() => this.showMole(), interval);
    }

    updateTimer() {
        if (!this.gamePaused) {
            this.timeLeft--;
            this.timeLeftDisplay.textContent = this.timeLeft;
            if (this.timeLeft < 0) {
                this.endGame();
            }
        }
    }

    showMole() {
        if (!this.gamePaused) {
            this.holes.forEach(hole => {
                const mole = hole.querySelector('.mole');
                if (hole.classList.contains('up')) {
                    mole.classList.add('despawn');
                    setTimeout(() => {
                        hole.classList.remove('up');
                        mole.classList.remove('despawn');
                    }, 300); // Duration of the despawn animation
                }
            });

            const randomHole = this.holes[Math.floor(Math.random() * this.holes.length)];
            randomHole.classList.add("up");
        }
    }

    showMoleRandom() {
        if (!this.gamePaused) {
            const interval = Math.random() * 1000 + 300;
            this.gameInterval = setTimeout(() => {
                this.showMole();
                this.showMoleRandom();
            }, interval);
        }
    }

    whackMole(mole) {
        if (!this.gamePaused) {
            this.score++;
            this.scoreDisplay.textContent = this.score;
            mole.parentElement.classList.remove("up");
        }
    }

    adjustVolume(e) {
        this.bgMusic.volume = e.target.value;
        this.setVolumeIcon();
    }

    setVolumeIcon() {
        if (this.bgMusic.volume == 0) {
            this.muteVolumeIcon.style.display = "inline";
            this.midVolumeIcon.style.display = "none";
            this.maxVolumeIcon.style.display = "none";
        }
        else if (this.bgMusic.volume <= 0.5) {
            this.muteVolumeIcon.style.display = "none";
            this.midVolumeIcon.style.display = "inline";
            this.maxVolumeIcon.style.display = "none";
        }
        else { 
            this.muteVolumeIcon.style.display = "none";
            this.midVolumeIcon.style.display = "none";
            this.maxVolumeIcon.style.display = "inline";
        }
    }

    toggleMusic() {
        if (this.bgMusic.paused) {
            this.bgMusic.play();
            this.setVolumeIcon();
            this.pauseMusicButton.textContent = "Pause Music";
        } else {
            this.bgMusic.pause();
            this.setVolumeIcon();
            this.pauseMusicButton.textContent = "Play Music";
        }
    }

    toggleGamePause() {
        if (this.gamePaused) {
            this.gamePaused = false;
            this.pauseIcon.style.display = "none";
            this.playIcon.style.display = "inline";
            this.bgMusic.play();
        } else {
            this.gamePaused = true;
            this.pauseIcon.style.display = "inline";
            this.playIcon.style.display = "none";
            this.bgMusic.pause();
        }
    }

    restartGame() {
        // confirmation
        if (!confirm("Are you sure you want to restart the game?")) {
            return;
        }
        clearInterval(this.timer);
        clearInterval(this.gameInterval);
        this.startGameLogic();
    }

    endGame() {
        clearInterval(this.timer);
        clearInterval(this.gameInterval);
        this.bgMusic.pause();
        alert(`Game Over! Your score is ${this.score}`);
        this.gameStarted = false;
        this.timeLeftDisplay.textContent = 0;
        this.timerElement.display = "none";
        // this.timerElement.textContent = "Game Over!";

        // Remove all spawned moles
        // Cannot whack moles after game over
        this.holes.forEach(hole => {
            const mole = hole.querySelector('.mole');
            if (hole.classList.contains('up')) {
                hole.classList.remove('up');
                mole.classList.remove('despawn');
            }
        });
    }
}

const game = new Game();
game.initialize();
