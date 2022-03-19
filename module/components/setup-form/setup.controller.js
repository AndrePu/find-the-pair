import * as globals from '../../globals';

export class SetupController {
    constructor(setupViewModel, setupView, hotkeyService, appStateMediatorService,
        appOptions, appThemeService, localizationService) {
        this.setupViewModel = setupViewModel;
        this.setupView = setupView;
        this.appStateMediatorService = appStateMediatorService;
        this.appOptions = appOptions;
        this.START_GAME_KEYDOWN = 'START_GAME_KEYDOWN';
        this.appThemeService = appThemeService;
        this.localizationService = localizationService;

        hotkeyService.registerKeydown(
            this.START_GAME_KEYDOWN,
            (key) => key === globals.keys.ENTER && this.appStateMediatorService.getCurrentState() === globals.appStates.GAME_SETUP,
            this.startGame.bind(this)
        );
    }

    initialize() {
        this.setupView.setupViewModel = this.setupViewModel;
        this.setupView.render(this.changeState.bind(this));
    }

    startGame() {
        this.setupView.startGame();
    }

    changeState() {
        this.appThemeService.applyAppTheme();
        this.localizationService.changeLanguage(this.appOptions.interfaceLanguage);

        this.appOptions.assignProperties(
            this.setupViewModel.username,
            this.setupViewModel.interfaceLanguage,
            this.setupViewModel.fieldSize,
            this.setupViewModel.theme,
        );       

        this.appStateMediatorService.changeState(globals.appStates.GAME_PROCESS);
    }
}