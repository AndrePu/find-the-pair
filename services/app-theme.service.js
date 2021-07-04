import * as globals from '../module/globals';


export class AppThemeService {
    constructor(appOptions, cardStyleOptions, buttonNames, modalWindowNames, iconNames) {
        this.appOptions = appOptions;
        this.cardStyleOptions = cardStyleOptions;
        this.buttonNames = buttonNames ? buttonNames : [];
        this.modalWindowNames = modalWindowNames ? modalWindowNames : [];
        this.iconNames = iconNames ? iconNames : [];
    }

    applyAppTheme() {
        document.body.style.color = globals.appTheme[this.appOptions.theme].color;
        document.body.style.background = globals.appTheme[this.appOptions.theme].background;
        this.cardStyleOptions.cardDefaultBackground = globals.appTheme[this.appOptions.theme].cardDefaultBackground;

        for (let buttonName of this.buttonNames) {
            document.getElementById(buttonName).className = globals.appTheme[this.appOptions.theme].buttonClassName;
        }

        for (let modalWindow of this.modalWindowNames) {
            document.getElementById(modalWindow).className = globals.appTheme[this.appOptions.theme].modalWindowContentClassName;
        }

        for (let icon of this.iconNames) {
            document.getElementById(icon).className = globals.appTheme[this.appOptions.theme].iconClassName;
        }
    }
}