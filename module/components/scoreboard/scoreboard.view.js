import { createTableRow } from '../../dom-utility-functions';
import * as globals from '../../globals';
import scoreboardHtmlTemplate from './scoreboard.html';

export class ScoreboardView {
    constructor(appThemeService, localizationService) {
        this.appThemeService = appThemeService;
        this.localizationService = localizationService;
        this.recordsTableItems = [];
        this.onReturnButtonClick = null;
    }

    get defaultTablinkClassName() {
        return 'tablinks';
    }

    get tablinksActiveClassName() {
        return {
            dark: 'active-dark-mode',
            light: 'active-light-mode'
        };
    }

    onRender(appOptions) {
        document.getElementById('game_record').innerHTML = scoreboardHtmlTemplate;
        const tabLinksButtons = document.getElementsByClassName('tablinks');    
        for(let i = 0; i < tabLinksButtons.length; i++) {
            const tabName = tabLinksButtons[i].innerHTML;
            tabLinksButtons[i].onclick = () => this.openScoreboardTab(tabName, appOptions);
        }

        this.localizationService.registerHtmlElement('record_table_header', 'RECORD_TABLE_HEADER', 'GAME_RECORD');
        this.localizationService.registerHtmlElement('name_column_header', 'NAME_COLUMN_HEADER', 'GAME_RECORD');
        this.localizationService.registerHtmlElement('attempts_column_header', 'ATTEMPTS_COLUMN_HEADER', 'GAME_RECORD');
        this.localizationService.registerHtmlElement('time_column_header', 'TIME_COLUMN_HEADER', 'GAME_RECORD');
        this.localizationService.registerHtmlElement('score_column_header', 'SCORE_COLUMN_HEADER', 'GAME_RECORD');

        const recordsReturnButton = document.getElementById('record_return_icon');
        recordsReturnButton.onclick = this.onReturnButtonClick.bind(this);
        this.appThemeService.registerIcons(['record_return_icon']);
    }
   
    openScoreboardTab(tabName, appOptions) {
        this.setStylesForTabs(tabName, appOptions);
        this.clearTableData();
        this.loadDataForTab(JSON.parse(localStorage.getItem(tabName)));
    }

    clearTableData() {
        for (let i = 0; i < this.recordsTableItems.length; i++) {
            document.getElementById(this.recordsTableItems[i]).remove();
        }
        this.recordsTableItems = [];
    }

    setStylesForTabs(openedTabName, appOptions) {
        const tabsElements = document.getElementsByClassName('tablinks');

        for (let i = 0; i < tabsElements.length; i++) {
            if (tabsElements[i].innerText === openedTabName) {
                tabsElements[i].className = this.defaultTablinkClassName + globals.SPACE + this.tablinksActiveClassName[appOptions.theme];
            } else {
                tabsElements[i].className = this.defaultTablinkClassName;
            }
        }
    }

    loadDataForTab(gameRecords) {
        if (!gameRecords) {
            return;
        }

        let position = 1;
        const recordsTable = document.getElementById('records-table');
        this.createRecord(gameRecords.maxScore, position++, recordsTable);

        for (let i = 0; i < gameRecords.scores.length; i++) {
            this.createRecord(gameRecords.scores[i], position++, recordsTable);
        }
    }

    createRecord(score, position, table) {

        const id = `${score.name}${position}`;
        const innerHtml = 
        `<td>${position}</td>` +
        `<td>${score.name}</td>` +
        `<td>${score.attempts}</td>` +
        `<td>${score.time} сек</td>` + 
        `<td>${score.score}</td>`;

        createTableRow(id, innerHtml, table);
        this.recordsTableItems.push(id);
    }
}
