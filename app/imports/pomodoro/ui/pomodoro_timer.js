import { Template } from 'meteor/templating';
import { Timer } from '../../timer/Timer.js';

import './pomodoro_timer.html';


Template.pomodoroTimer.onCreated(function() {
    this.timer = new Timer({ interval_ms: 1002 });
})

Template.pomodoroTimer.helpers({
    hours: function() {
        let tmpl = Template.instance(),
            timer = tmpl.timer;
        return leftPad(timer.time.get('hours'));
    },
    minutes: function() {
        let tmpl = Template.instance(),
            timer = tmpl.timer;
        return leftPad(timer.time.get('minutes'));
    },
    seconds: function() {
        let tmpl = Template.instance(),
            timer = tmpl.timer;
        return leftPad(timer.time.get('seconds'));
    },
    miliseconds: function() {
        let tmpl = Template.instance(),
            timer = tmpl.timer;
        return leftPad(timer.time.get('miliseconds'), 3);
    },
    timer_separator: ':'
});
