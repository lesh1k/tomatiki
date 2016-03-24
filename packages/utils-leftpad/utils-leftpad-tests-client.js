// Write your tests here!
Tinytest.add('utils-leftpad - Output values', function(test) {
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

Tinytest.add('utils-leftpad - Throws an error for any type of value except Number OR String', function(test) {
    let sample_space = [[], {}, Symbol(), void 0, null];
    for (let value of sample_space) {
        test.throws(leftPad.bind(null, value), TypeError);
    }
});

Tinytest.add('utils-leftpad - Throws an error if value is NaN', function(test) {
    test.throws(leftPad.bind(null, NaN), TypeError);
});

Tinytest.add('utils-leftpad - Throws an error for any type of padder except String', function(test) {
    test.throws(leftPad.bind(null, 1, 1, {}), TypeError);
});
