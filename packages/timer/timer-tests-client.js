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

Tinytest.add('leshik:timer - Duration is computed correctly for default values', (test) => {
    let timer = new Timer();
    // Default duration is 25 minutes which equals 1500000ms
    test.equal(timer.duration, 1500000);
});
