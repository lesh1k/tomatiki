(function() {
    'use strict';

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

    class Timer {

        constructor(duration, interval=1) {
            this.duration = duration; // seconds
            this.interval = interval; // seconds
            this.secondsToTimer();

            Object.defineProperties(this, {
                'seconds': {
                    get: function() {
                        return leftPad(this._seconds);
                    }
                },
                'minutes': {
                    get: function() {
                        return leftPad(this._minutes);
                    }
                },
                'hours': {
                    get: function() {
                        return leftPad(this._hours);
                    }
                }
            })
        }

        secondsToTimer() {
            const seconds_in_minute = 60,
                seconds_in_hour = 3600;

            this._hours = Math.floor(this.duration / seconds_in_hour);
            this._minutes = Math.floor((this.duration - this._hours * seconds_in_hour) / seconds_in_minute);
            this._seconds = this.duration % seconds_in_minute;
        }

        start() {
            this.interval_id = window.setInterval(this.countdown.bind(this), 1000 * this.interval);
        }

        stop() {
            window.clearInterval(this.interval_id);
        }

        countdown() {
            if (!this._seconds && !this._minutes && !this._hours) {
                this.stop()
            } else if (this._seconds > 0) {
                this._seconds -= 1;
            } else if (this._seconds === 0 && this._minutes > 0) {
                this._minutes -= 1;
                this._seconds = 59;
            } else if (this._minutes === 0 && this._hours > 0) {
                this._hours -= 1;
                this._minutes = 59;
                this._seconds = 59;
            }

            this.updateSession();
        }

        updateSession() {
            Session.set('hours', this.hours);
            Session.set('minutes', this.minutes);
            Session.set('seconds', this.seconds);
        }
    }

    const TIMER = new Timer(25*60);

    Template.timer.helpers({
        hours: function() { return Session.get('hours') || TIMER.hours; },
        minutes: function() { return Session.get('minutes') || TIMER.minutes; },
        seconds: function() { return Session.get('seconds') || TIMER.seconds; },
        timer_separator: ':',
        timer_state: function() { return Session.get('timer_state') || 'stopped'; },
        button_label: function() { return Session.get('button_label') || 'Start'; }
    });

    Template.timer.events({
        'click .timer__trigger': function(event, template) {
            if (Session.get('timer_state') === 'stopped') {
                TIMER.start();
                Session.set('button_label', 'Stop');
                Session.set('timer_state', 'running');
            } else {
                TIMER.stop();
                Session.set('button_label', 'Start');
                Session.set('timer_state', 'stopped');
            }
        }
    });

})();
