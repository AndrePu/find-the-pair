import * as globals from '../globals';


export class AppThemeService {
    constructor(appOptions, cardStyleOptions) {
        this.appOptions = appOptions;
        this.cardStyleOptions = cardStyleOptions;
        this.buttonNames = [];
        this.modalWindowNames = [];
        this.iconNames = [];
    }

    applyAppTheme() {
        document.body.style.color = globals.appTheme[this.appOptions.theme].color;
        document.body.style.background = globals.appTheme[this.appOptions.theme].background;
        this.cardStyleOptions.cardDefaultBackground = globals.appTheme[this.appOptions.theme].cardDefaultBackground;

        this.applyThemeForButtons(this.buttonNames);
        this.applyThemeForModals(this.modalWindowNames);
        this.applyThemeForIcons(this.iconNames);
    }

    registerButtons(buttonNames) {
        this.applyThemeForButtons(buttonNames);
        this.buttonNames = this.buttonNames.concat(buttonNames);
    }

    registerModalWindows(modalWindowNames) {
        this.applyThemeForModals(modalWindowNames);
        this.modalWindowNames = this.modalWindowNames.concat(modalWindowNames);
    }

    registerIcons(iconNames) {
        this.applyThemeForIcons(iconNames);
        this.iconNames = this.iconNames.concat(iconNames);
    }

    applyThemeForButtons(buttonNames) {
        for (let buttonName of buttonNames) {
            document.getElementById(buttonName).className = globals.appTheme[this.appOptions.theme].buttonClassName;
        }
    }

    applyThemeForModals(modalWindowNames) {
        for (let modalWindow of modalWindowNames) {
            document.getElementById(modalWindow).className = globals.appTheme[this.appOptions.theme].modalWindowContentClassName;
        }
    }

    applyThemeForIcons(iconNames) {
        for (let icon of iconNames) {
            document.getElementById(icon).className = globals.appTheme[this.appOptions.theme].iconClassName;
        }
    }
}