import { Scoreboard } from "../../../models";
import { createTableRecord } from '../../dom-utility-functions';

export class ScoreboardView {
    constructor(appState, appOptions) {
        this.scoreboardPanel = new Scoreboard();
        this.recordsTableItems = [];
        this.appState = appState;
        this.appOptions = appOptions;
    }

    onRender() {

        const tabLinksButtons = document.getElementsByClassName('tablinks');    
        for(let i = 0; i < tabLinksButtons.length; i++) {
            tabLinksButtons[i].onclick = () => this.openFieldRecords(tabLinksButtons[i].innerHTML, this.appOptions);
        }

        const recordsReturnButton = document.getElementById('record_return_icon');
        recordsReturnButton.onclick = () => {
            this.clearRecordsTable();
            this.scoreboardPanel.defaultRecordTableButtons();
            this.appState.goToTheFollowingState();
        }
    }

    
    openFieldRecords(size, appOptions) {
        this.scoreboardPanel.onRecordTabLinkClick(size, appOptions)
        const gameRecords = JSON.parse(localStorage.getItem(size));
        this.clearRecordsTable();
        this.loadRecordsTable(gameRecords);
    }

    clearRecordsTable() {
        for (let i = 0; i < this.recordsTableItems.length; i++) {
        document.getElementById(this.recordsTableItems[i]).remove();
        }
        this.recordsTableItems = [];
    }

    initializeRecordTableButtons() {
        this.scoreboardPanel.initializeRecordTableButtons(this.appOptions);
        this.loadRecordsTable(JSON.parse(localStorage.getItem(this.appOptions.fieldSize)));
    }

    loadRecordsTable(gameRecords) {
        if (!gameRecords) {
            return;
        }

        const recordsTable = document.getElementById('records-table');
        createTableRecord(gameRecords.maxScore, 1, recordsTable, this.recordsTableItems);

        for (let i = 0; i < gameRecords.scores.length; i++) {
            createTableRecord(gameRecords.scores[i], i+2, recordsTable, this.recordsTableItems);
        }
    }

} 