import { BaseState } from './base-state.model';
import * as globals from '../../globals';

export class GameProcessState extends BaseState {
    constructor(stateController) {
        super(stateController);
        this.stateName = globals.appStates.GAME_PROCESS;
    }

    perform() {
        this.stateController.startGame();
    }
}