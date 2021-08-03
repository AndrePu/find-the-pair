import * as globals from '../../globals';

export class GameResultView {
    constructor(onRestartButtonClick, onRecordsButtonClick, onMenuButtonClick, appState, hotkeyService) {
        this.gameResultContainer = document.querySelector('#game_result');
        this.onRestartButtonClick = onRestartButtonClick;
        this.onRecordsButtonClick = onRecordsButtonClick;
        this.onMenuButtonClick = onMenuButtonClick;

        this.MENU_KEYDOWN = 'MENU_KEYDOWN';
        this.appState = appState;
        hotkeyService.registerKeydown(
            this.MENU_KEYDOWN,
            (key) => {
                return key === globals.keys.ENTER && this.appState.currentState === this.appState.states.GAME_RESULT; 
            },
            this.onMenuButtonClick
        );
    }

    render() {
        this.gameResultContainer.innerHTML = '<h1>Ваш результат</h1>' +
        '<p id="game_result_label">Вы набрали некое количество очков.</p>' +
        '<div class="button-container">' +
        '    <button id="restart_button">Перезапустить игру</button>' +
        '</div>' +
        '<div class="button-container">' +
        '    <button id="records_button">Таблица рекордов</button>' +
        '</div>' +
        '<div class="button-container">' +
        '    <button id="menu_button">К началу</button>' +
        '</div>';

        const restartButton = document.getElementById('restart_button');
        restartButton.onclick = this.onRestartButtonClick;
            
        const recordsButton = document.getElementById('records_button');
        recordsButton.onclick = this.onRecordsButtonClick;

        
        const menuButton = document.getElementById('menu_button');
        menuButton.onclick = this.onMenuButtonClick;
    }
}