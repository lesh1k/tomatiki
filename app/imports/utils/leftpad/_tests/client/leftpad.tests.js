/* eslint-env mocha */

import { chai } from 'meteor/practicalmeteor:chai';

import { leftPad } from '../../leftpad.js';


describe('leftPad', () => {
    describe('leftPad', () => {
        it('Pads values correctly', () => {
            chai.assert.strictEqual(leftPad(''), '00');
            chai.assert.strictEqual(leftPad(1), '01');
            chai.assert.strictEqual(leftPad('1'), '01');
            chai.assert.strictEqual(leftPad(11), '11');
            chai.assert.strictEqual(leftPad(11, 10), '0000000011');
            chai.assert.strictEqual(leftPad(1, 3, 'A'), 'AA1');
            chai.assert.strictEqual(leftPad(11, 10, 'A'), 'AAAAAAAA11');
            chai.assert.strictEqual(leftPad(123456789, 10, 'A'), 'A123456789');
            chai.assert.strictEqual(leftPad(1234567890, 10, 'A'), '1234567890');
        });
    });

    describe('leftPad/validate', () => {
        it('Throws an error for any type of value except "number" OR "string"', () => {
            let sample_space = [[], {}, Symbol(), void 0, null];
            for (let value of sample_space) {
                chai.assert.throws(leftPad.bind(null, value), TypeError);
            }
        });

        it('Throws an error if value is NaN', () => {
            chai.assert.throws(leftPad.bind(null, NaN), Error);
        });

        it('Throws an error for any type of padder except "string"', () => {
            let sample_space = [[], {}, Symbol(), null];
            for (let value of sample_space) {
                chai.assert.throws(leftPad.bind(null, 1, 1, value), TypeError);
            }
        });

        it('Padder length must be 1', () => {
            chai.assert.throws(leftPad.bind(null, 1, 1, ''), Error);
            chai.assert.throws(leftPad.bind(null, 1, 1, '2345'), Error);
        });
    });
});
