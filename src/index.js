'use strict';
import * as scoreModule from '../module/score';
import * as pipes from '../module/pipes';
import * as globals from '../module/globals';
import { Stopwatch } from '../module/stopwatch';
import './styles.css';
import { AppOptions } from '../models/app-options';
import { AppState } from '../models/app-state';


for (let i = 1; i <= globals.MAX_PAIRS_NUMBER; i++) {
    import ('./assets/images/' + i.toString() + '.jpg');
}


const cardStyleOptions = {
    BACKGROUND_SIZE: 'cover',
    BACKGROUND_POSITION: 'center center',
    cardDefaultBackground: '#378cee'
};

const appState = new AppState();
const appOptions = new AppOptions();

const recordTabLinksPanel = {
    tablinksActiveClassName: {
        dark: 'active-dark-mode',
        light: 'active-light-mode'
    },
    defaultTablinkClassName: 'tablinks', 
    onRecordTabLinkClick(size) {
        const tabsElements = document.getElementsByClassName('tablinks');

        for (let i = 0; i < tabsElements.length; i++) {
            if (tabsElements[i].innerText === size) {
                tabsElements[i].className += globals.SPACE + this.tablinksActiveClassName[appOptions.theme];
            } else {
                tabsElements[i].className = this.defaultTablinkClassName;
            }
        }
    },
    initializeRecordTableButtons() {
        const tabsElements = document.getElementsByClassName('tablinks');

        for (let i = 0; i < tabsElements.length; i++) {
            if (tabsElements[i].innerText === appOptions.fieldSize) {
                tabsElements[i].className += globals.SPACE + this.tablinksActiveClassName[appOptions.theme];
                break;
            } else  {
                tabsElements[i].className = this.defaultTablinkClassName;
            }
        }
    },
    defaultRecordTableButtons() {
        const tabsElements = document.getElementsByClassName('tablinks');

        for (let i = 0; i < tabsElements.length; i++) {
            tabsElements[i].className = this.defaultTablinkClassName;
        }
    }
}

let recordsTableItems = [];

let columns = null;
let rows = null;
let pairs_amount = 0;

let images;
let cards;

let cardsLocked;

let cardsInfo = {};
let currentCard = null;

let gamePaused = false;
let attempts = 0;
let optionsPageOpened = false;

const stopwatch = new Stopwatch();
stopwatch.registerTimeListener((time) => {
    document.getElementById('stopwatch').innerHTML = `${time} сек`
});

defineButtonsClickEvents();
enableHotkeys();

function defineButtonsClickEvents() {
    const startButton = document.getElementById('start_button');
    startButton.onclick = startGame;

    const pauseButton = document.getElementById('pause_button');
    pauseButton.onclick = pauseGame;
 
    const modalRestartButton = document.getElementById('modal_restart_button');
    modalRestartButton.onclick = restartGame;

    const modalResumeButton = document.getElementById('modal_resume_button');
    modalResumeButton.onclick = resumeGame;

    const modalIcon = document.getElementById('modal_icon');
    modalIcon.onclick = () => optionsPageOpened ? returnToMainModalScreen() : resumeGame();

    const modalMenuButton = document.getElementById('modal_menu_button');
    modalMenuButton.onclick = () => location.reload();

    const modalOptionsButton = document.getElementById('modal_options_button');
    modalOptionsButton.onclick = openModalOptionsPage;

    const modalOptionsApplyButton = document.getElementById('modal_optionsApply_button');
    modalOptionsApplyButton.onclick = applyOptionsFromModalWindow;

    const restartButton = document.getElementById('restart_button');
    restartButton.onclick = () => {
        appState.currentState = appState.states.GAME_PROCESS;
        document.getElementById(appState.states.GAME_RESULT).style.display = globals.DOMElementStyle.display.NONE;
        document.getElementById(appState.states.GAME_PROCESS).style.display = globals.DOMElementStyle.display.BLOCK;
        restartGame();
    };

    const recordsButton = document.getElementById('records_button');
    recordsButton.onclick = () => {
        appState.goToTheFollowingState();
        recordTabLinksPanel.initializeRecordTableButtons();
        loadRecordsTable(JSON.parse(localStorage.getItem(appOptions.fieldSize)));
    };



    const tabLinksButtons = document.getElementsByClassName('tablinks');    
    for(let i = 0; i < tabLinksButtons.length; i++) {
        tabLinksButtons[i].onclick = () => openFieldRecords(tabLinksButtons[i].innerHTML);
    }

    const recordsReturnButton = document.getElementById('record_return_icon');
    recordsReturnButton.onclick = () => {
        clearRecordsTable();
        recordTabLinksPanel.defaultRecordTableButtons();
        appState.goToTheFollowingState();
    }

    const menuButton = document.getElementById('menu_button');
    menuButton.onclick = () => location.reload();
}

