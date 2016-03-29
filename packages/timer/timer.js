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

        this.duration = Timer.getTotalMiliseconds(this.time.all());
    }

    static getTotalMiliseconds({hours=0, minutes=0, seconds=0, miliseconds=0}={}) {
        let total_ms = 0;

        miliseconds && (total_ms += miliseconds);
        seconds && (total_ms += seconds * DEFAULTS.ms_in_second);
        minutes && (total_ms += minutes * DEFAULTS.seconds_in_minute * DEFAULTS.ms_in_second);
        hours && (total_ms += hours * DEFAULTS.seconds_in_hour * DEFAULTS.ms_in_second);

        return total_ms;
    }

    milisecondsToTime(ms=this.duration) {
        this.time.set('hours', Math.floor(ms / DEFAULTS.ms_in_second / DEFAULTS.seconds_in_hour));
        this.time.set(
            'minutes',
            Math.floor(
                ms / DEFAULTS.ms_in_second / DEFAULTS.seconds_in_minute % DEFAULTS.minutes_in_hour
            )
        );
        this.time.set('seconds', Math.floor(ms / DEFAULTS.ms_in_second % DEFAULTS.seconds_in_minute));
        this.time.set('miliseconds', Math.floor(ms % DEFAULTS.ms_in_second));
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

    static computeEndDate(delta_ms, now=new Date()) {
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
};
