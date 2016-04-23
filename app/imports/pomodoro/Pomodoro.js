import { Timer } from '../timer/Timer.js';
import { Counter } from '../counter/Counter.js';


export class Pomodoro {
    constructor() {
        this.timer = new Timer({
            hours: 0,
            minutes: 0,
            seconds: 3,
            miliseconds: 0,
            interval_ms: 500
        });

        this.counter = new Counter({amount: 0});

        Tracker.autorun(() => {
            if (this.timer.is_done.get() === true) {
                this.counter.increment({ amount: 1 });
                this.timer.reset();
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
