import { Timer } from '../timer/Timer.js';
import { Counter } from '../counter/Counter.js';


const DEFAULTS = {
    pomodoro: {
        hours: 0,
        minutes: 0,
        seconds: 3,
        miliseconds: 0,
    },
    break: {
        hours: 0,
        minutes: 0,
        seconds: 2,
        miliseconds: 0,
    },
    long_break: {
        hours: 0,
        minutes: 0,
        seconds: 4,
        miliseconds: 0,
    },
    long_break_interval: 4
}

export class Pomodoro {
    constructor(settings=DEFAULTS) {
        settings = _.extend({}, DEFAULTS, settings);
        this.is_break = false;
        this.timer = new Timer(settings.pomodoro);

        this.counter = new Counter({amount: 0});

        Tracker.autorun(() => {
            if (this.timer.is_done.get()) {
                if (this.is_break) {
                    this.timer.set(settings.pomodoro);
                    this.is_break = false;
                    this.timer.reset();
                } else {
                    this.counter.increment({ amount: 1 });

                    let count = this.counter.count.get();
                    if (count > 0 && count % settings.long_break_interval === 0) {
                        this.timer.set(settings.long_break);
                    } else {
                        this.timer.set(settings.break);
                    }

                    this.is_break = true;
                    this.timer.reset();
                    this.timer.start();
                }
            }
        });
    }

    start() {
        this.timer.start();
    }

    stop() {
        this.timer.stop();
    }
}
