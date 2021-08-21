import * as globals from '../../globals';

export class ScoreboardController {
    constructor(scoreboardView, appOptions, hotkeyService, appStateMediatorService) {
        this.scoreboardView = scoreboardView;
        this.appOptions = appOptions;
        this.appStateMediatorService = appStateMediatorService;

        this.NEXT_STATE_KEYDOWN_NAME = 'NEXT_STATE_KEYDOWN_NAME'; 
        hotkeyService.registerKeydown(
            this.NEXT_STATE_KEYDOWN_NAME,
            (key) => {
                return this.appStateMediatorService.getCurrentState() === globals.appStates.GAME_RECORD && key === globals.keys.ESCAPE
            },
            () => this.appStateMediatorService.changeState(globals.appStates.GAME_RESULT)
            );
    }

    initialize() {
        this.scoreboardView.onReturnButtonClick = () => this.appStateMediatorService.changeState(globals.appStates.GAME_RESULT);
        this.scoreboardView.onRender(this.appOptions);
    }

    showScoreboard() {
        this.scoreboardView.openScoreboardTab(this.appOptions.fieldSize, this.appOptions);
    }
}
