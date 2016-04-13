import { Template } from 'meteor/templating';
import { Timer } from '../Timer.js';

import './timer.html';


Template.timer.onCreated(function() {
    this.timer = new Timer({ interval_ms: 1002 });
    this.timer.start();
})

Template.timer.helpers({
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