function enableHotkeys() {
    window.onkeydown = event => 
    {
        switch (event.key) {
            case globals.keys.ENTER:
                switch (appState.currentState) {
                    case appState.states.GAME_SETUP:
                        startGame();
                        break;
                    case appState.states.GAME_RESULT:
                        location.reload();
                        break;
                }
                break;
            case globals.keys.ESCAPE:
                switch(appState.currentState) {
                    case appState.states.GAME_PROCESS:
                        !gamePaused ? pauseGame() : optionsPageOpened ? returnToMainModalScreen() : resumeGame();
                        break;
                    case appState.states.GAME_RECORD:
                        clearRecordsTable();
                        appState.goToTheFollowingState();
                        break;
                }
        }
        
    }
}


function startGame() {
    if (appState.currentState === appState.states.GAME_PROCESS)
        return;

    const nameElement = document.getElementById('name');
    const langElements = document.getElementsByName('language');
    const fieldSizeElements = document.getElementsByName('field-size');
    const themeElements = document.getElementsByName('theme');
    const warningMessageElement = document.getElementById('error_label');

    const checkedLangElementIndex = getIndexOfCheckedElement(langElements);
    const checkedFieldSizeElementIndex = getIndexOfCheckedElement(fieldSizeElements);
    const checkedThemeElementIndex = getIndexOfCheckedElement(themeElements);

    if (nameElement.value) {
        appOptions.username = nameElement.value;
    } else {
        warningMessageElement.innerText = globals.appSetupOptionsErrors.EMPTY_NAME_FIELD_ERROR;
        warningMessageElement.style.visibility = globals.DOMElementStyle.visibility.VISIBLE;
        return;
    }

    if (checkedLangElementIndex !== -1) {
        appOptions.interfaceLanguage = langElements[checkedLangElementIndex].value;
    } else {
        warningMessageElement.innerText = globals.appSetupOptionsErrors.UNCHECKED_LANGUAGE_ERROR;
        warningMessageElement.style.visibility = globals.DOMElementStyle.visibility.VISIBLE;
        return;
    }

    if (checkedFieldSizeElementIndex !== -1) {
        appOptions.fieldSize = fieldSizeElements[checkedFieldSizeElementIndex].value;
    } else {
        warningMessageElement.innerText = globals.appSetupOptionsErrors.UNCHECKED_FIELDSIZE_ERROR;
        warningMessageElement.style.visibility = globals.DOMElementStyle.visibility.VISIBLE;
        return;
    }
    if (checkedThemeElementIndex !== -1) {
        appOptions.theme = themeElements[checkedThemeElementIndex].value;
    } else {
        warningMessageElement.innerText = globals.appSetupOptionsErrors.UNCHECKED_THEME_ERROR;
        warningMessageElement.style.visibility = globals.DOMElementStyle.visibility.VISIBLE;
        return;
    }
    appState.goToTheFollowingState();


    defineFieldSizes();
    images = getImages();
    cards = pipes.arrRandomizerPipe.transform(generateCardsNames(rows, columns));
    buildGameField();
    applyAppTheme();
    defineCardsInfo()    
    defineGameLogic();
    runGame();
}

