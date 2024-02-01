const getRandomValues = require('get-random-values');

export function getRandomID() { //Returns a bigint integer as string
        var array = new Uint8Array(6);
        getRandomValues(array);
        return array.join('');
}