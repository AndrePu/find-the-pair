import * as globals from './globals';


export function getIndexOfCheckedElement(DOMElements) {
    let res = -1;
    for (let i = 0; i < DOMElements.length; i++) {
        if (DOMElements[i].checked) {
            res = i;
            break;
        }
    }
    return res;
}


export function createTableRow(id, innerHtml, table) {
    let row = document.createElement('tr');
    row.id = id;
    row.innerHTML = innerHtml;
    table.append(row);
}

export function setImage(htmlElement, backgroundImage) {
    htmlElement.style.backgroundImage = backgroundImage;
    htmlElement.style.backgroundSize = globals.DOMElementStyle.backgroundSize;
    htmlElement.style.backgroundPosition = globals.DOMElementStyle.backgroundPosition;
}
