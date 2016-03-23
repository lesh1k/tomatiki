(function() {
    var TIMER_DEFAULTS = {
        work: {
            hours: 0,
            minutes: 25,
            seconds: 0
        },
        break: {
            hours: 0,
            minutes: 5,
            seconds: 0
        },
        long_break: {
            hours: 0,
            minutes: 15,
            seconds: 0
        },
        state: {
            stopped: 'stopped',
            running: 'running',
            paused: 'paused'
        }
    };

    Template.timer.helpers({
        hours: function() { return Session.get('hours') || TIMER_DEFAULTS.work.hours; },
        minutes: function() { return Session.get('minutes') || TIMER_DEFAULTS.work.minutes; },
        seconds: function() { return Session.get('seconds') || TIMER_DEFAULTS.work.seconds; },
        timer_separator: ':',
        timer_state: function() { return Session.get('timer_state') || 'stopped'; },
        button_label: function() { return Session.get('button_label') || 'Start'; }
    });

    Template.timer.events({
        'click .timer__trigger': function(event, template) {
            Session.set('button_label', 'Stop');
            Session.set('timer_state', 'running');
        }
    });
})();
