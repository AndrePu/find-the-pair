import { englishVocabulary, russianVocabulary, ukrainianVocabulary } from './index';
import * as globals from '../../globals';

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

    registerHtmlElements(langElements) {
        for (const langElement of langElements) {
            this.defineElementLanguage(langElement);
            this.buttons.push(langElement);
        }
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
