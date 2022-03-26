import * as globals from '../globals';

export class AppStateService {
    constructor(initialStateName) {
        this.currentStateName = initialStateName;
        this.states = {};
    }

    addState(state) {
        this.states[state.stateName] = state;
    }

    changeState(stateName) {
        this.goToTheState(stateName);
        this.states[stateName].changeState();
    }

    goToTheState(followingState) {
        document.getElementById(followingState).style.display = globals.DOMElementStyle.display.BLOCK;
        document.getElementById(this.currentStateName).style.display = globals.DOMElementStyle.display.NONE;
        this.currentStateName = followingState;
    }

    getCurrentStateName() {
        return this.currentStateName;
    }
}