import * as globals from '../../globals';

export class GameResultController {
    constructor(gameResultView, appOptions, hotkeyService, scoreService, appStateService) {
        this.gameResultView = gameResultView;
        this.appOptions = appOptions;
        this.scoreService = scoreService;
        this.appStateService = appStateService;
        
        this.MENU_KEYDOWN = 'MENU_KEYDOWN';
        hotkeyService.registerKeydown(
            this.MENU_KEYDOWN,
            (key) => {
                return key === globals.keys.ENTER && this.appStateService.getCurrentStateName() === globals.appStates.GAME_RESULT; 
            },
            this.gameResultView.reloadApplication
        );        
    }

    initialize() {
        this.gameResultView.render(
            () => this.appStateService.changeState(globals.appStates.GAME_PROCESS),
            () => this.appStateService.changeState(globals.appStates.GAME_RECORD),
            () => this.appStateService.changeState(globals.appStates.GAME_SETUP),
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