import { createTableRow } from '../../dom-utility-functions';
import * as globals from '../../globals';

export class ScoreboardView {
    constructor() {
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
        const tabLinksButtons = document.getElementsByClassName('tablinks');    
        for(let i = 0; i < tabLinksButtons.length; i++) {
            const tabName = tabLinksButtons[i].innerHTML;
            tabLinksButtons[i].onclick = () => this.openScoreboardTab(tabName, appOptions);
        }

        const recordsReturnButton = document.getElementById('record_return_icon');
        recordsReturnButton.onclick = this.onReturnButtonClick.bind(this);
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
