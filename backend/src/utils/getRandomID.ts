const getRandomValues = require('get-random-values');

export function getRandomID() { //Returns a bigint integer
        var array = new Uint8Array(8);
        getRandomValues(array);
        return BigInt(array.join('')).toString();
}