import { Scoreboard } from "../../../models";
import { createTableRecord } from '../../dom-utility-functions';
import * as globals from '../../globals';

export class ScoreboardView {
    constructor(appState, appOptions, hotkeyService) {
        this.scoreboardPanel = new Scoreboard();
        this.recordsTableItems = [];
        this.appState = appState;
        this.appOptions = appOptions;
        this.NEXT_STATE_KEYDOWN_NAME = 'NEXT_STATE_KEYDOWN_NAME'; 
        hotkeyService.registerKeydown(
            this.NEXT_STATE_KEYDOWN_NAME,
            (key) => {
                return this.appState.currentState === this.appState.states.GAME_RECORD && key === globals.keys.ESCAPE
            },
            this.goToTheNextState.bind(this)
            );
    }

    onRender() {

        const tabLinksButtons = document.getElementsByClassName('tablinks');    
        for(let i = 0; i < tabLinksButtons.length; i++) {
            tabLinksButtons[i].onclick = () => this.openFieldRecords(tabLinksButtons[i].innerHTML, this.appOptions);
        }

        const recordsReturnButton = document.getElementById('record_return_icon');
        recordsReturnButton.onclick = this.goToTheNextState.bind(this);
    }

    goToTheNextState() {
        this.clearRecordsTable();
        this.scoreboardPanel.defaultRecordTableButtons();
        this.appState.goToTheFollowingState();
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