function pauseGame() {
    if (!stopwatch.isLaunched())
        return;
    
    document.body.style.overflow = globals.DOMElementStyle.overflow.HIDDEN;
    const modalWindow = document.getElementById('modal_window');
    modalWindow.style.pointerEvents = 'auto';
    modalWindow.style.opacity = 1;
    stopwatch.pause();
    gamePaused = true;
}

function resumeGame() {
    document.body.style.overflow = globals.DOMElementStyle.overflow.AUTO;
    const modalWindow = document.getElementById('modal_window');
    modalWindow.style.pointerEvents = 'none';
    modalWindow.style.opacity = 0;
    stopwatch.run();
    gamePaused = false;
}

function restartGame() {
    resumeGame();
    stopwatch.pause();
    clearGameParameters();
    cards = pipes.arrRandomizerPipe.transform(cards);
    defineCardsInfo();
    defineGameLogic();
    runGame();
}

function endGame() {
    stopwatch.pause();
    const score = scoreModule.calculateScore(attempts, stopwatch.time, pairs_amount);

    let fieldRecords = JSON.parse(localStorage.getItem(appOptions.fieldSize));

    const currentScoreRecord = {
        name: appOptions.username,
        attempts: attempts,
        time: stopwatch.time,
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
    localStorage.setItem(appOptions.fieldSize, JSON.stringify(fieldRecords));
    
    const displayInfo = scoreModule.getScoreInfoToDisplay(gotRecord, score, maxScore, oldScore);
    document.getElementById('game_result_label').innerText = displayInfo;

    appState.goToTheFollowingState();
}

function defineFieldSizes() {
    switch (appOptions.fieldSize) {
        case globals.fieldSizes.field3x4:
            rows = 3;
            columns = 4;
            break;
        case globals.fieldSizes.field4x4:
            rows = 4;
            columns = 4;
            break;
        case globals.fieldSizes.field5x4:
            rows = 5;
            columns = 4;
            break;
        case globals.fieldSizes.field6x6:
            rows = 6;
            columns = 6;
            break;
    }
    pairs_amount = rows * columns / 2;
}

function generateCardsNames(rows, columns) {
    let cards = [];

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= columns; j++) {
            cards.push(`card${i}${j}`);
        }
    }
    return cards;
}

function buildGameField() {
    const gameProcessBlock = document.getElementById(appState.states.GAME_PROCESS);
    for (let i = 1; i <= rows; i++) {
        let rowBlock = document.createElement('div');
        gameProcessBlock.prepend(rowBlock);
        for (let j = 1; j <= columns; j++) {
            let card = document.createElement('div');
            card.className = 'card';
            card.id = `card${i}${j}`;
            rowBlock.append(card);
        }
    }
}

function applyAppTheme() {
    document.body.style.color = globals.appTheme[appOptions.theme].color;
    document.body.style.background = globals.appTheme[appOptions.theme].background;
    cardStyleOptions.cardDefaultBackground = globals.appTheme[appOptions.theme].cardDefaultBackground;
    document.getElementById('pause_button').className = globals.appTheme[appOptions.theme].buttonClassName;
    document.getElementById('modal_window_content').className = globals.appTheme[appOptions.theme].modalWindowContentClassName;
    document.getElementById('modal_icon').className = globals.appTheme[appOptions.theme].iconClassName;
    document.getElementById('modal_resume_button').className = globals.appTheme[appOptions.theme].buttonClassName;
    document.getElementById('modal_restart_button').className = globals.appTheme[appOptions.theme].buttonClassName;
    document.getElementById('modal_options_button').className = globals.appTheme[appOptions.theme].buttonClassName;
    document.getElementById('modal_menu_button').className = globals.appTheme[appOptions.theme].buttonClassName;
    document.getElementById('modal_optionsApply_button').className = globals.appTheme[appOptions.theme].buttonClassName;
    document.getElementById('restart_button').className = globals.appTheme[appOptions.theme].buttonClassName;
    document.getElementById('records_button').className = globals.appTheme[appOptions.theme].buttonClassName;
    document.getElementById('menu_button').className = globals.appTheme[appOptions.theme].buttonClassName;
    document.getElementById('record_return_icon').className = globals.appTheme[appOptions.theme].iconClassName;

    for (let i = 0; i < cards.length; i++) {
        document.getElementById(cards[i]).style.background = cardStyleOptions.cardDefaultBackground;
    }
}

