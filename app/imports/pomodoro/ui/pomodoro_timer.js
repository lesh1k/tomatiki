import { Template } from 'meteor/templating';
import { Timer } from '../../timer/Timer.js';

import './pomodoro_timer.html';


Template.pomodoroTimer.helpers({
    time: function(part, pad_width=2) {
        // part can be either one of: hours/minutes/seconds/miliseconds
        let tmpl = Template.instance(),
            timer = tmpl.timer;

        if (typeof pad_width !== 'number') {
            pad_width = 2;
        }
        return leftPad(timer.time.get(part), pad_width);
    },
    timer_separator: ':'
});

Template.pomodoroTimer.events({
    'click .start': function(event) {
        let tmpl = Template.instance();
        tmpl.timer.start();
    },
    'click .stop': function(event) {
        let tmpl = Template.instance();
        tmpl.timer.reset();
    }
});
