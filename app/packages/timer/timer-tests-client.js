function errorType(expected_error=Error) {
    return function(error) {
        return error.name === expected_error.name;
    }
}

Tinytest.add('leshik:timer - Creates a Timer instance', (test) => {
    let timer = new Timer();
    test.instanceOf(timer, Timer);

    timer = new Timer({
        hours: 100,
        seconds: 12,
        interval_ms: 1000
    });
    test.instanceOf(timer, Timer);
});

Tinytest.add(
    'leshik:timer - New Timer instance, get time, state and duration values setup correctly.',
    (test) => {
        let timer = new Timer();
        test.isFalse(timer.running);
        test.equal(timer.time.get('hours'), 0);
        test.equal(timer.time.get('minutes'), 25);
        test.equal(timer.time.get('seconds'), 0);
        test.equal(timer.time.get('miliseconds'), 0);
    });

Tinytest.add('leshik:timer - Correctly parse input on timer creation', (test) => {
    let timer = new Timer({
        hours: 1,
        minutes: 25,
        seconds: 13
    });
    test.isFalse(timer.running);
    test.equal(timer.time.get('hours'), 1);
    test.equal(timer.time.get('minutes'), 25);
    test.equal(timer.time.get('seconds'), 13);
    test.equal(timer.time.get('miliseconds'), 0);
});

Tinytest.add('leshik:timer - getTotalMiliseconds return expected number of ms', (test) => {
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
    test.equal(ms, expected);
});

Tinytest.add('leshik:timer - Duration is computed correctly for default values', (test) => {
    let timer = new Timer();
    // Default duration is 25 minutes which equals 1500000ms
    test.equal(timer.duration, 1500000);
});

Tinytest.add('leshik:timer - milisecondsToTime updates Timer.time ReactiveDict', (test) => {
    let mock = {time: new ReactiveDict()},
        ms = 123914555; // i.e. 34hrs 25min 14s 555ms
    Timer.prototype.milisecondsToTime.call(mock, ms);

    test.equal(mock.time.get('hours'), 34);
    test.equal(mock.time.get('minutes'), 25);
    test.equal(mock.time.get('seconds'), 14);
    test.equal(mock.time.get('miliseconds'), 555);
});

Tinytest.add('leshik:timer - computeEndDate returns a date object', (test) => {
    let date_now = new Date('Tue Mar 29 2016 13:50:00 GMT+0300 (EEST)'),
        delta_ms = 25 * 60 * 1000, // 25 minutes in ms
        expected = new Date('Tue Mar 29 2016 14:15:00 GMT+0300 (EEST)');

    let actual = Timer.computeEndDate(delta_ms, date_now);
    test.instanceOf(actual, Date);
});

Tinytest.add('leshik:timer - computeEndDate (test #1) computes Date using delta_ms correctly', (test) => {
    let date_now = new Date('Tue Mar 29 2016 13:50:00 GMT+0300 (EEST)'),
        delta_ms = 25 * 60 * 1000, // 25 minutes in ms
        expected = new Date('Tue Mar 29 2016 14:15:00 GMT+0300 (EEST)');

    let actual = Timer.computeEndDate(delta_ms, date_now);
    test.equal(actual, expected);
});

Tinytest.add('leshik:timer - computeEndDate (test #2) computes Date using delta_ms correctly', (test) => {
    let date_now = new Date('Tue Mar 29 2016 13:50:00 GMT+0300 (EEST)'),
        delta_ms = 123914555, // i.e. 34hrs 25min 14s 555ms
        expected = new Date('Thu Mar 31 2016 00:15:14.555 GMT+0300 (EEST)');

    let actual = Timer.computeEndDate(delta_ms, date_now);
    test.equal(actual, expected);
});

Tinytest.add('leshik:timer - Timer.start() throws an error if called on a running instance.', (test) => {
    let timer = new Timer({running: true});
    test.throws(Timer.prototype.start.bind(timer), errorType(Error));
});

Tinytest.add('leshik:timer - Timer.start() changes Timer.running to "true"', (test) => {
    let timer = new Timer({hours: 1, minutes: 0, seconds: 0, running: false});
    timer.start();
    test.isTrue(timer.running);
});

Tinytest.add('leshik:timer - Timer.stop() throws an error if called on a stopped instance.', (test) => {
    let timer = new Timer({running: false});
    test.throws(Timer.prototype.stop.bind(timer), errorType(Error));
});

Tinytest.add('leshik:timer - Timer.stop() changes Timer.running to "false"', (test) => {
    let timer = new Timer({hours: 1, minutes: 0, seconds: 0, running: true});
    timer.stop();
    test.isFalse(timer.running);
});

function onComplete() {
    timer.stop();
    test.equal(this.timer.state, 'stopped');
    test.equal(timer.time.get('hours'), 0);
    test.equal(timer.time.get('minutes'), 59);
    test.equal(timer.get('seconds'), 59);
}

Tinytest.addAsync('leshik:timer - Timer.start() does countdown', (test, onComplete) => {
    let timer = new Timer({hours: 1, minutes: 0, seconds: 0});
    timer.start();
    Meteor.setTimeout(function() {
        onComplete();
    }, 1000);
});
