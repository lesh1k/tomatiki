import { Template } from 'meteor/templating';

import { Pomodoro } from '../Pomodoro.js';
import './pomodoro_timer.js';
import './pomodoro_counter.js';
import './pomodoro.html';



Template.pomodoro.onCreated(function() {
    let tmpl = Template.instance();

    this.subscribe('pomodori', () => {
        tmpl.pomodoro = new Pomodoro();
        tmpl.pomodoro.counter.count.set(Pomodoro.getTodayPomodoriCount());
    });
});

Template.pomodoro.helpers({
    POMODORO: function() {
        let pomodoro = Template.instance().pomodoro;
        return pomodoro;
    }
});

Template.pomodoro.events({
    'click .start': function() {
        let pomodoro = Template.instance().pomodoro;
        pomodoro.start();
    },
    'click .stop': function() {
        let pomodoro = Template.instance().pomodoro;
        pomodoro.stop();
    }
});
