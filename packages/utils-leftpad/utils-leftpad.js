// Write your package code here!
'use strict';

leftPad = function(primitive, width=2, padder='0') {
    if (typeof primitive !== 'number' && typeof primitive !== 'string') {
        throw new TypeError(`Expected type "number" OR "string". Received ${typeof primitive}`);
    }

    if (Number.isNaN(primitive)) {
        throw new Error('Variable of type Number is NaN');
    }

    if (typeof padder !== 'string') {
        throw new TypeError(`The padder (char used for padding) should be string. Received ${typeof padder}`);
    }

    if (padder.length !== 1) {
        throw new Error('The padder (char used for padding) should be exactly 1-char long.');
    }

    let str = String(primitive);
    while (str.length < width) {
        str = padder + str;
    }

    return str;
};
