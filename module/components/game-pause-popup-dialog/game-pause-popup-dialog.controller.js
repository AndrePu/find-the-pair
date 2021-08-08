export class GamePausePopupDialogController {
    constructor(gamePausePopupDialogView) {
        this.gamePausePopupDialogView = gamePausePopupDialogView;
    }

    initialize(restartGameFunc, resumeGameFunc, applyThemeForCardsFunc) {
        this.gamePausePopupDialogView.render(restartGameFunc, resumeGameFunc, applyThemeForCardsFunc);
    }

    showModalWindow() {
        this.gamePausePopupDialogView.showModalWindow();
    }

    hideModalWindow() {
        this.gamePausePopupDialogView.hideModalWindow();
    }

    isOptionsPageOpened() {
        return this.gamePausePopupDialogView.isOptionsPageOpened;
    }

    returnToMainScreen() {
        this.gamePausePopupDialogView.returnToMainScreen();
    }
}