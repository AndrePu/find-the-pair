
import { defineFieldSizes, generateCardsNames, defineCardsInfo, getImages  } from '../../utility-functions';
import * as pipes from '../../pipes';
import * as globals from '../../globals';
import * as scoreModule from '../../score';

export class GameProcessView {
    constructor(appState, appOptions, cardStyleOptions, stopwatch, gamePausePopupDialogView, onCloseMediatorFunction, hotkeyService) {
        this.appState = appState;
        this.appOptions = appOptions;
        this.cardStyleOptions = cardStyleOptions;
        this.stopwatch = stopwatch;
        this.gamePausePopupDialogView = gamePausePopupDialogView;
        this.onCloseMediatorFunction = onCloseMediatorFunction; 

        [this.rows, this.columns] = [null, null];
        this.pair_amount = null;
        this.images = null;
        this.cardNames = null;
        
        this.gamePaused =false;
        this.cardsLocked = false;
        this.currentCard = null;
        this.attempts = null;

        this.ESCAPE_KEYDOWN = 'ESCAPE_KEYDOWN';
        hotkeyService.registerKeydown(
            this.ESCAPE_KEYDOWN,
            (key) => {
                return key === globals.keys.ESCAPE && this.appState.currentState === this.appState.states.GAME_PROCESS;
            },
            () => !this.gamePaused ? this.pauseGame() : this.gamePausePopupDialogView.optionsPageOpened ? this.gamePausePopupDialogView.returnToMainModalScreen() : this.resumeGame()
        );
    }

    render() {
        const pauseButton = document.getElementById('pause_button');
        pauseButton.onclick = this.pauseGame.bind(this);
        
        this.initializeBaseGameData();
        this.gamePausePopupDialogView.setCardsNames(this.cardsNames); 
        this.gamePausePopupDialogView.setRestartGameFunction(this.restartGame.bind(this));
        this.gamePausePopupDialogView.setResumeGameFunction(this.resumeGame.bind(this));
        this.gamePausePopupDialogView.render();

        this.buildGameField();
    }

    initializeBaseGameData() {
        [this.rows, this.columns] = defineFieldSizes(this.appOptions.fieldSize);
        this.pairs_amount = this.rows * this.columns / 2;
        this.images = getImages(this.pairs_amount);
        this.cardsNames = generateCardsNames(this.rows, this.columns);
    }

    buildGameField() {
        const gameProcessBlock = document.getElementById(this.appState.states.GAME_PROCESS);
        for (let i = 1; i <= this.rows; i++) {
            let rowBlock = document.createElement('div');
            gameProcessBlock.prepend(rowBlock);
            for (let j = 1; j <= this.columns; j++) {
                let card = document.createElement('div');
                card.className = 'card';
                card.id = `card${i}${j}`;
                card.style.background = this.cardStyleOptions.cardDefaultBackground
                rowBlock.append(card);
            }
        }
    }

    startGame() {
        this.cardsInfo = defineCardsInfo(
            pipes.arrRandomizerPipe.transform(this.cardsNames), 
            this.images
        );
        this.defineGameLogic();
        this.runGame();
    }

    runGame() {
        this.showCards();
        setTimeout(() => {
            this.hideCards();
            this.stopwatch.run();
            this.cardsLocked = false;
        }, 5000);
    }

    showCards() {
        for (let i = 0; i < this.cardsNames.length; i++) {
            let element = document.getElementById(this.cardsNames[i]);
            element.style.visibility = globals.DOMElementStyle.visibility.VISIBLE;
            element.style.backgroundImage = this.cardsInfo[this.cardsNames[i]].chosenColor;
            element.style.backgroundSize = this.cardStyleOptions.BACKGROUND_SIZE;
            element.style.backgroundPosition = this.cardStyleOptions.BACKGROUND_POSITION;
        }
    }
    
    hideCards() {
        for (let i = 0; i < this.cardsNames.length; i++) {
            let element = document.getElementById(this.cardsNames[i]);
            element.style.background = this.cardStyleOptions.cardDefaultBackground;
        }
    }
    
    clearGameParameters() {
        this.currentCard = null;
        this.cardsLocked = true;
        this.gamePaused =false;
        this.stopwatch.reset();
        this.attempts = 0;
        document.getElementById('attempts').innerHTML = this.attempts;
    }

