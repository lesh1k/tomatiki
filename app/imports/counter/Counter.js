export class Counter {

    constructor({count=0}={}) {
        this.count = count;
    }

    increment({ amount=1 }={}) {
        this.count += amount;
    }

    decrement({ amount=1 }={}) {
        this.count -= amount;
    }
}
