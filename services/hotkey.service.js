import { Hotkey } from "../models";

export class HotkeyService {

    constructor() {
        this.hotkeys = [];
        window.onkeydown = event => this.onKeydownEvent(event.key);
    }
    
    registerKeydown(keydownEventName, statement, callbackFunction) {
        this.hotkeys.push(
            new Hotkey(keydownEventName, statement, callbackFunction)
        );
    }

    unregisterKeydown(keydownEventName) {
        this.hotkeys = this.hotkeys.filter(hotkey => hotkey.keydownEventName !== keydownEventName); 
    }

    onKeydownEvent(key) {
        for (const hotkey of this.hotkeys) {
            if (hotkey.statement(key)) {
                hotkey.callbackFunction();
            }
        }
    }
}
