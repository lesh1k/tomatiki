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
    },
    time: {
        hours: 0,
        minutes: 25,
        seconds: 0,
        miliseconds: 0
    },
    interval_ms: 1002
}


export class Timer {

    constructor({
        hours = DEFAULTS.time.hours,
        minutes = DEFAULTS.time.minutes,
        seconds = DEFAULTS.time.seconds,
        miliseconds = DEFAULTS.time.miliseconds,
        interval_ms = DEFAULTS.interval_ms,
        running = false
    } = {}) {
        if (interval_ms < 10) {
            throw Error('Interval should be greater or equal to 10ms');
        }

        this.is_done = false;
        this.interval_ms = interval_ms;
        this.running = running;
        this.error_ms = 0;
        this.duration = 0;
        this.time = new ReactiveDict();
        this.set({
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            miliseconds: miliseconds
        });
    }

    set({
        hours = 0,
        minutes = 0,
        seconds = 0,
        miliseconds = 0,
    } = {}) {
        this.duration = Timer.getTotalMiliseconds({
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            miliseconds: miliseconds
        });
        this.milisecondsToTime(this.duration);
    }

    milisecondsToTime(ms = this.duration) {
        this.time.set('ms_left', ms);
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

    reset() {
        this.stop();
        this.is_done = false;
        this.set({miliseconds: this.duration});
    }

    start() {
        if (!this.running && this.time.get('ms_left') > 0) {
            this.started = new Date().getTime();
            let interval = Math.min(this.time.get('ms_left'), this.interval_ms);
            this.timeout_id = setTimeout(this.countdown.bind(this), interval);
            this.running = true;
        } else if (this.running) {
            throw new Error('Called Timer.start() on an already running instance');
        }
    }

    stop() {
        if (!this.running) {
            throw new Error('Called Timer.stop() on a stopped instance');
        }

        clearTimeout(this.timeout_id);
        this.running = false;
    }

    countdown() {
        let now = new Date().getTime(),
            ellapsed = now - this.started,
            ms_left = this.duration - ellapsed;

        if (ms_left <= 0) {
            this.milisecondsToTime(0);
            this.complete();
        } else {
            let expected_interval_ms = this.interval_ms - this.error_ms,
                actual_interval_ms = this.time.get('ms_left') - ms_left;
            this.error_ms = actual_interval_ms - expected_interval_ms;

            let interval = this.interval_ms - this.error_ms;
            if (ms_left < interval) {
                interval = ms_left;
            }

            this.timeout_id = setTimeout(this.countdown.bind(this), interval);
            this.milisecondsToTime(ms_left);
        }
    }

    complete() {
        this.stop();
        this.is_done = true;
    }

    static computeEndDate(delta_ms, now = new Date()) {
        return new Date(now.getTime() + delta_ms);
    }

    static getTotalMiliseconds({
        hours = 0,
        minutes = 0,
        seconds = 0,
        miliseconds = 0
    } = {}) {
        let total_ms = 0;

        miliseconds && (total_ms += miliseconds);
        seconds && (total_ms += seconds * DEFAULTS.ms_in_second);
        minutes && (total_ms += minutes * DEFAULTS.seconds_in_minute * DEFAULTS.ms_in_second);
        hours && (total_ms += hours * DEFAULTS.seconds_in_hour * DEFAULTS.ms_in_second);

        return total_ms;
    }
};
