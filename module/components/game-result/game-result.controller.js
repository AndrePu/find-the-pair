import * as globals from '../../globals';

export class GameResultController {
    constructor(gameResultView, appState, hotkeyService) {
        this.gameResultView = gameResultView;
        
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
}