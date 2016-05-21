/* eslint-env mocha */

import { chai } from 'meteor/practicalmeteor:chai';

import { Pomodoro } from '../../Pomodoro.js';
import { Timer } from '../../../timer/Timer.js';
import { Counter } from '../../../counter/Counter.js';


describe('Pomodoro', () => {

    describe('Pomodoro.constructor', () => {
        let pomodoro = new Pomodoro();

        it('Creates a Pomodoro instance', () => {
            chai.assert.instanceOf(pomodoro, Pomodoro);
        });

        it('Creates an instance of Timer', () => {
            chai.assert.instanceOf(pomodoro.timer, Timer);
        });

        it('Creates an instance of Counter', () => {
            chai.assert.instanceOf(pomodoro.counter, Counter);
        });

    });

    describe('Pomodoro Tracker', () => {
        it('Increments counter on timer.is_done', () => {
            let pomodoro = new Pomodoro();
            pomodoro.timer.is_done.set(true);
            Tracker.flush();
            chai.assert.strictEqual(pomodoro.counter.count.get(), 1);
        });

        it('Does not increment counter on timer.is_done if it is a break', () => {
            let pomodoro = new Pomodoro(),
                count = pomodoro.counter.count.get();

            pomodoro.is_break = true;
            pomodoro.timer.is_done.set(true);
            Tracker.flush();
            chai.assert.strictEqual(pomodoro.counter.count.get(), count);
        });

        it('Starts a long break if count == settings.long_break_interval', () => {
            let config = {
                pomodori_before_long_break: 2,
                long_break: {
                        hours: 0,
                        minutes: 0,
                        seconds: 20,
                        miliseconds: 0
                    }
                },
                pomodoro = new Pomodoro(config);

            pomodoro.counter.count.set(1);
            pomodoro.timer.is_done.set(true);
            Tracker.flush();
            chai.assert.isTrue(pomodoro.is_break);
            chai.assert.strictEqual(pomodoro.timer.duration, 20000); // 20,000 i.e. 20s in ms
        });
    });

    describe('Pomodoro.start', () => {
        it('Starts the timer', () => {
            let pomodoro = new Pomodoro();
            pomodoro.start();
            chai.assert.isTrue(pomodoro.timer.is_running);
        });
    });

    describe('Pomodoro.stop', () => {
        it('Stops the timer', () => {
            let pomodoro = new Pomodoro();
            pomodoro.stop();
            chai.assert.isFalse(pomodoro.timer.is_running);
        });

        it('Resets the pomodoro', () => {
            let config = {
                long_break_interval: 2,
                long_break: {
                        hours: 0,
                        minutes: 0,
                        seconds: 20,
                        miliseconds: 0
                    },
                pomodoro: {
                        hours: 0,
                        minutes: 5,
                        seconds: 5,
                        miliseconds: 0
                    }
                },
                pomodoro = new Pomodoro(config);

            pomodoro.counter.count.set(1);
            pomodoro.timer.is_done.set(true);
            Tracker.flush();
            pomodoro.stop();

            chai.assert.strictEqual(pomodoro.timer.time.get('seconds'), 5);
            chai.assert.strictEqual(pomodoro.timer.time.get('minutes'), 5);
        });
    });

});
