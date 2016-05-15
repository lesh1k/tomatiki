import { Meteor } from 'meteor/meteor';
import { Timer } from '../timer/Timer.js';
import { Counter } from '../counter/Counter.js';
import { Pomodori } from '../api/pomodori/pomodori.js';


const DEFAULTS = {
    pomodoro: {
        hours: 0,
        minutes: 5,
        seconds: 0,
        miliseconds: 0,
        interval_ms: 200
    },
    break: {
        hours: 0,
        minutes: 0,
        seconds: 20,
        miliseconds: 0,
    },
    long_break: {
        hours: 0,
        minutes: 1,
        seconds: 0,
        miliseconds: 0,
    },
    long_break_interval: 4
};

export class Pomodoro {
    constructor(settings=DEFAULTS) {
        this.settings = _.extend({}, DEFAULTS, settings);
        this.is_break = false;

        this.timer = new Timer(this.settings.pomodoro);

        let pomodori_count = Pomodoro.getTodayPomodoriCount();
        this.counter = new Counter({amount: pomodori_count});

        let pomodoro = this.getRunningIfExists();
        if (pomodoro) {
            this.restore(pomodoro);
        }

        this.setupTracker();
    }

    getRunningIfExists() {
        let pomodori = Pomodoro.fetchIncomplete();
        if (!pomodori.length) return;

        let now = new Date();
        for (let p of pomodori) {
            if (p.break_end - now > Timer.epsilon()) {
                return p;
            }
        }
    }

    restore(pomodoro) {
        let now = new Date();

        this.id = pomodoro._id;

        let ms_left = pomodoro.end - now;
        if (ms_left <= 0) {
            ms_left = pomodoro.break_end - now;
            this.is_break = true;
        }

        this.timer.set({miliseconds: ms_left})
        this.start();
    }

    setupTracker() {
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
            end = Timer.computeEndDate(this.timer.duration),
            break_end = Timer.computeEndDate(next_break_duration, end);

        if (!this.id) {
            this.id = Meteor.call('pomodori.insert', {
                end: end,
                break_end: break_end,
                description: pomodoro_description,
                state: 1 // Running
            }, (error, result) => {
                if (result) {
                    this.id = result;
                    this.timer.start();
                } else {
                    throw new Meteor.Error(error);
                }
            });
        } else {
            this.timer.start();
        }
    }

    stop() {
        this.timer.set(this.settings.pomodoro);
        this.timer.reset();
        Meteor.call('pomodori.markReset', this.id);
    }

    finishPomodoro() {
        Meteor.call('pomodori.markBreak', this.id);
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
        Meteor.call('pomodori.markDone', this.id, (error) => {
            if (error) {
                throw new Meteor.Error(error);
            }
            this.id = void 0;
        });
    }

    static fetchIncomplete() {
        // Find running or breakRunning pomodori
        return Pomodori.find({state: {$in: [1, 2]}}).fetch();
    }

    static getTodayPomodoriCount() {
        let start_date = new Date(),
            end_date = new Date();

        start_date.setHours(0, 0, 0, 0);
        end_date.setHours(23, 59, 59, 999);

        return Pomodori.find({
            $and: [
                {end: {$gte: start_date}},
                {end: {$lte: end_date}},
                {state: 3}
            ]
        }).count();
    }
}
