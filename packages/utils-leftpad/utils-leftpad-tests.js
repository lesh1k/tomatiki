// Write your tests here!
Tinytest.add('Output values', function(test) {
    test.equal(leftPad(''), '00');
    test.equal(leftPad(1), '01');
    test.equal(leftPad('1'), '01');
    test.equal(leftPad(11), '11');
    test.equal(leftPad(11, 10), '0000000011');
    test.equal(leftPad(1, 3, 'A'), 'AA1');
    test.equal(leftPad(11, 10, 'A'), 'AAAAAAAA11');
    test.equal(leftPad(123456789, 10, 'A'), 'A123456789');
    test.equal(leftPad(1234567890, 10, 'A'), '1234567890');
});

Tinytest.add('Argumets types', function(test) {
    let sample_space = [[], {}, Symbol(), void 0, null, NaN];
    for (let value of sample_space) {
        test.throws(leftPad(value), TypeError);
    }

    test.throws(leftPad(1, 1, {}), TypeError);
});
