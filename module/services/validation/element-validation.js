export class ElementValidation {

    constructor(element, errorMessage) {
        this.element = element;
        this._errorMessage = errorMessage;
    }

    get isValid() {
        return !!this.element;
    }

    get errorMessage() {
        return this._errorMessage;
    }
}