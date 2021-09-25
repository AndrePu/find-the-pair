import { englishVocabulary } from './vocabularies/en';
import { russianVocabulary } from './vocabularies/ru';
import { ukrainianVocabulary } from './vocabularies/ua';
import * as globals from '../../module/globals';

export class LocalizationService {
    constructor() {
        this.buttons = [];
        this.vocabularies = {
            [globals.languages.UA]: ukrainianVocabulary,
            [globals.languages.RU]: russianVocabulary,
            [globals.languages.EN]: englishVocabulary,
            [globals.languages.US]: englishVocabulary
        };
        this.currentLanguage = navigator.language.toLowerCase();
        if (!(Object.keys(this.vocabularies).some(key => key === this.currentLanguage))) {
            this.currentLanguage = globals.languages.EN;
        }
    }

    registerHtmlElement(elementName, elLangName, entryName) {
        const langElement = new LanguageElement(elementName, entryName, elLangName);
        this.defineElementLanguage(langElement);
        this.buttons.push(langElement);

    }

    changeLanguage(language) {
        this.currentLanguage = language;
        for (const btn of this.buttons) {
            this.defineElementLanguage(btn);
        }
    }

    defineElementLanguage(langElement) {
        document.getElementById(langElement.elementName).innerHTML = 
        this.vocabularies[this.currentLanguage][langElement.entryName][langElement.elLangName];
    }

    getLocalizedString(stringToLocalize, entryName) {
        return this.vocabularies[this.currentLanguage][entryName][stringToLocalize];
    }
}

class LanguageElement {
    constructor(elementName, entryName, elLangName) {
        this.elementName = elementName;
        this.entryName = entryName;
        this.elLangName = elLangName;
    }
}
