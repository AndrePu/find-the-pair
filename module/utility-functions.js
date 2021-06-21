import * as globals from './globals';
import * as pipes from './pipes';
import { CardInfo } from '../models';


export function defineFieldSizes(fieldSize) {
    let field;
    switch (fieldSize) {
        case globals.fieldSizes.field3x4:
            field = [3, 4];
            break;
        case globals.fieldSizes.field4x4:
            field = [4, 4];
            break;
        case globals.fieldSizes.field5x4:
            field = [5, 4];
            break;
        case globals.fieldSizes.field6x6:
            field = [6, 6];
            break;
        default:
            throw Error("Field size defined in wrong way!");
    }
    return field;
}


export function generateCardsNames(rows, columns) {
    let cardsNames = [];

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= columns; j++) {
            cardsNames.push(`card${i}${j}`);
        }
    }
    return cardsNames;
}

export function defineCardsInfo(cardsNames, images) {
    let cardsInfo = {};
    for (let i = 0; i < cardsNames.length; i++) {
        cardsInfo[cardsNames[i]] = new CardInfo(
            true,
            false,
            pipes.imagePipe.transform(images[i % (cardsNames.length/2)]),
            cardsNames[(i + (cardsNames.length/2)) % cardsNames.length]
        );
    }
    return cardsInfo;
}

export function getImages(imagesAmount) {
    let images = [];
    for (let i = 1; i <= imagesAmount; i++) {
        images.push(`assets/images/${i}.jpg`);
    }
    return images;
}
