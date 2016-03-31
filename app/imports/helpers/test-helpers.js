'use strict';

export function catchAsync(done, fn) {
    try {
        fn();
    } catch (err) {
        done(err);
    }
}
