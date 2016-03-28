// Write your tests here!
Tinytest.add('leshik:timer - Creates a Timer instance', (test) => {
    let timer = new Timer();
    test.instanceOf(timer, Timer);

    timer = new Timer({hours: 100, seconds:12, interval_ms: 1000});
    test.instanceOf(timer, Timer);
})

Tinytest.add('leshik:timer - Correctly parses input on timer creation', (test) => {
    let timer = new Timer({hours: 1, minutes: 25, seconds: 13});
    test.isFalse(timer.running);
    test.equal(timer.time.get('hours'), 1);
    test.equal(timer.time.get('minutes'), 25);
    test.equal(timer.time.get('seconds'), 13);
    test.equal(timer.time.get('miliseconds'), 0);
});