function defineCardsInfo() {
    for (let i = 0; i < cards.length; i++) {
        cardsInfo[cards[i]] = {
            visible: true,
            chosen: false,
            chosenColor: pipes.imagePipe.transform(images[i % (cards.length/2)]),
            pair: cards[(i + (cards.length/2)) % cards.length]
        };
    }
}

function defineGameLogic() {

    for (let i = 0; i < cards.length; i++) {
        let element = document.getElementById(cards[i]);
        element.onclick = function() {
            if (cardsLocked || cards[i] == currentCard) {
                return;
            }
            attempts++;
            document.getElementById('attempts').innerHTML = attempts;

            let pairedCard = cardsInfo[cards[i]].pair;
            let pairedElement = document.getElementById(pairedCard);
            if (cardsInfo[pairedCard].chosen) {
                element.style.visibility = globals.DOMElementStyle.visibility.HIDDEN;
                pairedElement.style.visibility = globals.DOMElementStyle.visibility.HIDDEN;

                cardsInfo[cards[i]].visible = false;
                cardsInfo[pairedCard].visible = false;
                currentCard = null;

                let gameFinished = true;

                for (let i = 0; i < cards.length; i++) {
                    if (cardsInfo[cards[i]].visible) {
                        gameFinished = false;
                        break;
                    }
                }
                if (gameFinished) {
                    endGame();
                }
            } else {
                element.style.backgroundImage = cardsInfo[cards[i]].chosenColor;
                element.style.backgroundSize = cardStyleOptions.BACKGROUND_SIZE;
                element.style.backgroundPosition = cardStyleOptions.BACKGROUND_POSITION;
        
                if (currentCard) {
                    cardsLocked = true;
                    setTimeout(() => {
                        cardsInfo[currentCard].chosen = false;
                        document.getElementById(currentCard).style.background = cardStyleOptions.cardDefaultBackground;
                        currentCard = null;
                        element.style.background = cardStyleOptions.cardDefaultBackground;
                        cardsLocked = false;
                    }, 1000)
                } else {
                    cardsInfo[cards[i]].chosen = true;
                    currentCard = cards[i];
                }
            }
        }
    }
}

function runGame() {
    showCards();
    setTimeout(() => {
        hideCards();
        stopwatch.run();
        cardsLocked = false;
    }, 5000);
}


function returnToMainModalScreen() {
    const modalIcon = document.getElementById('modal_icon');
    modalIcon.title = 'Закрыть';
    modalIcon.innerText = '×';

    const modalTitle = document.getElementById('modal_title');
    modalTitle.innerText = 'Опции';
    optionsPageOpened = false;

    const modalOptionsPage = document.getElementById('modal_options_page');
    modalOptionsPage.style.display = globals.DOMElementStyle.display.NONE;

    const modalButtonsContainer = document.getElementById('modal_buttons_container');
    modalButtonsContainer.style.display = globals.DOMElementStyle.display.BLOCK;
}

function applyOptionsFromModalWindow() {
    const modalThemeElements = document.getElementsByName('modal_theme');
    const checkedThemeElementIndex = getIndexOfCheckedElement(modalThemeElements);
    appOptions.theme = modalThemeElements[checkedThemeElementIndex].value;
    applyAppTheme();
}

