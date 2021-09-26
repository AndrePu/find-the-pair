import gameResultHtmlTemplate from './game-result.html';
import { LanguageElement } from '../../../models/language-element.model';

export class GameResultView {
    constructor(appThemeService, localizationService) {
        this.gameResultContainer = document.querySelector('#game_result');
        this.appThemeService = appThemeService;
        this.localizationService = localizationService;
        this.ENTRY_NAME = 'GAME_RESULT';
    }

    render(onRestartButtonClick, onRecordsButtonClick, reloadApplication) {
        this.gameResultContainer.innerHTML = gameResultHtmlTemplate;

        const restartButton = document.getElementById('restart_button');
        restartButton.onclick = onRestartButtonClick;
            
        const recordsButton = document.getElementById('records_button');
        recordsButton.onclick = onRecordsButtonClick;

        const menuButton = document.getElementById('menu_button');
        menuButton.onclick = reloadApplication;

        this.appThemeService.registerButtons([
            'restart_button',
            'records_button',
            'menu_button'
        ]);

        this.localizationService.registerHtmlElements([
            new LanguageElement('restart_button', 'RESTART_BUTTON', this.ENTRY_NAME),
            new LanguageElement('records_button', 'RECORDS_BUTTON', this.ENTRY_NAME),
            new LanguageElement('menu_button', 'MENU_BUTTON', this.ENTRY_NAME),
            new LanguageElement('game_result_header', 'GAME_RESULT_HEADER', this.ENTRY_NAME),
            new LanguageElement('congratulations_label', 'CONGRATULATIONS_LABEL', this.ENTRY_NAME),
            new LanguageElement('current_score_label', 'CURRENT_SCORE_LABEL', this.ENTRY_NAME),
            new LanguageElement('got_record_label', 'GOT_RECORD_LABEL', this.ENTRY_NAME),
            new LanguageElement('max_score_label', 'MAX_SCORE_LABEL', this.ENTRY_NAME),
            new LanguageElement('old_max_score_label', 'OLD_MAX_SCORE_LABEL', this.ENTRY_NAME),
        ]);
        
    }
}