import { Timer } from '../timer/Timer.js';
import { Counter } from '../counter/Counter.js';


const DEFAULTS = {
    pomodoro_time: {
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
    }
}

export class Pomodoro {
    constructor(settings=DEFAULTS) {
        this.is_break = false;
        this.timer = new Timer(settings.pomodoro_time);

        this.counter = new Counter({amount: 0});

        Tracker.autorun(() => {
            if (this.timer.is_done.get()) {
                if (this.is_break) {
                    this.timer.set(settings.pomodoro_time);
                    this.is_break = false;
                    this.timer.reset();
                } else {
                    this.counter.increment({ amount: 1 });
                    this.timer.set(settings.break);
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
