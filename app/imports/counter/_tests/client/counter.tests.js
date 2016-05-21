/* eslint-env mocha */

import { chai } from 'meteor/practicalmeteor:chai';

import { Counter } from '../../Counter.js';


describe('Counter', () => {

    describe('Counter.constructor', () => {

        it('Creates a Counter instance', () => {
            let counter = new Counter();
            chai.assert.instanceOf(counter, Counter);
        });

        it('Sets Counter.count to 0, by default', () => {
            let counter = new Counter();
            chai.assert.strictEqual(counter.count.get(), 0);
        });

        it('Sets Counter.count to the supplied value', () => {
            let counter = new Counter(5);
            chai.assert.strictEqual(counter.count.get(), 5);
        });

    });

    describe('Counter.inc', () => {

        it('Increments Counter.count by 1 by default', () => {
            let counter = new Counter();
            counter.inc();
            chai.assert.strictEqual(counter.count.get(), 1);
        });

        it('Increments Counter.count with the supplied value', () => {
            let counter = new Counter();
            counter.inc(7);
            chai.assert.strictEqual(counter.count.get(), 7);
        });
    });

    describe('Counter.dec', () => {

        it('Decrements Counter.count by 1 by default', () => {
            let counter = new Counter(5);
            counter.dec();
            chai.assert.strictEqual(counter.count.get(), 4);
        });

        it('Decrements Counter.count with the supplied value', () => {
            let counter = new Counter(5);
            counter.dec(5);
            chai.assert.strictEqual(counter.count.get(), 0);
        });

    });

});
