import * as globals from '../globals';

export class AppState {

    constructor() {        
        this.currentState = globals.appStates.GAME_SETUP;
    }

    goToTheState(followingState) {
        document.getElementById(followingState).style.display = globals.DOMElementStyle.display.BLOCK;
        document.getElementById(this.currentState).style.display = globals.DOMElementStyle.display.NONE;
        this.currentState = followingState;
    }
}