import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './methods.js';


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
