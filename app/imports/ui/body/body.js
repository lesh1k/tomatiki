import { Template } from 'meteor/templating';

import './body.html';
import '../../timer/ui/timer.js';
import '../../counter/ui/counter.js';


Template.body.helpers({
    random_text: [
        {text: 'blabel'},
        {text: 'babel'},
        {text: 'parabobel'}
    ]
});
