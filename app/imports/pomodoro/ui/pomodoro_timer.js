import { Template } from 'meteor/templating';
import { leftPad } from '../../utils/leftpad/leftpad.js';

import './pomodoro_timer.html';


Template.pomodoroTimer.helpers({
    time: function(part, pad_width=2) {
        // part can be either one of: hours/minutes/seconds/miliseconds
        let tmpl = Template.instance(),
            timer = tmpl.data.timer;

        if (typeof pad_width !== 'number') {
            pad_width = 2;
        }
        return leftPad(timer.time.get(part), pad_width);
    },
    timer_separator: ':'
});
