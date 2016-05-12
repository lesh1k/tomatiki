import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './methods.js';


let Schemas = {};

Schemas.Pomodoro = new SimpleSchema({
    end: {
        type: Date,
        label: 'Pomodoro End Date'
    },
    break_end: {
        type: Date,
        label: 'Pomodoro Break End Date'
    },
    state: {
        type: Number,
        min: -1,
        max: 3,
        defaultValue: 0,
        label: 'Pomodoro State'
    },
    description: {
        type: String,
        max: 200,
        optional: true,
        label: 'Pomodoro Description'
        // defaultValue: ''
    }
});


export const Pomodori = new Mongo.Collection('pomodori');
Pomodori.attachSchema(Schemas.Pomodoro);
