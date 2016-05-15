import { Template } from 'meteor/templating';

import { Pomodoro } from '../Pomodoro.js';
import './pomodoro_timer.js';
import './pomodoro_counter.js';
import './pomodoro.html';


const POMODORO = new Pomodoro();

Template.pomodoro.onCreated(function() {
    this.subscribe('pomodori', () => {
        POMODORO.counter.count.set(Pomodoro.getTodayPomodoriCount());
    });
});

Template.pomodoro.helpers({
    POMODORO: function() {
        return POMODORO;
    }
});

Template.pomodoro.events({
    'click .start': function() {
        POMODORO.start();
    },
    'click .stop': function() {
        POMODORO.stop();
    }
});
