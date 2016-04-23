import { Template } from 'meteor/templating';

import { Counter } from '../../counter/Counter.js';
import './pomodoro_counter.html';


Template.pomodoroCounter.helpers({
    count: function() {
        let tmpl = Template.instance();
        return tmpl.counter.count.get();
    }
});
