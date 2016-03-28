// Write your tests here!
function errorType(expected_error=Error) {
    return function(error) {
        return error.name === expected_error.name;
    }
}

Tinytest.add('leshik:utils-leftpad - Output values validity', function(test) {
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

Tinytest.add('leshik:utils-leftpad - Throws an error for any type of value except "number" OR "string"', function(test) {
    let sample_space = [[], {}, Symbol(), void 0, null];
    for (let value of sample_space) {
        test.throws(leftPad.bind(null, value), errorType(TypeError));
    }
});

Tinytest.add('leshik:utils-leftpad - Throws an error if value is NaN', function(test) {
    test.throws(leftPad.bind(null, NaN), errorType(Error));
});

Tinytest.add('leshik:utils-leftpad - Throws an error for any type of padder except "string"', function(test) {
    let sample_space = [[], {}, Symbol(), null];
    for (let value of sample_space) {
        test.throws(leftPad.bind(null, 1, 1, value), errorType(TypeError));
    }
});

Tinytest.add('leshik:utils-leftpad - Padder length must be === 1', function(test) {
    test.throws(leftPad.bind(null, 1, 1, ''), errorType(Error));
    test.throws(leftPad.bind(null, 1, 1, '2345'), errorType(Error));
});
