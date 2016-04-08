/* eslint-env mocha */

import { chai } from 'meteor/practicalmeteor:chai';

import { Pomodoro } from '../../Pomodoro.js';


describe('Pomodoro', () => {

    describe('Pomodoro.constructor', () => {

        it('Creates a Pomodoro instance', () => {
            let pomodoro = new Pomodoro();
            chai.assert.instanceOf(pomodoro, Pomodoro);
        });

    });

});
