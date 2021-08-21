export class GamePausePopupDialogController {
    constructor(gamePausePopupDialogView) {
        this.gamePausePopupDialogView = gamePausePopupDialogView;
    }

    initialize(restartGameFunc, resumeGameFunc, applyThemeForCardsFunc, reloadApplicationFunc) {
        this.gamePausePopupDialogView.render(restartGameFunc, resumeGameFunc, applyThemeForCardsFunc, reloadApplicationFunc);
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