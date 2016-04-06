import { Template } from 'meteor/templating';

import './body.html';
import '../../timer/ui/timer.js';
import '../../timer/ui/timer.html';

Template.body.helpers({
    random_text: [
        {text: 'blabel'},
        {text: 'babel'},
        {text: 'parabobel'}
    ]
});
