import { ValidatorService, EmptyInputValidation, UnselectedRadioButtonValidation } from '../../../services/validation';
import * as globals from '../../globals';
import { getIndexOfCheckedElement } from '../../dom-utility-functions';

export class SetupView {
    constructor() {
        this.setupPageContainer = document.querySelector('#game_setup');
        this.setupViewModel = null;
        this.validatorService = new ValidatorService();
    }

    render(callbackFunction) {
        this.callbackFunction = callbackFunction;
        this.setupPageContainer.innerHTML = '<div class="game-setup">' + 
'        <h1>Игра "Найди пару"</h1>' +
'        <div class="setup-block">' +
'            <p><b>Введите ваше имя:</b></p>' +
'            <p>' +
'                <input id="name" placeholder="Введите тут свое имя">' +
'            </p>' +
'        </div>' +

'        <div class="setup-block">' +
'            <p><b>Выберите язык интерфейса:</b></p>' +
'            <p>' +
'                <input name="language" type="radio" value="Russian"/>Русский' +
'            </p>' +
'            <p>' +
'                <input name="language" type="radio" value="Ukrainian">Українська' +
'            </p>' +
'            <p>' +
'                <input name="language" type="radio" value="English">English' +
'            </p>' +
'        </div>' +

'        <div class="setup-block">' +
'            <p><b>Выберите размерность поля:</b></p>' +
'            <p>' +
'                <input name="field-size" type="radio" value="3x4">3x4' +
'            </p>' +
'            <p>' +
'                <input name="field-size" type="radio" value="4x4">4x4' +
'            </p>' +
'            <p>' +
'                <input name="field-size" type="radio" value="5x4">5x4' +
'            </p>' +
'            <p>' +
'                <input name="field-size" type="radio" value="6x6">6x6' +
'            </p>' +
'        </div>' +

'        <div class="setup-block">' +
'            <p><b>Выберите тему оформления</b></p>' +
'            <p>' +
'                <input name="theme" type="radio" value="dark">Темная' +
'            </p>' +
'            <p>' +
'                <input name="theme" type="radio" value="light">Светлая' +
'            </p>' +
'        </div>' +

'        <p id="error_label" class="error-label">Ошибка</p>' +

'        <button id="start_button" class="dark-mode-button">Начать игру</button>' +
'    </div>      ';        
        
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
            this.domElements.warningMessageElement.innerText = this.validatorService.lastValidationErrorMessage;
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
