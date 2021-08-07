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
import { AppThemeService } from '../services/app-theme.service';
import { GameResultView } from '../module/components/game-result/game-result.view';
import { GamePausePopupDialogView } from '../module/components/game-pause-popup-dialog/game-pause-popup-dialog.view';
import { GameProcessView } from '../module/components/game-process/game-process.view';
import { ScoreboardView } from '../module/components/scoreboard/scoreboard.view';
import { onMenuButtonClick } from '../module/utility-functions';
import { HotkeyService } from '../services/hotkey/hotkey.service';
import { ScoreboardController } from '../module/components/scoreboard/scoreboard.controller';
import { SetupViewModel } from '../module/components/setup-form/setup.view-model';

const appState = new AppState();
const appOptions = new AppOptions();
const cardStyleOptions = new CardStyleOptions();
const hotkeyService = new HotkeyService();

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

const setupController = new SetupController(
    new SetupViewModel(),
    new SetupView(setupFormToGameProcessMediator.bind(this)),
    appState,
    hotkeyService
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
    gameProcessToGameResultMediator.bind(this),
    hotkeyService
);

const gameResultView = new GameResultView(
    gameResultToGameProcessMediator,
    gameResultToGameRecordMediator,
    onMenuButtonClick,
    appState,
    hotkeyService
);
gameResultView.render();

const scoreboardController = new ScoreboardController(
    new ScoreboardView(),
    appState,
    appOptions,
    hotkeyService
);
scoreboardController.initialize();

function setupFormToGameProcessMediator() {

    appOptions.assignProperties(
        setupController.setupView.setupViewModel.username,
        setupController.setupView.setupViewModel.interfaceLanguage,
        setupController.setupView.setupViewModel.fieldSize,
        setupController.setupView.setupViewModel.theme,
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


function gameResultToGameRecordMediator() {    
    appState.goToTheFollowingState();
    scoreboardController.showScoreboard();
}

