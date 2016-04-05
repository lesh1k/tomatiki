/* eslint-env mocha */

import { chai } from 'meteor/practicalmeteor:chai';
import { catchAsync } from '../helpers/test-helpers.js';
import { Timer } from './Timer.js';



describe('Timer', () => {

    describe('Timer.constructor', () => {
        it('Creates a Timer instance when new Timer() is called', () => {
            let timer = new Timer();
            chai.assert.instanceOf(timer, Timer);
        });

        it('Creates a Timer instance when new Timer() is called with arguments', () => {
            let timer = new Timer();

            timer = new Timer({
                hours: 100,
                seconds: 12,
                interval_ms: 1000
            });
            chai.assert.instanceOf(timer, Timer);
        });

        it('Sets up correct default time and running_state values for a new instance', () => {
            let timer = new Timer();

            chai.assert.isFalse(timer.running);
            chai.assert.strictEqual(timer.time.get('hours'), 0);
            chai.assert.strictEqual(timer.time.get('minutes'), 25);
            chai.assert.strictEqual(timer.time.get('seconds'), 0);
            chai.assert.strictEqual(timer.time.get('miliseconds'), 0);
        });

        it('Parses supplied arguments on Timer instance creation', () => {
            let timer = new Timer({
                hours: 1,
                minutes: 25,
                seconds: 13
            });

            chai.assert.isFalse(timer.running);
            chai.assert.strictEqual(timer.time.get('hours'), 1);
            chai.assert.strictEqual(timer.time.get('minutes'), 25);
            chai.assert.strictEqual(timer.time.get('seconds'), 13);
            chai.assert.strictEqual(timer.time.get('miliseconds'), 0);
        });

        it('Computes duration correctly for default values', () => {
            let timer = new Timer();
            // Default duration is 25 minutes which equals 1500000ms
            chai.assert.strictEqual(timer.duration, 1500000);
        });
    });

    describe('Timer.getTotalMiliseconds', () => {
        it('Returns expected number of ms', () => {
            let ms = Timer.getTotalMiliseconds({
                hours: 2,
                minutes: 34,
                seconds: 15,
                miliseconds: 888
            });

            let expected = 2 * 3600 * 1000 // hours
            + 34 * 60 * 1000 // minutes
            + 15 * 1000 // seconds
            + 888; // miliseconds
            chai.assert.strictEqual(ms, expected);
        });
    });

    describe('Timer.milisecondsToTime', () => {
        it('Updates Timer.time ReactiveDict', () => {
            let mock = {time: new ReactiveDict()},
                ms = 123914555; // i.e. 34hrs 25min 14s 555ms
            Timer.prototype.milisecondsToTime.call(mock, ms);

            chai.assert.strictEqual(mock.time.get('hours'), 34);
            chai.assert.strictEqual(mock.time.get('minutes'), 25);
            chai.assert.strictEqual(mock.time.get('seconds'), 14);
            chai.assert.strictEqual(mock.time.get('miliseconds'), 555);
        });
    });

    describe('Timer.computeEndDate', () => {
        it('Returns a Date object', () => {
            let date_now = new Date('Tue Mar 29 2016 13:50:00 GMT+0300 (EEST)'),
                delta_ms = 25 * 60 * 1000; // 25 minutes in ms
                // expected = new Date('Tue Mar 29 2016 14:15:00 GMT+0300 (EEST)');

            let actual = Timer.computeEndDate(delta_ms, date_now);
            chai.assert.instanceOf(actual, Date);
        });

        it('Computes Date using delta_ms correctly (test #1)', () => {
            let date_now = new Date('Tue Mar 29 2016 13:50:00 GMT+0300 (EEST)'),
                delta_ms = 25 * 60 * 1000, // 25 minutes in ms
                expected = new Date('Tue Mar 29 2016 14:15:00 GMT+0300 (EEST)');

            let actual = Timer.computeEndDate(delta_ms, date_now);
            chai.assert.strictEqual(actual.getTime(), expected.getTime());
        });

        it('Computes Date using delta_ms correctly (test #2)', () => {
            let date_now = new Date('Tue Mar 29 2016 13:50:00 GMT+0300 (EEST)'),
                delta_ms = 123914555, // i.e. 34hrs 25min 14s 555ms
                expected = new Date('Thu Mar 31 2016 00:15:14.555 GMT+0300 (EEST)');

            let actual = Timer.computeEndDate(delta_ms, date_now);
            chai.assert.strictEqual(actual.getTime(), expected.getTime());
        });
    });

    describe('Timer.start', () => {
        it('Changes Timer.running to "true"', () => {
            let timer = new Timer({hours: 1, minutes: 0, seconds: 0, running: false});
            timer.start();
            chai.assert.isTrue(timer.running);
        });

        it('Throws an error if called on a running instance.', () => {
            let timer = new Timer({running: true});
            chai.assert.throws(Timer.prototype.start.bind(timer), Error);
        });

        it('Does countdown', (done) => {
            let timer = new Timer({hours: 1, minutes: 0, seconds: 0});
            timer.start();
            setTimeout(() => {
                timer.stop();
                catchAsync(done, () => { chai.assert.isFalse(timer.running); });
                catchAsync(done, () => { chai.assert.strictEqual(timer.time.get('hours'), 0); });
                catchAsync(done, () => { chai.assert.strictEqual(timer.time.get('minutes'), 59); });
                catchAsync(done, () => { chai.assert.strictEqual(timer.time.get('seconds'), 59); });
                done();
            }, 1000);
        });
    });

    describe('Timer.stop', () => {
        it('Changes Timer.running to "false"', () => {
            let timer = new Timer({running: false});
            chai.assert.throws(Timer.prototype.stop.bind(timer), Error);
        });

        it('Throws an error if called on a stopped instance.', () => {
            let timer = new Timer({running: false});
            chai.assert.throws(Timer.prototype.stop.bind(timer), Error);
        });
    });
});
