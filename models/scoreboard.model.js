import * as globals from '../module/globals';

export class Scoreboard {

    get defaultTablinkClassName() {
        return 'tablinks';
    }

    get tablinksActiveClassName() {
        return {
            dark: 'active-dark-mode',
            light: 'active-light-mode'
        };
    }
    
    onRecordTabLinkClick(size, appOptions) {
        const tabsElements = document.getElementsByClassName('tablinks');

        for (let i = 0; i < tabsElements.length; i++) {
            if (tabsElements[i].innerText === size) {
                tabsElements[i].className += globals.SPACE + this.tablinksActiveClassName[appOptions.theme];
            } else {
                tabsElements[i].className = this.defaultTablinkClassName;
            }
        }
    }

    initializeRecordTableButtons(appOptions) {
        const tabsElements = document.getElementsByClassName('tablinks');

        for (let i = 0; i < tabsElements.length; i++) {
            if (tabsElements[i].innerText === appOptions.fieldSize) {
                tabsElements[i].className += globals.SPACE + this.tablinksActiveClassName[appOptions.theme];
                break;
            } else  {
                tabsElements[i].className = this.defaultTablinkClassName;
            }
        }
    }

    defaultRecordTableButtons() {
        const tabsElements = document.getElementsByClassName('tablinks');

        for (let i = 0; i < tabsElements.length; i++) {
            tabsElements[i].className = this.defaultTablinkClassName;
        }
    }
}


