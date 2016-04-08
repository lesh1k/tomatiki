import { Timer } from '../timer/Timer.js';
import { Counter } from '../counter/Counter.js';


export class Pomodoro {
    constructor() {
        this.timer = new Timer({
            hours: 0,
            minutes: 25,
            seconds: 0,
            miliseconds: 0,
            interval_ms: 1002 // 1002 to compensate for deviations during countdown
        });

        this.counter = new Counter({amount: 0});
    }
}
