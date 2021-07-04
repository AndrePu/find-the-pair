
export class SetupController {
    constructor(setupViewModel, setupView) {
        this.setupViewModel = setupViewModel;
        this.setupView = setupView;
    }

    initialize() {
        this.setupView.setupViewModel = this.setupViewModel;
        this.setupView.render();
    }
}