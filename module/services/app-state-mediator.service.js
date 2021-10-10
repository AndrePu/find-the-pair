import * as globals from '../globals';
import { reloadApplication } from '../utility-functions';

export class AppStateMediatorService {
    constructor(appState, appOptions, appThemeService, localizationService) {
        this.appState = appState;
        this.appOptions = appOptions;
        this.appThemeService = appThemeService;
        this.localizationService = localizationService;
    }

    set setupController(setupController) {
        this._setupController = setupController;
    }

    set gameProcessController(gameProcessController) {
        this._gameProcessController = gameProcessController;
    } 

    set gameResultController(gameResultController) {
        this._gameResultController = gameResultController;
    }

    set scoreboardController(scoreboardController) {
        this._scoreboardController = scoreboardController;
    }

    changeState(endState) {
        const currentState = this.getCurrentState();
        if (currentState === globals.appStates.GAME_SETUP && endState === globals.appStates.GAME_PROCESS) {
            this.setupFormToGameProcessMediator();
        } else if (currentState === globals.appStates.GAME_PROCESS && endState === globals.appStates.GAME_RESULT) {
            this.gameProcessToGameResultMediator();
        } else if (endState === globals.appStates.GAME_SETUP) {
            reloadApplication();
        } else if (currentState === globals.appStates.GAME_RESULT && endState === globals.appStates.GAME_PROCESS) {
            this.gameResultToGameProcessMediator();
        } else if (currentState == globals.appStates.GAME_RESULT && endState === globals.appStates.GAME_RECORD) {
            this.gameResultToGameRecordMediator();
        } else if (currentState === globals.appStates.GAME_RECORD && endState === globals.appStates.GAME_RESULT) {
            this.appState.goToTheFollowingState();
        }
    }
   
    setupFormToGameProcessMediator() {

        this.appOptions.assignProperties(
            this._setupController.setupViewModel.username,
            this._setupController.setupViewModel.interfaceLanguage,
            this._setupController.setupViewModel.fieldSize,
            this._setupController.setupViewModel.theme,
        );
    
        this.appThemeService.applyAppTheme();
        this.localizationService.changeLanguage(this.appOptions.interfaceLanguage);
        this.appState.goToTheFollowingState();
        this._gameProcessController.initialize();
        this._gameProcessController.startGame();
    }
    
    gameProcessToGameResultMediator() {
        if (!this.gameResultControllerInitialized) {
            this._gameResultController.initialize();
            this.gameResultControllerInitialized = true;
        }
        this._gameResultController.fillCurrentScoreInfo();
        this.appState.goToTheFollowingState();
    }
    
    gameResultToGameProcessMediator() {    
        this.appState.currentState = globals.appStates.GAME_PROCESS;
        document.getElementById(globals.appStates.GAME_RESULT).style.display = globals.DOMElementStyle.display.NONE;
        document.getElementById(globals.appStates.GAME_PROCESS).style.display = globals.DOMElementStyle.display.BLOCK;
        this._gameProcessController.restartGame();
    }
    
    gameResultToGameRecordMediator() {    
        if (!this.scoreboardControllerInitialized) {
            this._scoreboardController.initialize();
            this.scoreboardControllerInitialized = true;
        }
        this.appState.goToTheFollowingState();
        this._scoreboardController.showScoreboard();
    }

    getCurrentState() {
        return this.appState.currentState;
    }
}