function openModalOptionsPage() {
    optionsPageOpened = true;

    const modalButtonsContainer = document.getElementById('modal_buttons_container');
    modalButtonsContainer.style.display = globals.DOMElementStyle.display.NONE;

    const modalOptionsPage = document.getElementById('modal_options_page');
    modalOptionsPage.style.display = globals.DOMElementStyle.display.BLOCK;
    
    const modalIcon = document.getElementById('modal_icon');
    modalIcon.title = 'Назад';
    modalIcon.innerText = '↩';

    const modalTitle = document.getElementById('modal_title');
    modalTitle.innerText = 'Опции';

    const modalThemeElements = document.getElementsByName('modal_theme');
    modalThemeElements.forEach((themeElement) => {
        if (themeElement.value === appOptions.theme) {
            themeElement.checked = true;
        }
    })

    const modalLangElements = document.getElementsByName('modal_language');
    modalLangElements.forEach((langElement) => {
        if (langElement.value === appOptions.interfaceLanguage) {
            langElement.checked = true;
        }
    })
}

function getIndexOfCheckedElement(DOMElements) {
    let res = -1;
    for (let i = 0; i < DOMElements.length; i++) {
        if (DOMElements[i].checked) {
            res = i;
            break;
        }
    }
    return res;
}

function getImages() {
    let images = [];
    for (let i = 1; i <= pairs_amount; i++) {
        images.push(`assets/images/${i}.jpg`);
    }
    return images;
}


function showCards() {
    for (let i = 0; i < cards.length; i++) {
        let element = document.getElementById(cards[i]);
        element.style.backgroundImage = cardsInfo[cards[i]].chosenColor;
        element.style.backgroundSize = cardStyleOptions.BACKGROUND_SIZE;
        element.style.backgroundPosition = cardStyleOptions.BACKGROUND_POSITION;

    }
}

function hideCards() {
    for (let i = 0; i < cards.length; i++) {
        let element = document.getElementById(cards[i]);
        element.style.background = cardStyleOptions.cardDefaultBackground;
    }
}

function clearGameParameters() {
    currentCard = null;
    cardsLocked = true;
    stopwatch.reset();
    attempts = 0;
    const attemptsLabel = document.getElementById('attempts');

    attemptsLabel.innerHTML = attempts;
    displayHiddenCards();
}

function displayHiddenCards() {
    for (let i = 0; i < cards.length; i++) {
        if (!cardsInfo[cards[i]].visible) {
            const cardElement = document.getElementById(cards[i]);
            cardElement.style.visibility = globals.DOMElementStyle.visibility.VISIBLE;
        }
    }
}

function openFieldRecords(size) {

    recordTabLinksPanel.onRecordTabLinkClick(size)
    const gameRecords = JSON.parse(localStorage.getItem(size));
    clearRecordsTable();
    loadRecordsTable(gameRecords);
}

function clearRecordsTable() {
    for (let i = 0; i < recordsTableItems.length; i++) {
      document.getElementById(recordsTableItems[i]).remove();
    }
    recordsTableItems = [];
}

function loadRecordsTable(gameRecords) {
    if (!gameRecords) {
        return;
    }

    const recordsTable = document.getElementById('records-table');
    createTableRecord(gameRecords.maxScore, 1, recordsTable);

    for (let i = 0; i < gameRecords.scores.length; i++) {
      createTableRecord(gameRecords.scores[i], i+2, recordsTable);
    }
}

function createTableRecord(record, index, recordsTable) {
    let domRecord = document.createElement('tr');
    domRecord.id = `${record.name}${index}`;
    domRecord.innerHTML = 
    `<td>${index}</td>` +
    `<td>${record.name}</td>` +
    `<td>${record.attempts}</td>` +
    `<td>${record.time} сек</td>` + 
    `<td>${record.score}</td>`;

    recordsTable.append(domRecord);
    recordsTableItems.push(domRecord.id);
}
