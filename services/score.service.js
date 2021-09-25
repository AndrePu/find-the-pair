import * as globals from '../module/globals';

export class ScoreService {

    getRecordsForFieldSize(fieldSize) {
        return JSON.parse(localStorage.getItem(fieldSize));
    }

    isCurrentScoreNewRecord() {
        return JSON.parse(localStorage.getItem(globals.GOT_RECORD));
    }

    getCurrentScore() {
        return JSON.parse(localStorage.getItem(globals.CURRENT_SCORE));
    }

    getScoreInfoToDisplay(fieldSize) {
        const gotRecord = this.isCurrentScoreNewRecord();
        const currentScore = this.getCurrentScore();

        const fieldRecords = this.getRecordsForFieldSize(fieldSize);
        const maxScore = fieldRecords.maxScore.score;
        const oldMaxScore = fieldRecords.scores.length > 1 ? fieldRecords.scores[1].score : 0;

        const displayInfo = 'Поздравляем. Вы победили!\n' + 
        `Ваш счет: ${currentScore} очков\n` +
        (gotRecord ? 'О, дааа. Да вы еще побили старый рекорд!\n' : '') +
        `Максимальный счет: ${maxScore} очков\n` + 
        (gotRecord ? `Старый максимальный счет: ${oldMaxScore}` : '');

        return displayInfo;
    }

    getMaxScore(fieldSize) {
        const fieldRecords = this.getRecordsForFieldSize(fieldSize);
        return fieldRecords.maxScore.score;
    }

    getOldMaxScore(fieldSize) {
        const fieldRecords = this.getRecordsForFieldSize(fieldSize);
        return fieldRecords.scores.length > 1 ? fieldRecords.scores[1].score : 0;
    }

    calculateScore(attempts, time, pairs_amount) {
        const minimumAttemptsAmount = pairs_amount*2;
        const extraScore = globals.MAX_EXTRA_SCORE*(pairs_amount*pairs_amount/(globals.MAX_PAIRS_NUMBER*globals.MAX_PAIRS_NUMBER)) - 5*time - 10*(attempts - minimumAttemptsAmount);
        return Math.round(globals.END_SCORE + (extraScore > 0 ? extraScore : 0));
    }

    addNewScore(newScoreRecord, fieldSize) {
        let gotRecord = false;
        let fieldRecords = this.getRecordsForFieldSize(fieldSize);

        if (!fieldRecords) {
            fieldRecords = {
                maxScore: {},
                scores: []
            };
            fieldRecords.maxScore = newScoreRecord;
            fieldRecords.scores = [newScoreRecord];
            gotRecord = true;
        }
        else if (Number(fieldRecords.maxScore.score) < newScoreRecord.score) {
            gotRecord = true;
            fieldRecords.scores = [newScoreRecord].concat(fieldRecords.scores);
            fieldRecords.maxScore = newScoreRecord;
        } else {
            fieldRecords.scores.push(newScoreRecord);
            fieldRecords.scores.sort((score1, score2) => score2.score - score1.score);
        }

        if (fieldRecords.scores.length === globals.MAX_TABLE_RECORDS_AMOUNT) {
            fieldRecords.scores.pop();
        }
        
        localStorage.setItem(fieldSize, JSON.stringify(fieldRecords));
        localStorage.setItem(globals.CURRENT_SCORE, newScoreRecord.score);
        localStorage.setItem(globals.GOT_RECORD, gotRecord);
    }
}