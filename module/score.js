import { MAX_PAIRS_NUMBER } from './globals';

const END_SCORE = 10000;
const MAX_EXTRA_SCORE = 100000;

export function getScoreInfoToDisplay(gotRecord, score, maxScore, oldScore) {
    const displayInfo = `Поздравляем. Вы победили!\n` + 
    `Ваш счет: ${score} очков\n` +
     (gotRecord ? 'О, дааа. Да вы еще побили старый рекорд!\n' : '') +
    `Максимальный счет: ${maxScore} очков\n` + 
    (gotRecord ? `Старый максимальный счет: ${oldScore}` : '');
    return displayInfo;
};

export function calculateScore(attempts, time, pairs_amount) {
    const minimumAttemptsAmount = pairs_amount*2;
    const extraScore = MAX_EXTRA_SCORE*(pairs_amount*pairs_amount/(MAX_PAIRS_NUMBER*MAX_PAIRS_NUMBER)) - 5*time - 10*(attempts - minimumAttemptsAmount);
    return Math.round(END_SCORE + (extraScore > 0 ? extraScore : 0));
}
