/* eslint-env mocha */

import { chai } from 'meteor/practicalmeteor:chai';

import { Pomodoro } from '../../Pomodoro.js';
import { Timer } from '../../../timer/Timer.js';
import { Counter } from '../../../counter/Counter.js';


describe('Pomodoro', () => {

    describe('Pomodoro.constructor', () => {

        it('Creates a Pomodoro instance', () => {
            let pomodoro = new Pomodoro();
            chai.assert.instanceOf(pomodoro, Pomodoro);
        });

        it('Creates an instance of Timer', () => {
            let pomodoro = new Pomodoro();
            chai.assert.instanceOf(pomodoro.timer, Timer);
        });

        it('Creates an instance of Counter', () => {
            let pomodoro = new Pomodoro();
            chai.assert.instanceOf(pomodoro.counter, Counter);
        });

        it('Sets up the Tracker to increment counter on timer.is_done', () => {
            let pomodoro = new Pomodoro();
            pomodoro.timer.is_done.set(true);
            Tracker.flush();
            chai.assert.strictEqual(pomodoro.counter.count.get(), 1);
        })

    });

    describe('Pomodoro.start / Pomodoro.stop', () => {
        let pomodoro = new Pomodoro();

        it('Starts the timer', () => {
            pomodoro.start();
            chai.assert.isTrue(pomodoro.timer.is_running);
        });

        it('Stops the timer', () => {
            pomodoro.stop();
            chai.assert.isFalse(pomodoro.timer.is_running);
        });
    });

});
