import { Template } from 'meteor/templating';

import './body.html';
import '../timer/timer.js';
import '../timer/timer.html';

Template.body.helpers({
    random_text: [
        {text: 'blabel'},
        {text: 'babel'},
        {text: 'parabobel'}
    ]
});
