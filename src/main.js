'use strict';
import './styles.css';
for (let i = 1; i <= globals.MAX_PAIRS_NUMBER; i++) {
    import ('./assets/images/' + i.toString() + '.jpg');
}

import * as globals from '../module/globals';
import { Stopwatch } from '../module/stopwatch';
import { AppOptions, AppState, CardStyleOptions } from '../models';
import { SetupView } from '../module/components/setup-form/setup.view';
import { SetupController } from '../module/components/setup-form/setup.controller';
import { AppThemeService } from '../services/app-theme.service';
import { GameResultView } from '../module/components/game-result/game-result.view';
import { GamePausePopupDialogView } from '../module/components/game-pause-popup-dialog/game-pause-popup-dialog.view';
import { GameProcessView } from '../module/components/game-process/game-process.view';
import { ScoreboardView } from '../module/components/scoreboard/scoreboard.view';
import { reloadApplication } from '../module/utility-functions';
import { HotkeyService } from '../services/hotkey/hotkey.service';
import { ScoreboardController } from '../module/components/scoreboard/scoreboard.controller';
import { SetupViewModel } from '../module/components/setup-form/setup.view-model';
import { GameResultController } from '../module/components/game-result/game-result.controller';
import { GameProcessController } from '../module/components/game-process/game-process.controller';
import { GamePausePopupDialogController } from '../module/components/game-pause-popup-dialog/game-pause-popup-dialog.controller';

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

const gameProcessController = new GameProcessController(
    new GameProcessView(
        appOptions,
        cardStyleOptions,
        gameProcessToGameResultMediator.bind(this),
    ),
    appState,
    cardStyleOptions,
    hotkeyService,
    stopwatch,
    new GamePausePopupDialogController(
        new GamePausePopupDialogView(
        appThemeService,
        appOptions,
        reloadApplication
        )
    ), 
);


 const gameResultController = new GameResultController(
    new GameResultView(
        gameResultToGameProcessMediator,
        gameResultToGameRecordMediator,
        reloadApplication
        ),
    appState,
    hotkeyService
 );
gameResultController.initialize();

const scoreboardController = new ScoreboardController(
    new ScoreboardView(),
    appState,
    appOptions,
    hotkeyService
);
scoreboardController.initialize();

function setupFormToGameProcessMediator() {

    appOptions.assignProperties(
        setupController.setupViewModel.username,
        setupController.setupViewModel.interfaceLanguage,
        setupController.setupViewModel.fieldSize,
        setupController.setupViewModel.theme,
    );

    appThemeService.applyAppTheme();
    appState.goToTheFollowingState();
    gameProcessController.initialize();
    gameProcessController.startGame();
}

function gameProcessToGameResultMediator(displayInfo) {
    document.getElementById('game_result_label').innerText = displayInfo;
    appState.goToTheFollowingState();
}

function gameResultToGameProcessMediator() {    
    appState.currentState = globals.appStates.GAME_PROCESS;
    document.getElementById(globals.appStates.GAME_RESULT).style.display = globals.DOMElementStyle.display.NONE;
    document.getElementById(globals.appStates.GAME_PROCESS).style.display = globals.DOMElementStyle.display.BLOCK;
    gameProcessController.restartGame();
}


function gameResultToGameRecordMediator() {    
    appState.goToTheFollowingState();
    scoreboardController.showScoreboard();
}

