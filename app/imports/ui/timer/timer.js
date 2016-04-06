import { Template } from 'meteor/templating';
import { Timer } from '../../timer/Timer.js';

import './timer.html';


Template.timer.helpers({
    hours: 0,
    minutes: 0,
    seconds: 0,
    timer_separator: ':'
});
