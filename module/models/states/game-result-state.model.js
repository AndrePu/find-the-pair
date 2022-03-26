import { BaseState } from './base-state.model';
import * as globals from '../../globals';

export class GameResultState extends BaseState {
    constructor(stateController) {
        super(stateController);
        this.stateName = globals.appStates.GAME_RESULT;
    }

    perform() {
        this.stateController.fillCurrentScoreInfo();
    }
}