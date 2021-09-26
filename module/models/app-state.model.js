import * as globals from '../globals';

export class AppState {

    constructor() {        
        this.currentState = globals.appStates.GAME_SETUP;
    
        this.followingState = {
            [globals.appStates.GAME_SETUP]: globals.appStates.GAME_PROCESS,
            [globals.appStates.GAME_PROCESS]: globals.appStates.GAME_RESULT,
            [globals.appStates.GAME_RESULT]: globals.appStates.GAME_RECORD,
            [globals.appStates.GAME_RECORD]: globals.appStates.GAME_RESULT
        };
    }

    goToTheFollowingState() {
        document.getElementById(this.followingState[this.currentState]).style.display = globals.DOMElementStyle.display.BLOCK;
        document.getElementById(this.currentState).style.display = globals.DOMElementStyle.display.NONE;
        this.currentState = this.followingState[this.currentState];
    }
}