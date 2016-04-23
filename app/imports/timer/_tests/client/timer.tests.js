/* eslint-env mocha */

import {
    chai
} from 'meteor/practicalmeteor:chai';
import {
    catchAsync
} from '../../../helpers/test-helpers.js';
import {
    Timer
} from '../../Timer.js';


describe('Timer', () => {

    const TIMER_EPSILON = 9;

    describe('Timer.constructor', () => {
        it('Creates a Timer instance when new Timer() is called', () => {
            let timer = new Timer();
            chai.assert.instanceOf(timer, Timer);
        });

        it('Creates a Timer instance when new Timer() is called with arguments', () => {
            let timer = new Timer({
                hours: 100,
                seconds: 12,
                interval_ms: 1000
            });
            chai.assert.instanceOf(timer, Timer);
        });

        it('Throws an error when interval is set to less than 10ms', () => {
            chai.assert.throws(() => {
                new Timer({
                    interval_ms: 9
                })
            }, Error);
        })

        it('Sets up correct default time and running_state values for a new instance', () => {
            let timer = new Timer();

            chai.assert.isFalse(timer.is_running);
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

            chai.assert.isFalse(timer.is_running);
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
            let mock = {
                    time: new ReactiveDict()
                },
                ms = 123914555; // i.e. 34hrs 25min 14s 555ms
            Timer.prototype.milisecondsToTime.call(mock, ms);

            chai.assert.strictEqual(mock.time.get('hours'), 34);
            chai.assert.strictEqual(mock.time.get('minutes'), 25);
            chai.assert.strictEqual(mock.time.get('seconds'), 14);
            chai.assert.strictEqual(mock.time.get('miliseconds'), 555);
            chai.assert.strictEqual(mock.time.get('ms_left'), ms);
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
            let timer = new Timer({
                hours: 1,
                minutes: 0,
                seconds: 0,
                running: false
            });
            timer.start();
            chai.assert.isTrue(timer.is_running);
        });

        it('Throws an error if called on a running instance.', () => {
            let timer = new Timer({
                is_running: true
            });
            chai.assert.throws(Timer.prototype.start.bind(timer), Error);
        });

        it('Starts countdown', (done) => {
            // WARNING! When the CPU is overloaded,
            // asserts (for miliseconds and seconds) might fail
            // That's not likely but possible.
            let timer = new Timer({
                hours: 1,
                minutes: 0,
                seconds: 0,
                interval_ms: 10
            });
            timer.start();
            setTimeout(() => {
                timer.stop();
                catchAsync(done, () => {
                    chai.assert.isFalse(timer.is_running);
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('hours'), 0);
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('minutes'), 59);
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('seconds'), 59);
                });
                catchAsync(done, () => {
                    chai.assert.notEqual(timer.time.get('miliseconds'), 0);
                });
                done();
            }, 10 + TIMER_EPSILON);
        });

        it('Does not change state to running if called when no time left (i.e. 00:00:00)', () => {
            let timer = new Timer({
                hours: 0,
                minutes: 0,
                seconds: 0
            });
            timer.start();
            chai.assert.isFalse(timer.is_running);
        });
    });

    describe('Timer.stop', () => {
        it('Changes Timer.running to "false"', () => {
            let timer = new Timer({
                running: false
            });
            chai.assert.throws(Timer.prototype.stop.bind(timer), Error);
        });

        it('Throws an error if called on a stopped instance.', () => {
            let timer = new Timer({
                running: false
            });
            chai.assert.throws(Timer.prototype.stop.bind(timer), Error);
        });
    });

    describe('Timer.countdown', () => {
        it('Works for interval_ms different from 1000ms', (done) => {
            let timer = new Timer({
                hours: 0,
                minutes: 0,
                seconds: 0,
                miliseconds: 15,
                interval_ms: 10
            });
            timer.start();
            setTimeout(() => {
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('hours'), 0, 'hours');
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('minutes'), 0, 'minutes');
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('seconds'), 0, 'seconds');
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('miliseconds'), 0, 'miliseconds');
                });
                catchAsync(done, () => {
                    chai.assert.isFalse(timer.is_running);
                });
                catchAsync(done, () => {
                    chai.assert.isTrue(timer.is_done.get());
                });
                done();
            }, 20);
        });

        it('Stops when reaching 00:00:00:000 and sets the "complete" flag to true', function(done) {
            let timer = new Timer({
                hours: 0,
                minutes: 0,
                seconds: 0,
                miliseconds: 10,
                interval_ms: 10
            });
            timer.start();
            setTimeout(() => {
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('hours'), 0, 'hours');
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('minutes'), 0, 'minutes');
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('seconds'), 0, 'seconds');
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('miliseconds'), 0, 'miliseconds');
                });
                catchAsync(done, () => {
                    chai.assert.isFalse(timer.is_running);
                });
                catchAsync(done, () => {
                    chai.assert.isTrue(timer.is_done.get());
                });
                done();
            }, 10);
        });

        it('It uses ms_left instead of interval_ms in case ms_left<interval_ms', (done) => {
            let timer = new Timer({
                hours: 0,
                minutes: 0,
                seconds: 0,
                miliseconds: 5,
                interval_ms: 100
            });
            timer.start();
            setTimeout(() => {
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('hours'), 0);
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('minutes'), 0);
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('seconds'), 0);
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('miliseconds'), 0);
                });
                catchAsync(done, () => {
                    chai.assert.isFalse(timer.is_running);
                });
                catchAsync(done, () => {
                    chai.assert.isTrue(timer.is_done.get());
                });
                done();
            }, 10);
        });
    });

    describe('Timer.complete', () => {
        let timer = new Timer();
        timer.start();
        timer.complete();

        it('Sets the "is_done" flag to true', () => {
            chai.assert.isTrue(timer.is_done.get());
        });

        it('Sets the "running" flag to false', () => {
            chai.assert.isFalse(timer.is_running);
        });

    });

    describe('Timer.set', () => {
        let timer;

        beforeEach(() => {
            timer = new Timer({
                hours: 0,
                minutes: 10,
                seconds: 15,
                miliseconds: 5,
                interval_ms: 10
            });
        });

        it('Should update Timer.time values with the ones specified', () => {
            timer.set({
                hours: 12,
                minutes: 19,
                seconds: 50,
                miliseconds: 325
            });

            chai.assert.strictEqual(timer.time.get('hours'), 12);
            chai.assert.strictEqual(timer.time.get('minutes'), 19);
            chai.assert.strictEqual(timer.time.get('seconds'), 50);
            chai.assert.strictEqual(timer.time.get('miliseconds'), 325);
        });
    });

    describe('Timer.reset', () => {
        let timer;

        beforeEach(() => {
            timer = new Timer({
                hours: 0,
                minutes: 10,
                seconds: 15,
                miliseconds: 5,
                interval_ms: 10
            });
        });

        it('Should reset Timer.time to values used on instantiation', (done) => {
            timer.start();
            setTimeout(() => {
                timer.reset();
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('hours'), 0);
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('minutes'), 10);
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('seconds'), 15);
                });
                catchAsync(done, () => {
                    chai.assert.strictEqual(timer.time.get('miliseconds'), 5);
                });
                done();
            }, 20);
        });

        it('Should stop the countdown', () => {
            timer.start();
            timer.reset();
            chai.assert.isFalse(timer.is_running);
        });

        it('Should set Timer.is_done to false', () => {
            timer.start();
            timer.reset();
            chai.assert.isFalse(timer.is_done.get());
        });
    });
});
