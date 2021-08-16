import * as globals from '../../globals';

export class GameProcessController {
    constructor(gameProcessView, appState, cardStyleOptions, hotkeyService, stopwatch, gamePausePopupDialogController, scoreService, appOptions, gameProcessToGameResultMediator) {
        this.gameProcessView = gameProcessView;
        this.stopwatch = stopwatch;
        this.gamePausePopupDialogController = gamePausePopupDialogController;
        this.cardStyleOptions = cardStyleOptions;
        this.scoreService = scoreService;
        this.appOptions = appOptions;
        this.gameProcessToGameResultMediator = gameProcessToGameResultMediator;

        this.gamePaused = false;

        this.ESCAPE_KEYDOWN = 'ESCAPE_KEYDOWN';
        hotkeyService.registerKeydown(
            this.ESCAPE_KEYDOWN,
            (key) => {
                return key === globals.keys.ESCAPE && appState.currentState === globals.appStates.GAME_PROCESS;
            },
            () => !this.gamePaused ? this.pauseGame() : 
                this.gamePausePopupDialogController.isOptionsPageOpened() ? 
                    this.gamePausePopupDialogController.returnToMainScreen() : this.resumeGame()
        );
    }

    initialize() {
        this.gameProcessView.callbackFunction = this.endGame.bind(this);
        this.gameProcessView.render(this.pauseGame.bind(this), this.applyThemeForCards.bind(this), this.stopwatch);

        this.gamePausePopupDialogController.initialize(
            this.restartGame.bind(this),
            this.resumeGame.bind(this),
            this.applyThemeForCards.bind(this)
        );
    }

    startGame() {
        this.gameProcessView.startGame();
    }
    
    restartGame() {
        this.gamePausePopupDialogController.hideModalWindow();
        this.clearGameParameters();
        this.gameProcessView.startGame();
    }

    resumeGame() {
        this.gamePausePopupDialogController.hideModalWindow();
        this.stopwatch.run();
        this.gamePaused = false;
    }

    pauseGame() {
        if (!this.stopwatch.isLaunched())
            return;
        
        this.stopwatch.pause();
        this.gamePaused = true;
        this.gamePausePopupDialogController.showModalWindow();
    }

    clearGameParameters() {
        this.stopwatch.reset();
        this.gamePaused = false;
        this.gameProcessView.clearGameParameters();
    }

    applyThemeForCards() {        
        for (let cardName of this.gameProcessView.cardsNames) {
            const cardElement = document.getElementById(cardName);
            if (cardElement) {
                cardElement.style.background = this.cardStyleOptions.cardDefaultBackground;
            }
        }
    }

    endGame() {
        this.saveCurrentScore();
        this.gameProcessToGameResultMediator();
    }

    saveCurrentScore() {
        const attempts = this.gameProcessView.attempts;
        const score = this.scoreService.calculateScore(this.gameProcessView.attempts, this.stopwatch.time, this.gameProcessView.pairsAmount);        
        
        const currentScore = {
            name: this.appOptions.username,
            attempts: attempts,
            time: this.stopwatch.time,
            score: score
        }

        this.scoreService.addNewScore(currentScore, this.appOptions.fieldSize);
    }
}
