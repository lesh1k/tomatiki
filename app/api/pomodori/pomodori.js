import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


let Schemas = {};

Schemas.Pomodoro = new SimpleSchema({
    started: {
        type: Date
    },
    ended: {
        type: Date
    }
});


export const Pomodori = new Meteor.Collection('pomodori');
Pomodori.attachSchema(Schemas.Pomodoro);
