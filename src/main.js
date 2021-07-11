'use strict';
import './styles.css';
for (let i = 1; i <= globals.MAX_PAIRS_NUMBER; i++) {
    import ('./assets/images/' + i.toString() + '.jpg');
}

import * as scoreModule from '../module/score';
import * as pipes from '../module/pipes';
import * as globals from '../module/globals';
import { Stopwatch } from '../module/stopwatch';
import { AppOptions, AppState, CardStyleOptions, Scoreboard } from '../models';
import { defineFieldSizes, generateCardsNames, defineCardsInfo, getImages  } from '../module/utility-functions';
import { SetupView } from '../module/components/setup-form/setup.view';
import { SetupController } from '../module/components/setup-form/setup.controller';
import { SetupViewModel } from '../module/components/setup-form/setup.view-model';
import { AppThemeService } from '../services/app-theme.service';
import { GameResultView } from '../module/components/game-result/game-result.view';
import { GamePausePopupDialogView } from '../module/components/game-pause-popup-dialog/game-pause-popup-dialog.view';


const appState = new AppState();
const appOptions = new AppOptions();
const cardStyleOptions = new CardStyleOptions();
const scoreboardPanel = new Scoreboard();

const gameResultView = new GameResultView(
    onRestartButtonFromResultPageClick,
    onRecordsButtonClick,
    onMenuButtonClick
);

gameResultView.render();

const setupController = new SetupController(
    new SetupViewModel(), 
    new SetupView(setupFormToGameProcessMediator.bind(this))
);
setupController.initialize();
const appThemeService = new AppThemeService(
    appOptions,
    cardStyleOptions,
    [
        'pause_button',
        'modal_resume_button',
        'modal_restart_button',
        'modal_options_button',
        'modal_menu_button',
        'modal_optionsApply_button',
        'restart_button',
        'records_button',
        'menu_button'
    ],
    [
        'modal_window_content'
    ],
    [
        'modal_icon',
        'record_return_icon'
    ]
);

let gamePausePopupDialogView = new GamePausePopupDialogView(cardStyleOptions, appThemeService, appOptions);

let recordsTableItems = [];
let [rows, columns] = [null, null];

let pairs_amount = 0,
attempts = 0;

 let images, cardsNames;

let cardsInfo = {},
currentCard = null;

let cardsLocked = true;
// gamePaused = false; 
// optionsPageOpened = false;

const stopwatch = new Stopwatch();
stopwatch.registerTimeListener((time) => {
    document.getElementById('stopwatch').innerHTML = `${time} сек`
});

defineButtonsClickEvents();
enableHotkeys();

function defineButtonsClickEvents() {

    const pauseButton = document.getElementById('pause_button');
    pauseButton.onclick = pauseGame;

    const tabLinksButtons = document.getElementsByClassName('tablinks');    
    for(let i = 0; i < tabLinksButtons.length; i++) {
        tabLinksButtons[i].onclick = () => openFieldRecords(tabLinksButtons[i].innerHTML, appOptions);
    }

    const recordsReturnButton = document.getElementById('record_return_icon');
    recordsReturnButton.onclick = () => {
        clearRecordsTable();
        scoreboardPanel.defaultRecordTableButtons();
        appState.goToTheFollowingState();
    }
}


function onRestartButtonFromResultPageClick() {    
    appState.currentState = appState.states.GAME_PROCESS;
    document.getElementById(appState.states.GAME_RESULT).style.display = globals.DOMElementStyle.display.NONE;
    document.getElementById(appState.states.GAME_PROCESS).style.display = globals.DOMElementStyle.display.BLOCK;
    restartGame();
}

function onRecordsButtonClick() {    
    appState.goToTheFollowingState();
    scoreboardPanel.initializeRecordTableButtons(appOptions);
    loadRecordsTable(JSON.parse(localStorage.getItem(appOptions.fieldSize)));
}

function onMenuButtonClick() {
    location.reload();
}

function enableHotkeys() {
    window.onkeydown = event => 
    {
        switch (event.key) {
            case globals.keys.ENTER:
                switch (appState.currentState) {
                    // case appState.states.GAME_SETUP:
                    //     setupView.startGame();
                    //     break;
                    case appState.states.GAME_RESULT:
                        location.reload();
                        break;
                }
                break;
            case globals.keys.ESCAPE:
                switch(appState.currentState) {
                    // case appState.states.GAME_PROCESS:
                    //     !gamePaused ? pauseGame() : optionsPageOpened ? returnToMainModalScreen() : resumeGame();
                    //     break;
                    case appState.states.GAME_RECORD:
                        clearRecordsTable();
                        appState.goToTheFollowingState();
                        break;
                }
        }
        
    }
}

