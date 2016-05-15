import { Template } from 'meteor/templating';

import './pomodoro_counter.html';


Template.pomodoroCounter.helpers({
    count: function() {
        let tmpl = Template.instance();
        return tmpl.data.counter.count.get();
    }
});
