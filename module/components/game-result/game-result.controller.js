import * as globals from '../../globals';

export class GameResultController {
    constructor(gameResultView, appState, appOptions, hotkeyService, scoreService) {
        this.gameResultView = gameResultView;
        this.appOptions = appOptions;
        this.scoreService = scoreService;
        
        this.MENU_KEYDOWN = 'MENU_KEYDOWN';
        hotkeyService.registerKeydown(
            this.MENU_KEYDOWN,
            (key) => {
                return key === globals.keys.ENTER && appState.currentState === globals.appStates.GAME_RESULT; 
            },
            this.gameResultView.reloadApplication
        );        
    }

    initialize() {
        this.gameResultView.render();
    }

    fillCurrentScoreInfo() {
        let displayInfo = this.scoreService.getScoreInfoToDisplay(this.appOptions.fieldSize);
        document.getElementById('game_result_label').innerText = displayInfo;
    }
}