'use strict';

import './styles.css';
import './manifest.json';

for (let i = 1; i <= globals.MAX_PAIRS_NUMBER; i++) {
    import('./assets/images/' + i.toString() + '.jpg');
}

import './assets/icons/manifest-icon-192.maskable.png';
import './assets/icons/manifest-icon-512.maskable.png';
import './assets/icons/manifest-icon-512.png';

import * as globals from '../module/globals';
import { Stopwatch } from '../module/models/stopwatch.model';
import { AppOptions, CardStyleOptions, SetupFormState, GameProcessState, GameResultState, GameRecordState } from '../module/models';
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
import { AppStateService } from '../module/services/app-state.service';
import { LocalizationService } from '../module/services/i18n';

const appOptions = new AppOptions();
const cardStyleOptions = new CardStyleOptions();
const hotkeyService = new HotkeyService();
const scoreService = new ScoreService();
const localizationService = new LocalizationService();

const stopwatch = new Stopwatch();
stopwatch.registerTimeListener((time) => document.getElementById('stopwatch').innerHTML = `${time} сек`);

const appThemeService = new AppThemeService(
    appOptions,
    cardStyleOptions
);

const appStateService = new AppStateService(globals.appStates.GAME_SETUP);

const setupController = new SetupController(
    new SetupViewModel(),
    new SetupView(localizationService),
    hotkeyService,
    appStateService,
    appOptions,
    appThemeService,
    localizationService
);
appStateService.addState(new SetupFormState(setupController));

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
    appStateService
);
appStateService.addState(new GameProcessState(gameProcessController));

const gameResultController = new GameResultController(
    new GameResultView(appThemeService, localizationService),
    appOptions,
    hotkeyService,
    scoreService,
    appStateService
);
appStateService.addState(new GameResultState(gameResultController));

const scoreboardController = new ScoreboardController(
    new ScoreboardView(appThemeService, localizationService),
    appOptions,
    hotkeyService,
    appStateService
);
appStateService.addState(new GameRecordState(scoreboardController));

setupController.initialize();

// Initialize deferredPrompt for use later to show browser install prompt.

window.addEventListener('beforeinstallprompt', (event) => {
    console.log('👍', 'beforeinstallprompt', event);
    // Stash the event so it can be triggered later.
    window.deferredPrompt = event;
});

window.addEventListener('appinstalled', (event) => {
    console.log('👍', 'appinstalled', event);
    // Clear the deferredPrompt so it can be garbage collected
    window.deferredPrompt = null;
});
