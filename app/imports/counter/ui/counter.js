import { Template } from 'meteor/templating';

import { Counter } from '../Counter.js';
import './counter.html';

Template.counter.onCreated(function() {
    this.counter = new Counter();
});

Template.counter.helpers({
    count: function() {
        let tmpl = Template.instance();
        return tmpl.counter.count;
    }
});
