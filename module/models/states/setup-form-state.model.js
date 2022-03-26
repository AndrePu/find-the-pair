import { BaseState } from './base-state.model';
import * as globals from '../../globals';

export class SetupFormState extends BaseState {
    constructor(stateController) {
        super(stateController);
        this.stateName = globals.appStates.SETUP_FORM;
    }
}