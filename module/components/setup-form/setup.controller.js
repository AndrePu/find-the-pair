import * as globals from '../../globals';

export class SetupController {
    constructor(setupViewModel, setupView, appState, hotkeyService) {
        this.setupViewModel = setupViewModel;
        this.setupView = setupView;
        
        this.START_GAME_KEYDOWN = 'START_GAME_KEYDOWN';

        hotkeyService.registerKeydown(
            this.START_GAME_KEYDOWN,
            (key) => {
                return key === globals.keys.ENTER && appState.currentState === appState.states.GAME_SETUP
            },
            this.startGame.bind(this) 
        );
    }

    initialize() {
        this.setupView.setupViewModel = this.setupViewModel;
        this.setupView.render();
    }

    startGame() {
        this.setupView.startGame();
    }
}