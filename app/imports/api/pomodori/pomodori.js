import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


let Schemas = {};

Schemas.Pomodoro = new SimpleSchema({
    end: {
        type: Date
    },
    break_end: {
        type: Date
    },
    is_running: {
        type: Boolean,
        defaultValue: true
    },
    is_done: {
        type: Boolean,
        defaultValue: false
    },
    description: {
        type: String,
        max: 200,
        optional: true,
        // defaultValue: ''
    }
});


export const Pomodori = new Mongo.Collection('pomodori');
Pomodori.attachSchema(Schemas.Pomodoro);

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
