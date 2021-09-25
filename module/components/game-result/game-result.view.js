import gameResultHtmlTemplate from './game-result.html';

export class GameResultView {
    constructor(appThemeService, localizationService) {
        this.gameResultContainer = document.querySelector('#game_result');
        this.appThemeService = appThemeService;
        this.localizationService = localizationService;
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

        this.localizationService.registerHtmlElement('restart_button', 'RESTART_BUTTON', 'GAME_RESULT');
        this.localizationService.registerHtmlElement('records_button', 'RECORDS_BUTTON', 'GAME_RESULT');
        this.localizationService.registerHtmlElement('menu_button', 'MENU_BUTTON', 'GAME_RESULT');
        this.localizationService.registerHtmlElement('game_result_header', 'GAME_RESULT_HEADER', 'GAME_RESULT');
        this.localizationService.registerHtmlElement('congratulations_label', 'CONGRATULATIONS_LABEL', 'GAME_RESULT');
        this.localizationService.registerHtmlElement('current_score_label', 'CURRENT_SCORE_LABEL', 'GAME_RESULT');
        this.localizationService.registerHtmlElement('got_record_label', 'GOT_RECORD_LABEL', 'GAME_RESULT');
        this.localizationService.registerHtmlElement('max_score_label', 'MAX_SCORE_LABEL', 'GAME_RESULT');
        this.localizationService.registerHtmlElement('old_max_score_label', 'OLD_MAX_SCORE_LABEL', 'GAME_RESULT');
    }
}