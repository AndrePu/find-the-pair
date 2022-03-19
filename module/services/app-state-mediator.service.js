import * as globals from '../globals';
import { reloadApplication } from '../utility-functions';

export class AppStateMediatorService {
    constructor(appState) {
        this.appState = appState;
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
            this.appState.goToTheState(globals.appStates.GAME_RESULT);
        }
    }
   
    setupFormToGameProcessMediator() {       
        this.appState.goToTheState(globals.appStates.GAME_PROCESS);
        this._gameProcessController.initialize();
        this._gameProcessController.startGame();
    }
    
    gameProcessToGameResultMediator() {
        this.appState.goToTheState(globals.appStates.GAME_RESULT);
        if (!this.gameResultControllerInitialized) {
            this._gameResultController.initialize();
            this.gameResultControllerInitialized = true;
        }
        this._gameResultController.fillCurrentScoreInfo();
    }
    
    gameResultToGameProcessMediator() {    
        this.appState.goToTheState(globals.appStates.GAME_PROCESS);
        this._gameProcessController.restartGame();
    }
    
    gameResultToGameRecordMediator() {    
        this.appState.goToTheState(globals.appStates.GAME_RECORD);
        if (!this.scoreboardControllerInitialized) {
            this._scoreboardController.initialize();
            this.scoreboardControllerInitialized = true;
        }
        this._scoreboardController.showScoreboard();
    }

    getCurrentState() {
        return this.appState.currentState;
    }
}