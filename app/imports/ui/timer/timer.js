import { Template } from 'meteor/templating';
import { Timer } from '../../timer/Timer.js';

import './timer.html';


Template.timer.onCreated(function() {
    this.timer = new Timer();
    this.timer.start();
})

Template.timer.helpers({
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
    timer_separator: ':'
});
