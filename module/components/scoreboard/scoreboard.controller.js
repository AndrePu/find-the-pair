import * as globals from '../../globals';

export class ScoreboardController {
    constructor(scoreboardView, appState, appOptions, hotkeyService) {
        this.scoreboardView = scoreboardView;        
        this.appState = appState;
        this.appOptions = appOptions;
        
        this.NEXT_STATE_KEYDOWN_NAME = 'NEXT_STATE_KEYDOWN_NAME'; 
        hotkeyService.registerKeydown(
            this.NEXT_STATE_KEYDOWN_NAME,
            (key) => {
                return this.appState.currentState === globals.appStates.GAME_RECORD && key === globals.keys.ESCAPE
            },
            () => this.appState.goToTheFollowingState()
            );
    }

    initialize() {
        this.scoreboardView.onReturnButtonClick = () => this.appState.goToTheFollowingState();
        this.scoreboardView.onRender(this.appOptions);
    }

    showScoreboard() {
        this.scoreboardView.openScoreboardTab(this.appOptions.fieldSize, this.appOptions);
    }
}
