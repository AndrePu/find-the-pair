import { defineFieldSizes, generateCardsNames, defineCardsInfo, getImages  } from '../../utility-functions';
import * as pipes from '../../pipes';
import * as globals from '../../globals';
import { setImage } from '../../dom-utility-functions';
import gameProcessHtmlTemplate from './game-process.html';
import { LanguageElement } from '../../models/language-element.model';

export class GameProcessView {
    constructor(appOptions, cardStyleOptions, appThemeService, localizationService) {
        this.appOptions = appOptions;
        this.cardStyleOptions = cardStyleOptions;
        this.callbackFunction = null; 
        this.appThemeService = appThemeService;
        this.localizationService = localizationService;
        
        this.ENTRY_NAME = 'GAME_PROCESS';
        this.TIME_FOR_SHOWING_CARDS = 5000;
        this.TIME_FOR_FAILED_ATTEMPT = 1000;
        this.cardsLocked = false;
        this.openedRecentlyCardName = null;
        this.attempts = 0;
    }

    render(pauseGameFunc, applyThemeForCards, stopwatch) {
        document.getElementById('game_process').innerHTML = gameProcessHtmlTemplate;
        document.getElementById('pause_button').onclick = pauseGameFunc.bind(this);
        this.appThemeService.registerButtons(['pause_button']); 

        this.localizationService.registerHtmlElements([
            new LanguageElement('pause_button', 'PAUSE_BUTTON', this.ENTRY_NAME),
            new LanguageElement('time_header_name', 'TIME_HEADER_NAME', this.ENTRY_NAME),
            new LanguageElement('attempts_header_name', 'ATTEMPTS_HEADER_NAME', this.ENTRY_NAME),
        ]);

        this.applyThemeForCards = applyThemeForCards;
        this.stopwatch = stopwatch;

        this.initializeBaseGameData();
        this.buildGameField();
        this.applyThemeForCards();
    }

    initializeBaseGameData() {
        [this.rows, this.columns] = defineFieldSizes(this.appOptions.fieldSize);
        this.pairsAmount = this.rows * this.columns / 2;
        this.images = getImages(this.pairsAmount);
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
            };
        }
    }
    
    endGame() {
        this.stopwatch.pause();
        this.callbackFunction();
    }
}
