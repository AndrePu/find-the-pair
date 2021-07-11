'use strict';
import './styles.css';
for (let i = 1; i <= globals.MAX_PAIRS_NUMBER; i++) {
    import ('./assets/images/' + i.toString() + '.jpg');
}

import * as globals from '../module/globals';
import { Stopwatch } from '../module/stopwatch';
import { AppOptions, AppState, CardStyleOptions, Scoreboard } from '../models';
import { SetupView } from '../module/components/setup-form/setup.view';
import { SetupController } from '../module/components/setup-form/setup.controller';
import { SetupViewModel } from '../module/components/setup-form/setup.view-model';
import { AppThemeService } from '../services/app-theme.service';
import { GameResultView } from '../module/components/game-result/game-result.view';
import { GamePausePopupDialogView } from '../module/components/game-pause-popup-dialog/game-pause-popup-dialog.view';
import { GameProcessView } from '../module/components/game-process/game-process.view';


const appState = new AppState();
const appOptions = new AppOptions();
const cardStyleOptions = new CardStyleOptions();
const scoreboardPanel = new Scoreboard();

const stopwatch = new Stopwatch();
stopwatch.registerTimeListener((time) => {
    document.getElementById('stopwatch').innerHTML = `${time} сек`
});

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

const gameResultView = new GameResultView(
    gameResultToGameProcessMediator,
    onRecordsButtonClick,
    onMenuButtonClick
);
gameResultView.render();

const setupController = new SetupController(
    new SetupViewModel(), 
    new SetupView(setupFormToGameProcessMediator.bind(this))
);
setupController.initialize();

let gamePausePopupDialogView = new GamePausePopupDialogView(
    cardStyleOptions,
    appThemeService,
    appOptions,
    onMenuButtonClick
);

const gameProcessView = new GameProcessView(
    appState,
    appOptions,
    cardStyleOptions,
    stopwatch,
    gamePausePopupDialogView, 
    gameProcessToGameResultMediator.bind(this)
);

let recordsTableItems = [];

defineButtonsClickEvents();
enableHotkeys();

function defineButtonsClickEvents() {

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

function setupFormToGameProcessMediator() {

    appOptions.assignProperties(
        setupController.setupViewModel.username,
        setupController.setupViewModel.interfaceLanguage,
        setupController.setupViewModel.fieldSize,
        setupController.setupViewModel.theme,
    );

    appThemeService.applyAppTheme();
    appState.goToTheFollowingState();
    gameProcessView.render();
    gameProcessView.startGame();
}

function gameProcessToGameResultMediator(displayInfo) {
    document.getElementById('game_result_label').innerText = displayInfo;
    appState.goToTheFollowingState();

}

function gameResultToGameProcessMediator() {    
    appState.currentState = appState.states.GAME_PROCESS;
    document.getElementById(appState.states.GAME_RESULT).style.display = globals.DOMElementStyle.display.NONE;
    document.getElementById(appState.states.GAME_PROCESS).style.display = globals.DOMElementStyle.display.BLOCK;
    gameProcessView.restartGame();
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
