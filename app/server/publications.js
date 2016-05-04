import { Meteor } from 'meteor/meteor';


Meteor.publish('pomodori', function() {
    return Pomodori.find();
});
