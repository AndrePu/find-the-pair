import * as globals from '../../globals';

export class GameResultController {
    constructor(gameResultView, appOptions, hotkeyService, scoreService, appStateMediatorService) {
        this.gameResultView = gameResultView;
        this.appOptions = appOptions;
        this.scoreService = scoreService;
        this.appStateMediatorService = appStateMediatorService;
        
        this.MENU_KEYDOWN = 'MENU_KEYDOWN';
        hotkeyService.registerKeydown(
            this.MENU_KEYDOWN,
            (key) => {
                return key === globals.keys.ENTER && this.appStateMediatorService.getCurrentState() === globals.appStates.GAME_RESULT; 
            },
            this.gameResultView.reloadApplication
        );        
    }

    initialize() {
        this.gameResultView.render(
            () => this.appStateMediatorService.changeState(globals.appStates.GAME_PROCESS),
            () => this.appStateMediatorService.changeState(globals.appStates.GAME_RECORD),
            () => this.appStateMediatorService.changeState(globals.appStates.GAME_SETUP),
        );
    }

    fillCurrentScoreInfo() {
        let displayInfo = this.scoreService.getScoreInfoToDisplay(this.appOptions.fieldSize);
        document.getElementById('game_result_label').innerText = displayInfo;
    }
}