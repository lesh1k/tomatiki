'use strict';

const DEFAULTS = {
    ms_in_second: 1000,
    seconds_in_minute: 60,
    minutes_in_hour: 60,
    seconds_in_hour: 3600,
    pomodoro_length: 25, // minutes
    state: {
        stopped: 'stopped',
        running: 'running'
        // completed: 'completed'
    }
}

Timer = class Timer {

    constructor({hours=0, minutes=25, seconds=0, miliseconds=0, interval_ms=1000, running=false}={}) {
        this.running = running;
        this.time = new ReactiveDict();
        this.time.set('hours', hours);
        this.time.set('minutes', minutes);
        this.time.set('seconds', seconds);
        this.time.set('miliseconds', miliseconds);
        this.duration = this.getTotalMiliseconds(this.time);


        // this.seconds = new ReactiveVar('00');
        // this.minutes = new ReactiveVar('00');
        // this.hours = new ReactiveVar('00');
        //
        // console.log('Constructor::No running Pomodoro found, init timer with defaults.');
        // this._seconds = 0;
        // this._minutes = duration % DEFAULTS.minutes_in_hour;
        // this._hours = Math.floor(duration / DEFAULTS.minutes_in_hour);
        //
        // this.updateTime();
    }

    getTotalMiliseconds({hours=0, minutes=0, seconds=0, miliseconds=0}={}) {
        let total_ms = 0;

        miliseconds && (total_ms += miliseconds);
        seconds && (total_ms += seconds * DEFAULTS.ms_in_second);
        minutes && (total_ms += minutes * DEFAULTS.seconds_in_minute * DEFAULTS.ms_in_second);
        hours && (total_ms += hours * DEFAULTS.seconds_in_hour * DEFAULTS.ms_in_second);

        return total_ms;
    }

    milisecondsToTime(ms) {
        this.time.set('hours', Math.floor(ms / DEFAULTS.seconds_in_hour / DEFAULTS.ms_in_second));
        this.time.set('minutes', 1);
        this._hours = Math.floor(seconds / DEFAULTS.seconds_in_hour);
        this._minutes = Math.floor((seconds - this._hours * DEFAULTS.seconds_in_hour) / DEFAULTS.seconds_in_minute);
        this._seconds = seconds % DEFAULTS.seconds_in_minute;
        this.updateTime();
    }

    secondsToTimer(seconds) {
        this._hours = Math.floor(seconds / DEFAULTS.seconds_in_hour);
        this._minutes = Math.floor((seconds - this._hours * DEFAULTS.seconds_in_hour) / DEFAULTS.seconds_in_minute);
        this._seconds = seconds % DEFAULTS.seconds_in_minute;
        this.updateTime();
    }

    restore() {
        console.log('Restoring Pomodoro: ', this.pomodoro);
        let ms_left = this.pomodoro.end - new Date();
        if (ms_left > 0) {
            let seconds_left = Math.floor(ms_left / DEFAULTS.ms_in_second);
            this.secondsToTimer(seconds_left);
            this.start();
        } else {
            Pomodori.update(this.pomodoro._id, {$set: {state: DEFAULTS.state.completed}});
            this.setupNew();
        }
    }

    setupNew() {
        let now = new Date(),
            pomodoro_id = Pomodori.insert({
                state: DEFAULTS.state.running,
                created: now,
                end: this.computeEndDate(now)
            });

        this.pomodoro = Pomodori.findOne(pomodoro_id);
        console.log('Inserted Pomodoro: ', this.pomodoro, `. Duration: ${this.duration}`);
    }

    start() {
        if (!this.pomodoro) {
            console.log('Start new Pomodoro');
            this.setupNew();
        } else {
            console.log('Continue countdown for restored Pomodoro', this.pomodoro);
        }

        this.interval_id = window.setInterval(this.countdown.bind(this),
                                            DEFAULTS.ms_in_second);

        $('.timer__trigger').text('Stop');
        this.state = this.pomodoro.state;
    }

    stop(reason) {
        console.log('Stopping pomodoro. Reason: ', reason);
        if (!reason) {
            throw new Error('Timer.stop called without a reason specified.');
        }
        window.clearInterval(this.interval_id);
        this.secondsToTimer(this.duration);
        $('.timer__trigger').text('Start');

        Pomodori.update(this.pomodoro._id, {$set: {state: reason}});
        this.state = reason;
        delete this.pomodoro;
    }

    computeEndDate(now) {
        let delta_ms = this.duration * DEFAULTS.ms_in_second;
        return new Date(now.getTime() + delta_ms);
    }

    countdown() {
        if (!this._seconds && !this._minutes && !this._hours) {
            this.stop(DEFAULTS.state.completed);
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

        this.updateTime();
    }

    updateTime() {
        this.seconds.set(leftPad(this._seconds));
        this.minutes.set(leftPad(this._minutes));
        this.hours.set(leftPad(this._hours));
    }

};
