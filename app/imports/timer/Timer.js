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


export class Timer {

    constructor({hours=0, minutes=25, seconds=0, miliseconds=0, interval_ms=1000, running=false}={}) {
        this.running = running;
        this.interval_ms = interval_ms;

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
        if(this.running) {
            throw new Error('Called Timer.start() on an already running instance');
        }

        this.interval_id = Meteor.setInterval(this.countdown.bind(this), this.interval_ms);
        this.running = true;
    }

    stop() {
        if(!this.running) {
            throw new Error('Called Timer.stop() on a stopped instance');
        }

        this.running = false;
        Meteor.clearInterval(this.interval_id);
    }

    static computeEndDate(delta_ms, now=new Date()) {
        return new Date(now.getTime() + delta_ms);
    }

    countdown() {
        let time = this.time.all();

        if (!time.seconds && !time.minutes && !time.hours) {
            this.stop();
            return;
        } else if (time.seconds > 0) {
            time.seconds -= 1;
        } else if (time.seconds === 0 && time.minutes > 0) {
            time.minutes -= 1;
            time.seconds = 59;
        } else if (time.minutes === 0 && time.hours > 0) {
            time.hours -= 1;
            time.minutes = 59;
            time.seconds = 59;
        }

        this.time.set('seconds', time.seconds);
        this.time.set('minutes', time.minutes);
        this.time.set('hours', time.hours);
    }
};
