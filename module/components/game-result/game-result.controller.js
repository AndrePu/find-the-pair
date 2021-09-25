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
        document.getElementById('current_score_value').innerHTML = this.scoreService.getCurrentScore();
        document.getElementById('max_score_value_label').innerHTML = this.scoreService.getMaxScore(this.appOptions.fieldSize);

        if (this.scoreService.isCurrentScoreNewRecord()) {
            document.getElementById('old_max_score_paragraph').style.display = globals.DOMElementStyle.display.BLOCK;
            document.getElementById('old_max_score_value_label').innerHTML = this.scoreService.getOldMaxScore(this.appOptions.fieldSize);
            document.getElementById('got_record_label').style.display = globals.DOMElementStyle.display.BLOCK;
        } else {
            document.getElementById('got_record_label').style.display = globals.DOMElementStyle.display.NONE;
            document.getElementById('old_max_score_paragraph').style.display = globals.DOMElementStyle.display.NONE;
        }
    }
}