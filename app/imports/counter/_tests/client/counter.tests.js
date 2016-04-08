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
            let counter = new Counter({ count: 5 });
            chai.assert.strictEqual(counter.count.get(), 5);
        });

    });

    describe('Counter.increment', () => {

        it('Increments Counter.count by 1 by default', () => {
            let counter = new Counter();
            counter.increment();
            chai.assert.strictEqual(counter.count.get(), 1);
        });

        it('Increments Counter.count with the supplied value', () => {
            let counter = new Counter();
            counter.increment({ amount: 7 });
            chai.assert.strictEqual(counter.count.get(), 7);
        });
    });

    describe('Counter.decrement', () => {

        it('Decrements Counter.count by 1 by default', () => {
            let counter = new Counter({ count: 5 });
            counter.decrement();
            chai.assert.strictEqual(counter.count.get(), 4);
        });

        it('Decrements Counter.count with the supplied value', () => {
            let counter = new Counter({ count: 5 });
            counter.decrement({ amount: 5 });
            chai.assert.strictEqual(counter.count.get(), 0);
        });

    });

});
