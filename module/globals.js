
export const MAX_PAIRS_NUMBER = 18;
export const MAX_TABLE_RECORDS_AMOUNT = 10;
export const SPACE = " ";

export const GAME_SETUP = 'game_setup';
export const GAME_PROCESS = 'game_process';
export const GAME_RESULT = 'game_result';
export const GAME_RECORD = 'game_record';

export const DOMElementStyle = {
    visibility: {
        VISIBLE: 'visible',
        HIDDEN: 'hidden'
    },
    display: {
        BLOCK: 'block',
        NONE: 'none',
        FLEX: 'flex'
    },
    overflow: {
        HIDDEN: 'hidden',
        AUTO: 'auto'
    }
};

export const keys = {
    ENTER: 'Enter',
    ESCAPE: 'Escape'
}

export const fieldSizes = {
    field3x4: '3x4',
    field4x4: '4x4',
    field5x4: '5x4',
    field6x6: '6x6'
}

export const appSetupOptionsErrors = {
    EMPTY_NAME_FIELD_ERROR: 'Укажите, пожалуйста, свое имя',
    UNCHECKED_LANGUAGE_ERROR: 'Выберите язык интерфейса для дальнейшей работы',
    UNCHECKED_FIELDSIZE_ERROR: 'Следует указать размерность поля, чтобы начать игру',
    UNCHECKED_THEME_ERROR: 'Выберите цветовое оформление, чтобы продолжить'
};

export const appTheme = {
    dark: {
        color: 'white',
        background: 'rgb(43, 43, 43)',
        cardDefaultBackground: 'rgb(116, 116, 116)',
        buttonClassName: 'dark-mode-button',
        modalWindowContentClassName: 'dark-mode-modal-content',
        iconClassName: 'dark-mode-icon',
        tablinkActiveClassName: 'active-dark-mode'
    },
    light: {
        color: 'black',
        background: 'mintcream',
        cardDefaultBackground: 'paleturquoise',
        buttonClassName: 'light-mode-button',
        modalWindowContentClassName: 'light-mode-modal-content',
        iconClassName: 'light-mode-icon',
        tablinkActiveClassName: 'active-light-mode'
    }
}