    restartGame() {
        this.gamePausePopupDialogView.hideModalWindow();
        this.clearGameParameters();
        this.startGame();
    }

    resumeGame() {
        this.gamePausePopupDialogView.hideModalWindow();
        this.stopwatch.run();
        this.gamePaused =false;
    }

    pauseGame() {
        if (!this.stopwatch.isLaunched())
            return;
        
        this.stopwatch.pause();
        this.gamePaused =true;
        this.gamePausePopupDialogView.showModalWindow();
    }
    
    defineGameLogic() {

        for (let i = 0; i < this.cardsNames.length; i++) {
            let element = document.getElementById(this.cardsNames[i]);
            element.onclick = () => {
                if (this.cardsLocked || this.cardsNames[i] == this.currentCard) {
                    return;
                }
                this.attempts++;
                document.getElementById('attempts').innerHTML = this.attempts;
    
                let pairedCard = this.cardsInfo[this.cardsNames[i]].pair;
                let pairedElement = document.getElementById(pairedCard);
                if (this.cardsInfo[pairedCard].chosen) {
                    element.style.visibility = globals.DOMElementStyle.visibility.HIDDEN;
                    pairedElement.style.visibility = globals.DOMElementStyle.visibility.HIDDEN;
    
                    this.cardsInfo[pairedCard].visible = false;
                    this.cardsInfo[this.cardsNames[i]].visible = false;
                    this.currentCard = null;
    
                    let gameFinished = true;
    
                    for (let i = 0; i < this.cardsNames.length; i++) {
                        if (this.cardsInfo[this.cardsNames[i]].visible) {
                            gameFinished = false;
                            break;
                        }
                    }
                    if (gameFinished) {
                        this.endGame();
                    }
                } else {
                    element.style.backgroundImage = this.cardsInfo[this.cardsNames[i]].chosenColor;
                    element.style.backgroundSize = this.cardStyleOptions.BACKGROUND_SIZE;
                    element.style.backgroundPosition = this.cardStyleOptions.BACKGROUND_POSITION;
            
                    if (this.currentCard) {
                        this.cardsLocked = true;
                        setTimeout(() => {
                            this.cardsInfo[this.currentCard].chosen = false;
                            document.getElementById(this.currentCard).style.background = this.cardStyleOptions.cardDefaultBackground;
                            this.currentCard = null;
                            element.style.background = this.cardStyleOptions.cardDefaultBackground;
                            this.cardsLocked = false;
                        }, 1000);
                    } else {
                        this.cardsInfo[this.cardsNames[i]].chosen = true;
                        this.currentCard = this.cardsNames[i];
                    }
                }
            }
        }
    }

    
    endGame() {
        this.stopwatch.pause();
        const score = scoreModule.calculateScore(this.attempts, this.stopwatch.time, this.pairs_amount);
        
        let fieldRecords = JSON.parse(localStorage.getItem(this.appOptions.fieldSize));

        const currentScoreRecord = {
            name: this.appOptions.username,
            attempts: this.attempts,
            time: this.stopwatch.time,
            score: score
        }

        let gotRecord = false;
        let maxScore = score;
        let oldScore = maxScore;

        if (!fieldRecords) {
            fieldRecords = {
                maxScore: {},
                scores: []
            };
            fieldRecords.maxScore = currentScoreRecord;
            oldScore = 0;
            gotRecord = true;
        }
        else if (Number(fieldRecords.maxScore.score) < score) {
            gotRecord = true;

            oldScore = fieldRecords.maxScore.score;
            fieldRecords.scores = [fieldRecords.maxScore].concat(fieldRecords.scores);
            fieldRecords.maxScore = currentScoreRecord;
            
        } else {
            fieldRecords.scores.push(currentScoreRecord);
            fieldRecords.scores.sort((score1, score2) => score2.score - score1.score);
        }

        if (fieldRecords.scores.length === globals.MAX_TABLE_RECORDS_AMOUNT) {
            fieldRecords.scores.pop();
        }

        maxScore = fieldRecords.maxScore.score;
        localStorage.setItem(this.appOptions.fieldSize, JSON.stringify(fieldRecords));
        const displayInfo = scoreModule.getScoreInfoToDisplay(gotRecord, score, maxScore, oldScore);
        this.onCloseMediatorFunction(displayInfo);
    }

}