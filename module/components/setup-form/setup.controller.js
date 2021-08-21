import * as globals from '../../globals';

export class SetupController {
    constructor(setupViewModel, setupView, hotkeyService, appStateMediatorService) {
        this.setupViewModel = setupViewModel;
        this.setupView = setupView;
        this.appStateMediatorService = appStateMediatorService;
        
        this.START_GAME_KEYDOWN = 'START_GAME_KEYDOWN';

        hotkeyService.registerKeydown(
            this.START_GAME_KEYDOWN,
            (key) => {
                return key === globals.keys.ENTER && this.appStateMediatorService.getCurrentState() === globals.appStates.GAME_SETUP
            },
            this.startGame.bind(this) 
        );
    }

    initialize() {
        this.setupView.setupViewModel = this.setupViewModel;
        this.setupView.render(
            () => this.appStateMediatorService.changeState(globals.appStates.GAME_PROCESS)
        );
    }

    startGame() {
        this.setupView.startGame();
    }
}