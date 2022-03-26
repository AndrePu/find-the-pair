export class BaseState {

    constructor(stateController) {
        this.stateController = stateController;
        this.isStateControllerInitialized = false;
        this.stateName = '';
    }

    initialize() {
        this.stateController.initialize();
    }

    changeState() {
        if (!this.isStateControllerInitialized) {
            this.initialize();
        }
        this.perform(); // should be overriden
    }
}