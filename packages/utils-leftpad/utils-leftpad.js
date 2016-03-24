// Write your package code here!
'use strict';

leftPad = function(primitive, width=2, padder='0') {
    if (typeof primitive !== 'number' && typeof primitive !== 'string') {
        throw new TypeError(`Expected type "number" OR "string". Received ${typeof primitive}`);
    }

    if (Number.isNaN(primitive)) {
        throw new TypeError('Variable of type Number is NaN');
    }

    let str = String(primitive);
    while (str.length < width) {
        str = padder + str;
    }

    return str;
}
