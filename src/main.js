'use strict';
import './styles.css';

import { Stopwatch } from '../module/stopwatch';
import { AppOptions, AppState, CardStyleOptions } from '../models';
import { SetupView } from '../module/components/setup-form/setup.view';
import { SetupController } from '../module/components/setup-form/setup.controller';
import { AppThemeService } from '../services/app-theme.service';
import { GameResultView } from '../module/components/game-result/game-result.view';
import { GamePausePopupDialogView } from '../module/components/game-pause-popup-dialog/game-pause-popup-dialog.view';
import { GameProcessView } from '../module/components/game-process/game-process.view';
import { ScoreboardView } from '../module/components/scoreboard/scoreboard.view';
import { HotkeyService } from '../services/hotkey.service';
import { ScoreboardController } from '../module/components/scoreboard/scoreboard.controller';
import { SetupViewModel } from '../module/components/setup-form/setup.view-model';
import { GameResultController } from '../module/components/game-result/game-result.controller';
import { GameProcessController } from '../module/components/game-process/game-process.controller';
import { GamePausePopupDialogController } from '../module/components/game-pause-popup-dialog/game-pause-popup-dialog.controller';
import { ScoreService } from '../services/score.service';
import { AppStateMediatorService } from '../services/app-state-mediator.service';

const appState = new AppState();
const appOptions = new AppOptions();
const cardStyleOptions = new CardStyleOptions();
const hotkeyService = new HotkeyService();
const scoreService = new ScoreService();

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

const appStateMediatorService = new AppStateMediatorService(
    appState,
    appOptions,
    appThemeService
);

const setupController = new SetupController(
    new SetupViewModel(),
    new SetupView(),
    hotkeyService,
    appStateMediatorService
);
setupController.initialize();
appStateMediatorService.setupController = setupController;

const gameProcessController = new GameProcessController(
    new GameProcessView(
        appOptions,
        cardStyleOptions
    ),
    cardStyleOptions,
    hotkeyService,
    stopwatch,
    new GamePausePopupDialogController(
        new GamePausePopupDialogView(
        appThemeService,
        appOptions
        )
    ), 
    scoreService,
    appOptions,
    appStateMediatorService
);
appStateMediatorService.gameProcessController = gameProcessController;


 const gameResultController = new GameResultController(
    new GameResultView(),
    appOptions,
    hotkeyService,
    scoreService,
    appStateMediatorService
 );
gameResultController.initialize();
appStateMediatorService.gameResultController = gameResultController;

const scoreboardController = new ScoreboardController(
    new ScoreboardView(),
    appOptions,
    hotkeyService,
    appStateMediatorService
);
scoreboardController.initialize();
appStateMediatorService.scoreboardController = scoreboardController;
