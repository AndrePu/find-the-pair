import { getIndexOfCheckedElement } from '../../dom-utility-functions';
import * as globals from '../../globals';
import gamePausePopupDialogHtmlTemplate from './game-pause-popup-dialog.html';
import { LanguageElement } from '../../models/language-element.model';

export class GamePausePopupDialogView {
    constructor(appThemeService, appOptions, localizationService) {
        this.appThemeService = appThemeService;
        this.appOptions = appOptions;
        this.isOptionsPageOpened = false;
        this.localizationService = localizationService;
        this.ENTRY_NAME = 'GAME_PAUSE_POPUP_DIALOG';
    }

    render(restartGameFunc, resumeGameFunc, applyThemeForCardsFunc, reloadApplicationFunc) {
        
        const modalResumeButtonName = 'modal_resume_button';
        const modalRestartButtonName = 'modal_restart_button';
        const modalOptionsButtonName = 'modal_options_button';
        const modalMenuButtonName = 'modal_menu_button';
        const modalOptionsApplyButtonName = 'modal_optionsApply_button';
        const modalWindowName = 'modal_window';

        document.getElementById(modalWindowName).innerHTML = gamePausePopupDialogHtmlTemplate;    
        document.getElementById(modalRestartButtonName).onclick = restartGameFunc;
        document.getElementById(modalResumeButtonName).onclick = resumeGameFunc;
        document.getElementById(modalMenuButtonName).onclick = reloadApplicationFunc;
        document.getElementById(modalOptionsButtonName).onclick = this.openModalOptionsPage.bind(this);
        document.getElementById(modalOptionsApplyButtonName).onclick = this.applyOptionsFromModalWindow.bind(this);
        document.getElementById(modalWindowName).style.display = globals.DOMElementStyle.display.FLEX;

        this.appThemeService.registerButtons([
            modalResumeButtonName,
            modalRestartButtonName,
            modalOptionsButtonName,
            modalMenuButtonName,
            modalOptionsApplyButtonName,
        ]);

        this.localizationService.registerHtmlElements(
            [
                new LanguageElement(modalResumeButtonName, 'MODAL_RESUME_BUTTON', this.ENTRY_NAME),
                new LanguageElement(modalRestartButtonName, 'MODAL_RESTART_BUTTON', this.ENTRY_NAME),
                new LanguageElement(modalOptionsButtonName, 'MODAL_OPTIONS_BUTTON', this.ENTRY_NAME),
                new LanguageElement(modalMenuButtonName, 'MODAL_MENU_BUTTON', this.ENTRY_NAME),
                new LanguageElement(modalOptionsApplyButtonName, 'MODAL_OPTIONS_APPLY_BUTTON', this.ENTRY_NAME),
                new LanguageElement('modal_title', 'MODAL_TITLE', this.ENTRY_NAME),
                new LanguageElement('modal_language_input_header', 'MODAL_LANGUAGE_INPUT_HEADER',this.ENTRY_NAME),
                new LanguageElement('modal_theme_input_header', 'MODAL_THEME_INPUT_HEADER',this.ENTRY_NAME),
                new LanguageElement('modal_dark-theme_input_name', 'MODAL_DARK_THEME_INPUT_NAME',this.ENTRY_NAME),
                new LanguageElement('modal_light-theme_input_name', 'MODAL_LIGHT_THEME_INPUT_NAME',this.ENTRY_NAME)
            ]
        );



        this.appThemeService.registerModalWindows(['modal_window_content']);
        this.appThemeService.registerIcons(['modal_icon']);

        document.getElementById('modal_icon').onclick = 
            () => this.isOptionsPageOpened ? this.returnToMainScreen() : resumeGameFunc();

        this.applyThemeForCardsFunc = applyThemeForCardsFunc.bind(this);
    }

    openModalOptionsPage() {
        this.isOptionsPageOpened = true;
    
        document.getElementById('modal_buttons_container').style.display = globals.DOMElementStyle.display.NONE;
        document.getElementById('modal_options_page').style.display = globals.DOMElementStyle.display.BLOCK;
        document.getElementById('modal_title').innerText = 'Опции';
        
        const modalIcon = document.getElementById('modal_icon');
        modalIcon.title = 'Назад';
        modalIcon.innerText = '↩';
    
        const modalThemeElements = document.getElementsByName('modal_theme');
        modalThemeElements.forEach((themeElement) => {
            if (themeElement.value === this.appOptions.theme) {
                themeElement.checked = true;
            }
        });
    
        const modalLangElements = document.getElementsByName('modal_language');
        modalLangElements.forEach((langElement) => {
            if (langElement.value === this.appOptions.interfaceLanguage) {
                langElement.checked = true;
            }
        });
    }
    
    returnToMainScreen() {
        this.isOptionsPageOpened = false;
    
        document.getElementById('modal_buttons_container').style.display = globals.DOMElementStyle.display.BLOCK;
        document.getElementById('modal_options_page').style.display = globals.DOMElementStyle.display.NONE;
        
        const modalIcon = document.getElementById('modal_icon');
        modalIcon.title = 'Закрыть';
        modalIcon.innerText = '×';
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

    applyOptionsFromModalWindow() {
        this.changeThemeOptions();
        this.changeLanguage();
    }

    changeThemeOptions() {
        const modalThemeElements = document.getElementsByName('modal_theme');
        const checkedThemeElementIndex = getIndexOfCheckedElement(modalThemeElements);
        this.appOptions.theme = modalThemeElements[checkedThemeElementIndex].value;
        this.appThemeService.applyAppTheme();

        if (this.applyThemeForCardsFunc) {
            this.applyThemeForCardsFunc();
        }
    }

    changeLanguage() {
        const modalLangElements = document.getElementsByName('modal_language');
        const checkedLangElementIndex = getIndexOfCheckedElement(modalLangElements);
        this.appOptions.interfaceLanguage = modalLangElements[checkedLangElementIndex].value;
        this.localizationService.changeLanguage(this.appOptions.interfaceLanguage);
    }
}