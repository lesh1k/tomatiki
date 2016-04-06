/* eslint-env mocha */

import { chai } from 'meteor/practicalmeteor:chai';

import { PomodoroCounter } from '../../PomodoroCounter.js';


describe('PomodoroCounter', () => {

    describe('PomodoroCounter.constructor', () => {

        it('Creates a PomodoroCounter instance', () => {
            let p_counter = new PomodoroCounter();
            chai.assert.instanceOf(p_counter, PomodoroCounter);
        });

        it('Sets PomodoroCounter.count to 0, by default', () => {
            let p_counter = new PomodoroCounter();
            chai.assert.strictEqual(p_counter.count, 0);
        });

        it('Sets PomodoroCounter.count to the supplied value', () => {
            let p_counter = new PomodoroCounter({ count: 5 });
            chai.assert.strictEqual(p_counter.count, 5);
        });

    });

    describe('PomodoroCounter.increment', () => {

        it('Increments PomodoroCounter.count by 1 by default', () => {
            let p_counter = new PomodoroCounter();
            p_counter.increment();
            chai.assert.strictEqual(p_counter.count, 1);
        });

        it('Increments PomodoroCounter.count with the supplied value', () => {
            let p_counter = new PomodoroCounter();
            p_counter.increment({ amount: 7 });
            chai.assert.strictEqual(p_counter.count, 7);
        });
    });

    describe('PomodoroCounter.decrement', () => {

        it('Decrements PomodoroCounter.count by 1 by default', () => {
            let p_counter = new PomodoroCounter({ count: 5 });
            p_counter.decrement();
            chai.assert.strictEqual(p_counter.count, 4);
        });

        it('Decrements PomodoroCounter.count with the supplied value', () => {
            let p_counter = new PomodoroCounter({ count: 5 });
            p_counter.decrement({ amount: 5 });
            chai.assert.strictEqual(p_counter.count, 0);
        });

    });

});
