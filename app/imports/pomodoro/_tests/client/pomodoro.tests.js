/* eslint-env mocha */

import { chai } from 'meteor/practicalmeteor:chai';

import { Pomodoro } from '../../Pomodoro.js';
import { Timer } from '../../../timer/Timer.js';
import { Counter } from '../../../counter/Counter.js';


describe('Pomodoro', () => {

    describe('Pomodoro.constructor', () => {

        it('Creates a Pomodoro instance', () => {
            let pomodoro = new Pomodoro();
            chai.assert.instanceOf(pomodoro, Pomodoro);
        });

        it('Creates an instance of Timer', () => {
            let pomodoro = new Pomodoro();
            chai.assert.instanceOf(pomodoro.timer, Timer);
        });

        it('Creates an instance of Counter', () => {
            let pomodoro = new Pomodoro();
            chai.assert.instanceOf(pomodoro.counter, Counter);
        });

    });

});
