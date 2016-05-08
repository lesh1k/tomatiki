import { ReactiveVar } from 'meteor/reactive-var';


export class Counter {

    constructor({count=0}={}) {
        this.count = new ReactiveVar(count);
    }

    increment({ amount=1 }={}) {
        this.count.set(this.count.get() + amount);
    }

    decrement({ amount=1 }={}) {
        this.count.set(this.count.get() - amount);
    }
}
