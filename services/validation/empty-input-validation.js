import { ElementValidation } from './element-validation';

export class EmptyInputValidation extends ElementValidation {
    constructor(element, errorMessage) {
        super(element, errorMessage);
    }

    get isValid() {
        return super.isValid && !!this.element.value;
    }
}