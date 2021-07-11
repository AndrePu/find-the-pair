import { getIndexOfCheckedElement } from "../../dom-utility-functions";
import * as globals from '../../globals';

export class GamePausePopupDialogView {
    constructor(cardStyleOptions, appThemeService, appOptions) {
        this.cardStyleOptions = cardStyleOptions;
        this.appThemeService = appThemeService;
        this.appOptions = appOptions;
        this.optionsPageOpened = false;
        this.onRestartBtnClick = null;
    }

    render() {        
        const modalRestartButton = document.getElementById('modal_restart_button');
        modalRestartButton.onclick = this.restartGame;

        const modalResumeButton = document.getElementById('modal_resume_button');
        modalResumeButton.onclick = this.resumeGame;

        const modalIcon = document.getElementById('modal_icon');
        modalIcon.onclick = () => this.optionsPageOpened ? this.returnToMainModalScreen() : this.restartGame();

        const modalMenuButton = document.getElementById('modal_menu_button');
        modalMenuButton.onclick = () => location.reload();

        const modalOptionsButton = document.getElementById('modal_options_button');
        modalOptionsButton.onclick = this.openModalOptionsPage.bind(this);

        const modalOptionsApplyButton = document.getElementById('modal_optionsApply_button');
        modalOptionsApplyButton.onclick = this.applyOptionsFromModalWindow.bind(this);
    }

    setCardsNames(cardsNames) {
        this.cardsNames = cardsNames;
    }
    
    setRestartGameFunction(restartGame) {
        this.restartGame = restartGame;
    }

    setResumeGameFunction(resumeGame) {
        this.resumeGame = resumeGame;
    }

    showModalWindow() {
        document.body.style.overflow = globals.DOMElementStyle.overflow.HIDDEN;
        const modalWindow = document.getElementById('modal_window');
        modalWindow.style.pointerEvents = 'auto';
        modalWindow.style.opacity = 1;
    }

    hideModalWindow() {
        document.body.style.overflow = globals.DOMElementStyle.overflow.AUTO;
        const modalWindow = document.getElementById('modal_window');
        modalWindow.style.pointerEvents = 'none';
        modalWindow.style.opacity = 0;
    }

    changeThemeForCards(cardsNames, cardStyleOptions) {
        for (let i = 0; i < cardsNames.length; i++) {
            const cardElement = document.getElementById(cardsNames[i]);
            if (cardElement) {
                cardElement.style.background = cardStyleOptions.cardDefaultBackground;
            }
        }
    }
    
    returnToMainModalScreen() {
        const modalIcon = document.getElementById('modal_icon');
        modalIcon.title = 'Закрыть';
        modalIcon.innerText = '×';
    
        const modalTitle = document.getElementById('modal_title');
        modalTitle.innerText = 'Опции';
        this.optionsPageOpened = false;
    
        const modalOptionsPage = document.getElementById('modal_options_page');
        modalOptionsPage.style.display = globals.DOMElementStyle.display.NONE;
    
        const modalButtonsContainer = document.getElementById('modal_buttons_container');
        modalButtonsContainer.style.display = globals.DOMElementStyle.display.BLOCK;
    }

    applyOptionsFromModalWindow() {
        const modalThemeElements = document.getElementsByName('modal_theme');
        const checkedThemeElementIndex = getIndexOfCheckedElement(modalThemeElements);
        this.appOptions.theme = modalThemeElements[checkedThemeElementIndex].value;
        this.appThemeService.applyAppTheme();
        this.changeThemeForCards(this.cardsNames, this.cardStyleOptions);
    }

    openModalOptionsPage() {
        this.optionsPageOpened = true;
    
        const modalButtonsContainer = document.getElementById('modal_buttons_container');
        modalButtonsContainer.style.display = globals.DOMElementStyle.display.NONE;
    
        const modalOptionsPage = document.getElementById('modal_options_page');
        modalOptionsPage.style.display = globals.DOMElementStyle.display.BLOCK;
        
        const modalIcon = document.getElementById('modal_icon');
        modalIcon.title = 'Назад';
        modalIcon.innerText = '↩';
    
        const modalTitle = document.getElementById('modal_title');
        modalTitle.innerText = 'Опции';
    
        const modalThemeElements = document.getElementsByName('modal_theme');
        modalThemeElements.forEach((themeElement) => {
            if (themeElement.value === this.appOptions.theme) {
                themeElement.checked = true;
            }
        })
    
        const modalLangElements = document.getElementsByName('modal_language');
        modalLangElements.forEach((langElement) => {
            if (langElement.value === this.appOptions.interfaceLanguage) {
                langElement.checked = true;
            }
        })
    }
}