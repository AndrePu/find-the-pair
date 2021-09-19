const VALIDATION_ERROR = 'Validation Error';

export class ValidatorService {

    get lastValidationErrorMessage() {
        let message = VALIDATION_ERROR;
        if (this._lastFailedValidation) {
            message = this._lastFailedValidation.errorMessage;
        }
        return message;
    }

    validate(validations) {
        this._lastFailedValidation = this.getFailedValidation(validations);
        return !this._lastFailedValidation;
    }

    getFailedValidation(validations) {
        let failedValidation = null;
        for (const validation of validations) {
            if (!validation.isValid) {
                failedValidation = validation;
                break;
            }
        }
        return failedValidation;
    }
}