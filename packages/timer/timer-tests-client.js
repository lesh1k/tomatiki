// Write your tests here!
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

Tinytest.add('leshik:timer - #1 computeEndDate computes Date using delta_ms correctly', (test) => {
    let date_now = new Date('Tue Mar 29 2016 13:50:00 GMT+0300 (EEST)'),
        delta_ms = 25 * 60 * 1000, // 25 minutes in ms
        expected = new Date('Tue Mar 29 2016 14:15:00 GMT+0300 (EEST)');

    let actual = Timer.computeEndDate(delta_ms, date_now);
    test.equal(actual, expected);
});

Tinytest.add('leshik:timer - #2 computeEndDate computes Date using delta_ms correctly', (test) => {
    let date_now = new Date('Tue Mar 29 2016 13:50:00 GMT+0300 (EEST)'),
        delta_ms = 123914555, // i.e. 34hrs 25min 14s 555ms
        expected = new Date('Thu Mar 31 2016 00:15:14.555 GMT+0300 (EEST)');

    let actual = Timer.computeEndDate(delta_ms, date_now);
    test.equal(actual, expected);
});
