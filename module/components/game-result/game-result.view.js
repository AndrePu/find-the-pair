import gameResultHtmlTemplate from './game-result.html';
import { LanguageElement } from '../../models/language-element.model';

export class GameResultView {
    constructor(appThemeService, localizationService) {
        this.gameResultContainer = document.querySelector('#game_result');
        this.appThemeService = appThemeService;
        this.localizationService = localizationService;
        this.ENTRY_NAME = 'GAME_RESULT';
    }

    render(onRestartButtonClick, onRecordsButtonClick, reloadApplication) {
        const restartButtonName = 'restart_button';
        const recordsButtonName = 'records_button';
        const menuButtonName = 'menu_button';

        this.gameResultContainer.innerHTML = gameResultHtmlTemplate;

        const restartButton = document.getElementById(restartButtonName);
        restartButton.onclick = onRestartButtonClick;
            
        const recordsButton = document.getElementById(recordsButtonName);
        recordsButton.onclick = onRecordsButtonClick;

        const menuButton = document.getElementById(menuButtonName);
        menuButton.onclick = reloadApplication;

        this.appThemeService.registerButtons([
            restartButtonName,
            recordsButtonName,
            menuButtonName
        ]);

        this.localizationService.registerHtmlElements([
            new LanguageElement(restartButtonName, 'RESTART_BUTTON', this.ENTRY_NAME),
            new LanguageElement(recordsButtonName, 'RECORDS_BUTTON', this.ENTRY_NAME),
            new LanguageElement(menuButtonName, 'MENU_BUTTON', this.ENTRY_NAME),
            new LanguageElement('game_result_header', 'GAME_RESULT_HEADER', this.ENTRY_NAME),
            new LanguageElement('congratulations_label', 'CONGRATULATIONS_LABEL', this.ENTRY_NAME),
            new LanguageElement('current_score_label', 'CURRENT_SCORE_LABEL', this.ENTRY_NAME),
            new LanguageElement('got_record_label', 'GOT_RECORD_LABEL', this.ENTRY_NAME),
            new LanguageElement('max_score_label', 'MAX_SCORE_LABEL', this.ENTRY_NAME),
            new LanguageElement('old_max_score_label', 'OLD_MAX_SCORE_LABEL', this.ENTRY_NAME),
        ]);
        
    }
}