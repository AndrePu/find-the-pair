const VALIDATION_ERROR = "Validation Error";

export class ValidatorService {
    constructor(validations) {
        
        this.validations = validations;
    }


    get validationErrorMessage() {
        let message = VALIDATION_ERROR;
        if (this._failedValidation) {
            message = this._failedValidation.errorMessage;
        }
        return message;
    }

    validate() {
        this._failedValidation = this.getFailedValidation();
        return !this._failedValidation;
    }

    getFailedValidation() {
        let failedValidation = null;
        for (const validation of this.validations) {
            if (!validation.isValid) {
                failedValidation = validation;
                break;
            }
        }
        return failedValidation;
    }
}