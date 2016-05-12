import { Meteor } from 'meteor/meteor';
import { Pomodori } from './pomodori.js';


Meteor.methods({
    'pomodori.insert'({end, break_end, description, state}) {
        return Pomodori.insert({
            end: end,
            break_end: break_end,
            description: description,
            state: state,
        });
    },
    'pomodori.markBreak'(id) {
        return Pomodori.update(id, {
            $set: {
                state: 2
            }
        });
    },
    'pomodori.markDone'(id) {
        return Pomodori.update(id, {
            $set: {
                state: 3
            }
        });
    },
    'pomodori.markReset'(id) {
        return Pomodori.update(id, {
            $set: {
                state: -1
            }
        });
    }
});
