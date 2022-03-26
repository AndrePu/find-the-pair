import * as globals from '../../globals';

export class ScoreboardController {
    constructor(scoreboardView, appOptions, hotkeyService, appStateService) {
        this.scoreboardView = scoreboardView;
        this.appOptions = appOptions;
        this.appStateService = appStateService;

        this.NEXT_STATE_KEYDOWN_NAME = 'NEXT_STATE_KEYDOWN_NAME'; 
        hotkeyService.registerKeydown(
            this.NEXT_STATE_KEYDOWN_NAME,
            (key) => {
                return this.appStateService.getCurrentStateName() === globals.appStates.GAME_RECORD && key === globals.keys.ESCAPE;
            },
            () => this.appStateService.changeState(globals.appStates.GAME_RESULT)
            );
    }

    initialize() {
        this.scoreboardView.onReturnButtonClick = () => this.appStateService.changeState(globals.appStates.GAME_RESULT);
        this.scoreboardView.onRender(this.appOptions);
    }

    showScoreboard() {
        this.scoreboardView.openScoreboardTab(this.appOptions.fieldSize, this.appOptions);
    }
}
