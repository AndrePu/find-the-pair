import { ValidatorService, EmptyInputValidation, UnselectedRadioButtonValidation } from '../../../services/validation';
import * as globals from '../../globals';

import { getIndexOfCheckedElement } from '../../dom-utility-functions';

export class SetupView {
    constructor(onCloseFunction, appState, hotkeyService) {
        this.setupPageContainer = document.querySelector('#game_setup');
        this.onCloseFunction = onCloseFunction;
        this.setupViewModel = null;
        this.START_GAME_KEYDOWN = 'START_GAME_KEYDOWN';
        this.appState = appState;
        hotkeyService.registerKeydown(
            this.START_GAME_KEYDOWN,
            (key) => {
                return key === globals.keys.ENTER && this.appState.currentState === this.appState.states.GAME_SETUP
            },
            this.startGame.bind(this) 
        );
    }

    render() {
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
    }

    startGame() {
        if (this.buttonDisabled) {
            return;
        } else {
            this.buttonDisabled = true;
        }
                
        const nameElement = document.getElementById('name');
        const langElements = document.getElementsByName('language');
        const fieldSizeElements = document.getElementsByName('field-size');
        const themeElements = document.getElementsByName('theme');
        const warningMessageElement = document.getElementById('error_label');

        
        const elementValidations = [
            new EmptyInputValidation(nameElement, globals.setupFormValidationErrors.EMPTY_NAME_FIELD_ERROR),
            new UnselectedRadioButtonValidation(langElements, globals.setupFormValidationErrors.UNCHECKED_LANGUAGE_ERROR),
            new UnselectedRadioButtonValidation(fieldSizeElements, globals.setupFormValidationErrors.UNCHECKED_FIELDSIZE_ERROR),
            new UnselectedRadioButtonValidation(themeElements, globals.setupFormValidationErrors.UNCHECKED_THEME_ERROR),
        ];

        const validatorService = new ValidatorService(elementValidations);
        
        if (validatorService.validate()) {
    
            const checkedLangElementIndex = getIndexOfCheckedElement(langElements);
            const checkedFieldSizeElementIndex = getIndexOfCheckedElement(fieldSizeElements);
            const checkedThemeElementIndex = getIndexOfCheckedElement(themeElements);
    
            this.setupViewModel.username = nameElement.value;
            this.setupViewModel.interfaceLanguage = langElements[checkedLangElementIndex].value;
            this.setupViewModel.fieldSize = fieldSizeElements[checkedFieldSizeElementIndex].value;
            this.setupViewModel.theme = themeElements[checkedThemeElementIndex].value;

            // this.removeEventListener();
            this.onCloseFunction();
        } else {
            warningMessageElement.innerText = validatorService.validationErrorMessage;
            warningMessageElement.style.visibility = globals.DOMElementStyle.visibility.VISIBLE;
            this.buttonDisabled = false;
        }
    }
}
