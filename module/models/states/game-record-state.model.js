import { BaseState } from './base-state.model';
import * as globals from '../../globals';

export class GameRecordState extends BaseState {
    constructor(stateController) {
        super(stateController);
        this.stateName = globals.appStates.GAME_RECORD;
    }

    perform() {
        this.stateController.showScoreboard();
    }
}