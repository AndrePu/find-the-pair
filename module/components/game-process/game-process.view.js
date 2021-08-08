import { defineFieldSizes, generateCardsNames, defineCardsInfo, getImages  } from '../../utility-functions';
import * as pipes from '../../pipes';
import * as globals from '../../globals';
import * as scoreModule from '../../score';
import { setImage } from '../../dom-utility-functions';

export class GameProcessView {
    constructor(appOptions, cardStyleOptions, callbackFunction) {
        this.appOptions = appOptions;
        this.cardStyleOptions = cardStyleOptions;
        this.callbackFunction = callbackFunction; 
        
        this.TIME_FOR_SHOWING_CARDS = 5000;
        this.TIME_FOR_FAILED_ATTEMPT = 1000;
        this.cardsLocked = false;
        this.openedRecentlyCardName = null;
        this.attempts = 0;
    }

    render(pauseGameFunc, applyThemeForCards, stopwatch) {
        document.getElementById('pause_button').onclick = pauseGameFunc.bind(this);
        this.applyThemeForCards = applyThemeForCards;
        this.stopwatch = stopwatch;

        this.initializeBaseGameData();
        this.buildGameField();
        this.applyThemeForCards();
    }

    initializeBaseGameData() {
        [this.rows, this.columns] = defineFieldSizes(this.appOptions.fieldSize);
        this.pairs_amount = this.rows * this.columns / 2;
        this.images = getImages(this.pairs_amount);
        this.cardsNames = generateCardsNames(this.rows, this.columns);
    }

    buildGameField() {
        const gameProcessBlock = document.getElementById(globals.appStates.GAME_PROCESS);
        for (let i = 1; i <= this.rows; i++) {
            let rowBlock = document.createElement('div');
            gameProcessBlock.prepend(rowBlock);
            for (let j = 1; j <= this.columns; j++) {
                let card = document.createElement('div');
                card.className = 'card';
                card.id = `card${i}${j}`;
                rowBlock.append(card);
            }
        }
    }
    
    showCards() {
        for (let i = 0; i < this.cardsNames.length; i++) {
            let element = document.getElementById(this.cardsNames[i]);
            element.style.visibility = globals.DOMElementStyle.visibility.VISIBLE;
            setImage(element, this.cardsInfo[this.cardsNames[i]].chosenColor);
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
            this.applyThemeForCards();
            this.stopwatch.run();
            this.cardsLocked = false;
        }, this.TIME_FOR_SHOWING_CARDS);
    }
    
    clearGameParameters() {
        this.openedRecentlyCardName = null;
        this.cardsLocked = true;
        this.attempts = 0;
        document.getElementById('attempts').innerHTML = this.attempts;
    }

    defineGameLogic() {

        for (let i = 0; i < this.cardsNames.length; i++) {
            let element = document.getElementById(this.cardsNames[i]);
            element.onclick = () => {
                if (this.cardsLocked || this.cardsNames[i] == this.openedRecentlyCardName) {
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
                    this.openedRecentlyCardName = null;
    
                    if (this.cardsNames.every(cardName => !this.cardsInfo[cardName].visible)) {
                        this.endGame();
                    }
                } else {
                    setImage(element, this.cardsInfo[this.cardsNames[i]].chosenColor);
            
                    if (this.openedRecentlyCardName) {
                        this.cardsLocked = true;
                        setTimeout(() => {
                            this.cardsInfo[this.openedRecentlyCardName].chosen = false;
                            document.getElementById(this.openedRecentlyCardName).style.background = this.cardStyleOptions.cardDefaultBackground;
                            element.style.background = this.cardStyleOptions.cardDefaultBackground;
                            this.openedRecentlyCardName = null;
                            this.cardsLocked = false;
                        }, this.TIME_FOR_FAILED_ATTEMPT);
                    } else {
                        this.cardsInfo[this.cardsNames[i]].chosen = true;
                        this.openedRecentlyCardName = this.cardsNames[i];
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
        this.callbackFunction(displayInfo);
    }
}