// method-mediator 
function setupFormToGameProcessMediator() {

    appOptions.assignProperties(
        setupController.setupViewModel.username,
        setupController.setupViewModel.interfaceLanguage,
        setupController.setupViewModel.fieldSize,
        setupController.setupViewModel.theme,
    );

    appThemeService.applyAppTheme();
    appState.goToTheFollowingState();
    initializeBaseGameData();

    // TODO: get rid of these methods
    gamePausePopupDialogView.setCardsNames(cardsNames); 
    gamePausePopupDialogView.setRestartGameFunction(restartGame.bind(this));
    gamePausePopupDialogView.setResumeGameFunction(resumeGame.bind(this));
    gamePausePopupDialogView.render();

    buildGameField();
    startGame();
}


// GAME PROCESS COMPONENT (START)

function initializeBaseGameData() {
    [rows, columns] = defineFieldSizes(appOptions.fieldSize);
    pairs_amount = rows * columns / 2;
    images = getImages(pairs_amount);
    cardsNames = generateCardsNames(rows, columns);
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
            card.style.background = cardStyleOptions.cardDefaultBackground
            rowBlock.append(card);
        }
    }
}

function startGame() {
    cardsInfo = defineCardsInfo(
        pipes.arrRandomizerPipe.transform(cardsNames), 
        images
    );
    defineGameLogic();
    runGame();
}

function pauseGame() {
    if (!stopwatch.isLaunched())
        return;
    
    stopwatch.pause();
    // gamePaused = true;
    gamePausePopupDialogView.showModalWindow();
}

function resumeGame() {
    gamePausePopupDialogView.hideModalWindow();
    stopwatch.run();
    // gamePaused = false;
}

function restartGame() {
    gamePausePopupDialogView.hideModalWindow();
    clearGameParameters();
    startGame();
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
    gameProcessToGameResultMediator(displayInfo);
}

function defineGameLogic() {

    for (let i = 0; i < cardsNames.length; i++) {
        let element = document.getElementById(cardsNames[i]);
        element.onclick = function() {
            if (cardsLocked || cardsNames[i] == currentCard) {
                return;
            }
            attempts++;
            document.getElementById('attempts').innerHTML = attempts;

            let pairedCard = cardsInfo[cardsNames[i]].pair;
            let pairedElement = document.getElementById(pairedCard);
            if (cardsInfo[pairedCard].chosen) {
                element.style.visibility = globals.DOMElementStyle.visibility.HIDDEN;
                pairedElement.style.visibility = globals.DOMElementStyle.visibility.HIDDEN;

                cardsInfo[cardsNames[i]].visible = false;
                cardsInfo[pairedCard].visible = false;
                currentCard = null;

                let gameFinished = true;

                for (let i = 0; i < cardsNames.length; i++) {
                    if (cardsInfo[cardsNames[i]].visible) {
                        gameFinished = false;
                        break;
                    }
                }
                if (gameFinished) {
                    endGame();
                }
            } else {
                element.style.backgroundImage = cardsInfo[cardsNames[i]].chosenColor;
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
                    cardsInfo[cardsNames[i]].chosen = true;
                    currentCard = cardsNames[i];
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

function showCards() {
    for (let i = 0; i < cardsNames.length; i++) {
        let element = document.getElementById(cardsNames[i]);
        element.style.visibility = globals.DOMElementStyle.visibility.VISIBLE;
        element.style.backgroundImage = cardsInfo[cardsNames[i]].chosenColor;
        element.style.backgroundSize = cardStyleOptions.BACKGROUND_SIZE;
        element.style.backgroundPosition = cardStyleOptions.BACKGROUND_POSITION;
    }
}

function hideCards() {
    for (let i = 0; i < cardsNames.length; i++) {
        let element = document.getElementById(cardsNames[i]);
        element.style.background = cardStyleOptions.cardDefaultBackground;
    }
}

function clearGameParameters() {
    currentCard = null;
    cardsLocked = true;
    // gamePaused = false;
    stopwatch.reset();
    attempts = 0;
    document.getElementById('attempts').innerHTML = attempts;
}

// GAME PROCESS COMPONENT (END)


function gameProcessToGameResultMediator(displayInfo) {
    document.getElementById('game_result_label').innerText = displayInfo;
    appState.goToTheFollowingState();

}

// SCOREBOARD COMPONENT (START)

function openFieldRecords(size, appOptions) {

    scoreboardPanel.onRecordTabLinkClick(size, appOptions)
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
    createTableRecord(gameRecords.maxScore, 1, recordsTable, recordsTableItems);

    for (let i = 0; i < gameRecords.scores.length; i++) {
      createTableRecord(gameRecords.scores[i], i+2, recordsTable, recordsTableItems);
    }
}

function createTableRecord(record, index, recordsTable, recordsTableItems) {
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
// SCOREBOARD COMPONENT (END)
