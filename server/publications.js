Meteor.publish('pomodori', function() {
    return Pomodori.find();
});
