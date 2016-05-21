import { Meteor } from 'meteor/meteor';
import { Timer } from '../timer/Timer.js';
import { Counter } from '../counter/Counter.js';
import { Pomodori } from '../api/pomodori/pomodori.js';


const DEFAULTS = {
    pomodoro: {
        hours: 0,
        minutes: .25,
        seconds: 0,
        miliseconds: 0,
        interval_ms: 200
    },
    break: {
        hours: 0,
        minutes: 0,
        seconds: 10,
        miliseconds: 0,
    },
    long_break: {
        hours: 0,
        minutes: 0,
        seconds: 20,
        miliseconds: 0,
    },
    pomodori_before_long_break: 4
};


export class Pomodoro {
    constructor(settings=DEFAULTS) {
        this.settings = _.extend({}, DEFAULTS, settings);
        this.is_break = false;

        this.timer = new Timer(this.settings.pomodoro);

        let pomodori_count = Pomodoro.getCompletedTodayCount();
        this.counter = new Counter(pomodori_count);
        console.log(pomodori_count)

        let pomodoro = Pomodoro.getUnfinishedIfExists();
        if (pomodoro) {
            this.restore(pomodoro);
        } else {
            Meteor.call('pomodori.createNew', (error, created_id) => {
                this.id = created_id;
                this.state = Pomodori.findOne({_id: this.id}).state;
            });
        }

        this.setupObserver();
        this.setupTimerTracker();
    }

    restore(pomodoro) {
        let now = new Date();

        this.id = pomodoro._id;
        this.state = pomodoro.state;

        let ms_left = pomodoro.end - now;
        if (ms_left <= 0) {
            ms_left = pomodoro.break_end - now;
            this.is_break = true;
        }

        this.timer.set({miliseconds: ms_left});
        this.start();
    }

    setupTimerTracker() {
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

    setupObserver() {
        let self = this;
        Pomodori.find().observeChanges({
            changed(id, fields) {
                if (id === self.id) {
                    if (fields.state === 1) {
                        let pomodoro = _.extend(fields, {_id: id});
                        self.restore(pomodoro);
                    } else if (fields.state === -1) {
                        self.stop();
                    }
                }
            },
            added(id, fields) {
                if (self.id !== id) {
                    self.id = id;
                    self.state = fields.state;
                }
            },
        });
    }

    start(pomodoro_description='') {
        if (!this.id) {
            Meteor.call('pomodori.createNew', (error, created_id) => {
                this.id = created_id;
                this.state = Pomodori.findOne({_id: this.id}).state;
                this.start();
            });
        } else if (this.state === 0) {
            let next_break_duration = this.getNextBreakDuration(),
                end = Timer.computeEndDate(this.timer.duration),
                break_end = Timer.computeEndDate(next_break_duration, end);

            Meteor.call('pomodori.update', {
                _id: this.id,
                end: end,
                break_end: break_end,
                description: pomodoro_description,
                state: 1 // Running
            }, (error, result) => {
                if (result && !this.timer.is_running) {
                    this.timer.start();
                } else if (error) {
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
        this.id = void 0;
    }

    finishPomodoro() {
        Meteor.call('pomodori.markBreak', this.id);
        this.counter.inc();
        this.startBreak();
    }

    startBreak() {
        this.timer.set({miliseconds: this.getBreakDuration()});
        this.is_break = true;
        this.timer.reset();
        this.timer.start();
    }

    getBreakDuration(pomodoro_count=this.counter.count.get()) {
        let time = this.settings.break,
            is_long_break = pomodoro_count % this.settings.pomodori_before_long_break === 0;

        if (is_long_break) {
            time = this.settings.long_break;
        }

        return Timer.getTotalMiliseconds(time);
    }

    getNextBreakDuration() {
        let next_pomodoro_count = this.counter.count.get() + 1;
        return this.getBreakDuration(next_pomodoro_count);
    }

    finishBreak() {
        this.timer.set(this.settings.pomodoro);
        this.is_break = false;
        this.timer.reset();
        Meteor.call('pomodori.markDone', this.id);
        this.id = void 0;
    }

    static getUnfinishedIfExists() {
        let pomodori = Pomodoro.fetchIncomplete();
        if (!pomodori.length) return;

        for (let p of pomodori) {
            let is_running = p.break_end - new Date() > Timer.epsilon();
            if (is_running) {
                return p;
            } else {
                console.log(p, p.break_end - new Date());
                console.log('yopta')
                Meteor.call('pomodori.markDone', p._id);
            }
        }
    }

    static fetchIncomplete() {
        // Find running or breakRunning pomodori
        return Pomodori.find({state: {$in: [1, 2]}}).fetch();
    }

    static getCompletedTodayCount() {
        let start_date = new Date(),
            end_date = new Date();

        start_date.setHours(0, 0, 0, 0);
        end_date.setHours(23, 59, 59, 999);

        return Pomodori.find({
            $and: [
                {end: {$gte: start_date}},
                {end: {$lte: end_date}},
                {state: {$gte: 2}}
            ]
        }).count();
    }
}
