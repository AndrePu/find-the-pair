export class GameResultView {
    constructor() {
        this.gameResultContainer = document.querySelector('#game_result');
    }

    render(onRestartButtonClick, onRecordsButtonClick, reloadApplication) {
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
        restartButton.onclick = onRestartButtonClick;
            
        const recordsButton = document.getElementById('records_button');
        recordsButton.onclick = onRecordsButtonClick;

        
        const menuButton = document.getElementById('menu_button');
        menuButton.onclick = reloadApplication;
    }
}