import { Timer } from '../timer/Timer.js';
import { Counter } from '../counter/Counter.js';
import { Pomodori } from '../api/pomodori/pomodori.js';


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
        this.settings = _.extend({}, DEFAULTS, settings);
        this.is_break = false;
        // this.meta = {
        //     end: void 0,
        //     break_end: void 0,
        //     description: ''
        // };

        this.timer = new Timer(this.settings.pomodoro);
        this.counter = new Counter({amount: 0});

        Tracker.autorun(() => {
            if (this.timer.is_done.get()) {
                if (this.is_break) {
                    this.finishBreak();
                } else {
                    this.finishPomodoro();
                }
            }
        });
    }

    start(pomodoro_description='') {
        let next_break_duration = this.getBreakDuration(this.counter.count.get()+1),
            now = new Date().getTime();

        this.id = Pomodori.insert({
            end: new Date(now + this.timer.duration),
            break_end: new Date(now + this.timer.duration + next_break_duration),
            description: pomodoro_description
        });

        if (this.id) {
            this.timer.start();
        } else {
            throw new Meteor.Error('Pomodori.insert failed!');
        }

    }

    stop() {
        this.timer.set(this.settings.pomodoro);
        this.timer.reset();
        this.updatePomodoro({
            is_running: false
        });
    }

    updatePomodoro(data = {}) {
        Pomodori.update(this.id, {
            $set: data
        });
    }

    finishPomodoro() {
        this.updatePomodoro({
            is_done: true,
            is_running: true
        });
        this.counter.increment({ amount: 1 });
        this.startBreak();
    }

    startBreak() {
        this.timer.set({miliseconds: this.getBreakDuration()});
        this.is_break = true;
        this.timer.reset();
        this.timer.start();
    }

    getBreakDuration(pomodoro_count = this.counter.count.get()) {
        let time = this.settings.break;
        if (pomodoro_count > 0 && pomodoro_count % this.settings.long_break_interval === 0) {
            time = this.settings.long_break;
        }

        return Timer.getTotalMiliseconds(time);
    }

    finishBreak() {
        this.timer.set(this.settings.pomodoro);
        this.is_break = false;
        this.timer.reset();
        this.updatePomodoro({
            is_running: false
        });
    }
}
