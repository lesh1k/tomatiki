import { Template } from 'meteor/templating';

import { Pomodoro } from '../Pomodoro.js';
import './pomodoro_timer.js';
import './pomodoro_counter.js';
import './pomodoro.html';

const POMODORO = new Pomodoro();

Template.pomodoroTimer.onCreated(function() {
    this.timer = POMODORO.timer;
});

Template.pomodoroCounter.onCreated(function() {
    this.counter = POMODORO.counter;
});
