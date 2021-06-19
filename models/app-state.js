import * as globals from '../module/globals';

export class AppState {

    constructor() {
        this.states =  {
            GAME_SETUP: globals.GAME_SETUP,
            GAME_PROCESS: globals.GAME_PROCESS,
            GAME_RESULT: globals.GAME_RESULT,
            GAME_RECORD: globals.GAME_RECORD
        };    
        
        this.currentState = globals.GAME_SETUP;
    
        this.followingState = {
            [globals.GAME_SETUP]: globals.GAME_PROCESS,
            [globals.GAME_PROCESS]: globals.GAME_RESULT,
            [globals.GAME_RESULT]: globals.GAME_RECORD,
            [globals.GAME_RECORD]: globals.GAME_RESULT
        };
    }

    goToTheFollowingState() {
        document.getElementById(this.followingState[this.currentState]).style.display = globals.DOMElementStyle.display.BLOCK;
        document.getElementById(this.currentState).style.display = globals.DOMElementStyle.display.NONE;
        this.currentState = this.followingState[this.currentState];
    }
}