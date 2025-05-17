import { randomInt } from 'crypto';

const generateUniqueId = (length, allowedChars) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomPosition = randomInt(0, allowedChars.length);
        result += allowedChars[randomPosition];
    }
    return result;
};

export const generateUniqueIdSlug = (length = 6) => {
    return generateUniqueId(length, 'abcdefghjkmnpqrstuvwxyz0123456789');
};

export const generateUniqueIdOrder = (length = 6) => {
    return generateUniqueId(length, 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789');
};
