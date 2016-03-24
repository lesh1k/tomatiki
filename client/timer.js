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

    const DEFAULTS = {
        ms_in_second: 1000,
        seconds_in_minute: 60,
        minutes_in_hour: 60,
        seconds_in_hour: 3600,
        pomodoro_length: 25 // minutes
    }

    class Timer {

        constructor(duration=25) {
            this.duration = duration * DEFAULTS.seconds_in_minutes;
            let pomodoro = Pomodori.findOne({state: 'running'});
            if (pomodoro) {
                this.pomodoro = pomodoro;
                this.restore();
            } else {
                this._seconds = 0;
                this._minutes = duration % DEFAULTS.minutes_in_hour;
                this._hours = Math.floor(duration / DEFAULTS.minutes_in_hour);
            }


            this.seconds = new ReactiveVar(0);
            this.minutes = new ReactiveVar(0);
            this.hours = new ReactiveVar(0);

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
            this._hours = Math.floor(this.duration / DEFAULTS.seconds_in_hour);
            this._minutes = Math.floor((this.duration - this._hours * DEFAULTS.seconds_in_hour) / DEFAULTS.seconds_in_minute);
            this._seconds = this.duration % DEFAULTS.seconds_in_minute;
        }

        restore() {
            let ms_left = this.pomodoro.end - new Date();
            if (ms_left > 0) {
                this.duration = Math.floor(ms_left / DEFAULTS.ms_in_second);
                this.secondsToTimer();
                this.start();
            }
        }

        setupNew() {
            let now = new Date();
            this.pomodoro = Pomodori.insert({
                state: 'running',
                created: now,
                end: this.computeEndDate(now)
            });
        }

        start() {
            if (!this.pomodoro) {
                this.setupNew();
            }

            this.interval_id = window.setInterval(this.countdown.bind(this),
                                                DEFAULTS.ms_in_second);
            this.state = this.pomodoro.state;
        }

        stop(reason) {
            window.clearInterval(this.interval_id);
            Pomodori.update(this.pomodoro, {$set: {state: reason}});
            this.state = this.pomodoro.state;
            delete this.pomodoro;
        }

        computeEndDate(now) {
            let delta_ms = this.duration * DEFAULTS.seconds_in_minute * DEFAULTS.ms_in_second;
            return new Date(now.getTime() + delta_ms);
        }

        countdown() {
            if (!this._seconds && !this._minutes && !this._hours) {
                this.stop('completed')
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

    const TIMER = new Timer();

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
            if (TIMER.state === 'stopped') {
                TIMER.start();
            } else {
                TIMER.stop();
            }
        }
    });

})();
