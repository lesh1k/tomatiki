import { Template } from 'meteor/templating';
import { Timer } from '../Timer.js';

import './timer.html';


Template.timer.onCreated(function() {
    this.timer = new Timer({ interval_ms: 1002 });
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
    miliseconds: function() {
        let tmpl = Template.instance(),
            timer = tmpl.timer;
        return leftPad(timer.time.get('miliseconds'), 3);
    },
    timer_separator: ':'
});
