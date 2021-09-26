export class AppOptions {
    constructor() {
        this.username = null;
        this.interfaceLanguage = null;
        this.fieldSize = null;
        this.theme = null;
    }

    assignProperties(username, interfaceLanguage, fieldSize, theme) {
        this.username = username;
        this.interfaceLanguage = interfaceLanguage;
        this.fieldSize = fieldSize;
        this.theme = theme;
    }
}
