import { Template } from 'meteor/templating';

import './body.html';
import '../../timer/ui/timer.js';
import '../../counter/ui/counter.js';
import '../../pomodoro/ui/pomodoro.js';
import { Pomodori } from '../../api/pomodori/pomodori.js';


Template.body.onCreated(function() {
    this.subscribe('pomodori');
});

Template.body.helpers({
    pomodori: function() {
        return Pomodori.find();
    }
});
