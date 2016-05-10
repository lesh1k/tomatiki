import { Meteor } from 'meteor/meteor';
import { Pomodori } from './pomodori.js';


Meteor.methods({
    'pomodori.insert'({end, break_end, description, is_running, is_done}) {
        return Pomodori.insert({
            end: end,
            break_end: break_end,
            description: description,
            is_running: is_running,
            is_done: is_done,
        });
    },
    'pomodori.markDone'(id) {
        return Pomodori.update(id, {
            $set: {
                is_done: true
            }
        });
    },
    'pomodori.markNotRunning'(id) {
        return Pomodori.update(id, {
            $set: {
                is_running: false
            }
        });
    }
});
