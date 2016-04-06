/* eslint-env mocha */

import { chai } from 'meteor/practicalmeteor:chai';

import { PomodoroCounter } from '../../PomodoroCounter.js';


describe('PomodoroCounter', () => {
    describe('PomodoroCounter.constructor', () => {
        it('Creates a PomodoroCounter instance', () => {
            let p_counter = new PomodoroCounter();
            chai.assert.instanceOf(p_counter, PomodoroCounter);
        });

        it('Sets count to 0, by default', () => {
            let p_counter = new PomodoroCounter();
            chai.assert.strictEqual(p_counter.count, 0);
        });
    });
});
