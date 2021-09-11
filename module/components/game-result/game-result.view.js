import gameResultHtmlTemplate from './game-result.html';

export class GameResultView {
    constructor() {
        this.gameResultContainer = document.querySelector('#game_result');
    }

    render(onRestartButtonClick, onRecordsButtonClick, reloadApplication) {
        this.gameResultContainer.innerHTML = gameResultHtmlTemplate;

        const restartButton = document.getElementById('restart_button');
        restartButton.onclick = onRestartButtonClick;
            
        const recordsButton = document.getElementById('records_button');
        recordsButton.onclick = onRecordsButtonClick;

        
        const menuButton = document.getElementById('menu_button');
        menuButton.onclick = reloadApplication;
    }
}