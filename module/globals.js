
export const MAX_PAIRS_NUMBER = 18;
export const END_SCORE = 10000;
export const MAX_EXTRA_SCORE = 100000;
export const MAX_TABLE_RECORDS_AMOUNT = 10;
export const SPACE = ' ';
export const CURRENT_SCORE = 'CURRENT_SCORE';
export const GOT_RECORD = 'GOT_RECORD';

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
    },
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
};

export const keys = {
    ENTER: 'Enter',
    ESCAPE: 'Escape'
};

export const fieldSizes = {
    field3x4: '3x4',
    field4x4: '4x4',
    field5x4: '5x4',
    field6x6: '6x6'
};

export const setupFormValidationErrors = {
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
};

export const appStates = {    
    GAME_SETUP: 'game_setup',
    GAME_PROCESS: 'game_process',
    GAME_RESULT: 'game_result',
    GAME_RECORD: 'game_record'
};
