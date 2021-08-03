
export class Hotkey {
    constructor(keydownEventName, statement, callbackFunction) {
        this.keydownEventName = keydownEventName;
        this.statement = statement;
        this.callbackFunction = callbackFunction;
    }
}
