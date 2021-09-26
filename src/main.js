'use strict';
import './styles.css';

for (let i = 1; i <= globals.MAX_PAIRS_NUMBER; i++) {
    import ('./assets/images/' + i.toString() + '.jpg');
}

import * as globals from '../module/globals';
import { Stopwatch } from '../module/models/stopwatch.model';
import { AppOptions, AppState, CardStyleOptions } from '../module/models';
import { SetupView } from '../module/components/setup-form/setup.view';
import { SetupController } from '../module/components/setup-form/setup.controller';
import { AppThemeService } from '../module/services/app-theme.service';
import { GameResultView } from '../module/components/game-result/game-result.view';
import { GamePausePopupDialogView } from '../module/components/game-pause-popup-dialog/game-pause-popup-dialog.view';
import { GameProcessView } from '../module/components/game-process/game-process.view';
import { ScoreboardView } from '../module/components/scoreboard/scoreboard.view';
import { HotkeyService } from '../module/services/hotkey.service';
import { ScoreboardController } from '../module/components/scoreboard/scoreboard.controller';
import { SetupViewModel } from '../module/components/setup-form/setup.view-model';
import { GameResultController } from '../module/components/game-result/game-result.controller';
import { GameProcessController } from '../module/components/game-process/game-process.controller';
import { GamePausePopupDialogController } from '../module/components/game-pause-popup-dialog/game-pause-popup-dialog.controller';
import { ScoreService } from '../module/services/score.service';
import { AppStateMediatorService } from '../module/services/app-state-mediator.service';
import { LocalizationService } from '../module/services/i18n';

const appState = new AppState();
const appOptions = new AppOptions();
const cardStyleOptions = new CardStyleOptions();
const hotkeyService = new HotkeyService();
const scoreService = new ScoreService();
const localizationService = new LocalizationService();

const stopwatch = new Stopwatch();
stopwatch.registerTimeListener((time) =>  document.getElementById('stopwatch').innerHTML = `${time} сек`);

const appThemeService = new AppThemeService(
    appOptions,
    cardStyleOptions
);

const appStateMediatorService = new AppStateMediatorService(
    appState,
    appOptions,
    appThemeService,
    localizationService
);

const setupController = new SetupController(
    new SetupViewModel(),
    new SetupView(localizationService),
    hotkeyService,
    appStateMediatorService
);
appStateMediatorService.setupController = setupController;

const gameProcessController = new GameProcessController(
    new GameProcessView(
        appOptions,
        cardStyleOptions,
        appThemeService,
        localizationService
    ),
    cardStyleOptions,
    hotkeyService,
    stopwatch,
    new GamePausePopupDialogController(
        new GamePausePopupDialogView(
        appThemeService,
        appOptions,
        localizationService
        )
    ), 
    scoreService,
    appOptions,
    appStateMediatorService
);
appStateMediatorService.gameProcessController = gameProcessController;


 const gameResultController = new GameResultController(
    new GameResultView(appThemeService, localizationService),
    appOptions,
    hotkeyService,
    scoreService,
    appStateMediatorService
 );
appStateMediatorService.gameResultController = gameResultController;

const scoreboardController = new ScoreboardController(
    new ScoreboardView(appThemeService, localizationService),
    appOptions,
    hotkeyService,
    appStateMediatorService
);
appStateMediatorService.scoreboardController = scoreboardController;

setupController.initialize();
