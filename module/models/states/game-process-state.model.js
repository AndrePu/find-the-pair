import { BaseState } from './base-state.model';
import * as globals from '../../globals';

export class GameProcessState extends BaseState {
    constructor(stateController) {
        super(stateController);
        this.isGameStarted = false;
        this.stateName = globals.appStates.GAME_PROCESS;
    }

    perform() {
        if (!this.isGameStarted) {
            this.stateController.startGame();
        } else {
            this.stateController.restartGame();
        }
    }
}