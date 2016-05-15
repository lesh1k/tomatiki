import { Meteor } from 'meteor/meteor';
import { Pomodori } from './pomodori.js';


Meteor.methods({
    'pomodori.createNew'() {
        let new_pomodoro = Pomodori.findOne({state: 0});
        if (new_pomodoro) {
            return new_pomodoro._id;
        }

        return Pomodori.insert({
            end: new Date(),
            break_end: new Date(),
        });
    },
    'pomodori.update'({_id, end, break_end, description, state}) {
        return Pomodori.update(_id, {
            $set: {
                end: end,
                break_end: break_end,
                description: description,
                state: state,
            }
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
