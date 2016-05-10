import { Meteor } from 'meteor/meteor';
import { Pomodori } from '../pomodori.js';


Meteor.publish('pomodori', () => {
    return Pomodori.find();
});
