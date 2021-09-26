import { ElementValidation } from './element-validation';
import { getIndexOfCheckedElement } from '../../dom-utility-functions';

export class UnselectedRadioButtonValidation extends ElementValidation {
    constructor(element, errorMessage) {
        super(element, errorMessage);
    }

    get isValid() {
        return super.isValid && getIndexOfCheckedElement(this.element) !== -1;
    }
}