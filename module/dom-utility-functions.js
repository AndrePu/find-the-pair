
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


export function createTableRecord(record, index, recordsTable, recordsTableItems) {
    let domRecord = document.createElement('tr');
    domRecord.id = `${record.name}${index}`;
    domRecord.innerHTML = 
    `<td>${index}</td>` +
    `<td>${record.name}</td>` +
    `<td>${record.attempts}</td>` +
    `<td>${record.time} сек</td>` + 
    `<td>${record.score}</td>`;

    recordsTable.append(domRecord);
    recordsTableItems.push(domRecord.id);
}
