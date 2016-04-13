import { Timer } from '../timer/Timer.js';
import { Counter } from '../counter/Counter.js';


export class Pomodoro {
    constructor() {
        this.timer = new Timer({
            hours: 0,
            minutes: 25,
            seconds: 0,
            miliseconds: 0,
            interval_ms: 500
        });

        this.counter = new Counter({amount: 0});
    }
}
