// Write your package code here!
'use strict';

leftPad = function(primitive, width=2, padder='0') {
    if (typeof primitive !== 'number' && typeof primitive !== 'string') {
        throw TypeError(`Expected type "number" OR "string". Received ${typeof primitive}`);
    }

    let str = String(primitive);
    while (str.length < width) {
        str = padder + str;
    }

    return str;
}
