import { ReactiveVar } from 'meteor/reactive-var';


export class Counter {

    constructor(count=0) {
        this.count = new ReactiveVar(count);
    }

    inc(amount=1) {
        this.count.set(this.count.get() + amount);
    }

    dec(amount=1) {
        this.count.set(this.count.get() - amount);
    }
}
