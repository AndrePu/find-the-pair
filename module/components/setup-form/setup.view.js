import { ValidatorService, EmptyInputValidation, UnselectedRadioButtonValidation } from '../../../services/validation';
import * as globals from '../../globals';
import { getIndexOfCheckedElement } from '../../dom-utility-functions';
import setupFormHtmlTemplate from './setup-form.html';
import { LanguageElement } from '../../../models/language-element.model';

export class SetupView {
    constructor(localizationService) {
        this.setupPageContainer = document.querySelector('#game_setup');
        this.setupViewModel = null;
        this.validatorService = new ValidatorService();
        this.localizationService = localizationService;
        this.ENTRY_NAME = 'GAME_SETUP';
    }

    render(callbackFunction) {
        this.callbackFunction = callbackFunction;
        this.setupPageContainer.innerHTML = setupFormHtmlTemplate;    
        
        const startButton = document.getElementById('start_button');
        startButton.onclick = this.startGame.bind(this);

        const warningMessageElement = document.getElementById('error_label');
        const nameElement = document.getElementById('name');
        const langElements = document.getElementsByName('language');
        const fieldSizeElements = document.getElementsByName('field-size');
        const themeElements = document.getElementsByName('theme');

        this.elementValidations = [
            new EmptyInputValidation(nameElement, globals.setupFormValidationErrors.EMPTY_NAME_FIELD_ERROR),
            new UnselectedRadioButtonValidation(langElements, globals.setupFormValidationErrors.UNCHECKED_LANGUAGE_ERROR),
            new UnselectedRadioButtonValidation(fieldSizeElements, globals.setupFormValidationErrors.UNCHECKED_FIELDSIZE_ERROR),
            new UnselectedRadioButtonValidation(themeElements, globals.setupFormValidationErrors.UNCHECKED_THEME_ERROR),
        ];
        this.domElements = new SetupDomElements(
            nameElement,
            warningMessageElement,
            langElements,
            fieldSizeElements,
            themeElements
        );

        this.localizationService.registerHtmlElements([
            new LanguageElement('start_button', 'START_BUTTON', this.ENTRY_NAME),
            new LanguageElement('game_name_header', 'GAME_NAME_HEADER', this.ENTRY_NAME),
            new LanguageElement('name_input_header', 'NAME_INPUT_HEADER', this.ENTRY_NAME),
            new LanguageElement('language_input_header', 'LANGUAGE_INPUT_HEADER', this.ENTRY_NAME),
            new LanguageElement('field-size_input_header','FIELD_SIZE_INPUT_HEADER', this.ENTRY_NAME),
            new LanguageElement('theme_input_header','THEME_INPUT_HEADER', this.ENTRY_NAME),
            new LanguageElement('dark-theme_input_name','DARK_THEME_INPUT_NAME', this.ENTRY_NAME),
            new LanguageElement('light-theme_input_name','LIGHT_THEME_INPUT_NAME', this.ENTRY_NAME)
        ]);
        
    }

    startGame() {
        if (this.isStartGameFuncDisabled) {
            return;
        } else {
            this.isStartGameFuncDisabled = true;
        }

        if (this.validatorService.validate(this.elementValidations)) {
    
            const checkedLangElementIndex = getIndexOfCheckedElement(this.domElements.langElements);
            const checkedFieldSizeElementIndex = getIndexOfCheckedElement(this.domElements.fieldSizeElements);
            const checkedThemeElementIndex = getIndexOfCheckedElement(this.domElements.themeElements);
    
            this.setupViewModel.username = this.domElements.nameElement.value;
            this.setupViewModel.interfaceLanguage = this.domElements.langElements[checkedLangElementIndex].value;
            this.setupViewModel.fieldSize = this.domElements.fieldSizeElements[checkedFieldSizeElementIndex].value;
            this.setupViewModel.theme = this.domElements.themeElements[checkedThemeElementIndex].value;

            this.callbackFunction();
        } else {
            this.domElements.warningMessageElement.innerText = this.localizationService.getLocalizedString(this.validatorService.lastValidationErrorMessage, this.ENTRY_NAME);
            this.domElements.warningMessageElement.style.visibility = globals.DOMElementStyle.visibility.VISIBLE;
            this.isStartGameFuncDisabled = false;
        }
    }
}

export class SetupDomElements {
    constructor(nameElement, warningMessageElement, langElements, fieldSizeElements, themeElements) {
        this.nameElement = nameElement;
        this.warningMessageElement = warningMessageElement;
        this.langElements = langElements;
        this.fieldSizeElements = fieldSizeElements;
        this.themeElements = themeElements;
    }
}
