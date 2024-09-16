import EventEmitter from "node:events";

const emit = new EventEmitter();

//task 1

for(let i =0; i < 3; i ++){
    emit.on('click', ()=>{console.log(`t1 message from listener #${i}`)});
}

emit.emit('click');

console.log("===================");

// task 2

for(let i =0; i < 3; i ++){
    emit.on('error', ()=>{console.log(`t2 message from listener #${i}`)});
}

function forRemoving() {
    console.log(`t2 message from listener to remove`);
}

emit.on('error', forRemoving);
emit.emit("error");

console.log("===================");

emit.removeListener('error',forRemoving);

emit.emit('error');
console.log("===================");

//task 3

class Dice{
    static sides = 6;

    static emitter = emit;

    static roll(){
        this.emitter.emit('rolled', 
             Math.floor(Math.random() * this.sides) + 1 );
    }

    static subscribe (subscriber){
        try{if(typeof subscriber.roll === "function"){
            this.emitter.on('rolled', (diceNumber) => subscriber.roll(diceNumber));
        }
        else{
            console.log(typeof subscriber.roll)
            throw (`Unable to subscribe.\nSubscriber does not implement required method 'roll'.\n Subscriber class: '${subscriber.constructor.name}'`)
        }
        }
        catch(e){
            console.log(e);
        }
    }
    
}

class Subscriber{
    static seq_number = 0;
    constructor(){
        this.seq_number = ++Subscriber.seq_number;
    }
    roll(diceNumber){
        console.log(`Subscriber #${this.seq_number} received number:${diceNumber} `)
    }
}

const subscriber1 = new Subscriber();
const subscriber2 = new Subscriber();

Dice.subscribe(subscriber1);
Dice.subscribe(subscriber2);

Dice.roll();

console.log("===================");

//task 4
class Logger {
    static emitter = emit;
    static logError(){
        this.emitter.emit('log_error', 'Error message');
    }
    static subscribeError(subscriber){
        try{
            if(this.#checkSubscriber(subscriber)) this.emitter.on('log_error', (message => {subscriber.log(message)}));
            else throw(`Unable to subscribe for event 'log_error'.\nSubscriber does not implement required method 'log'.\n Subscriber class: '${subscriber.constructor.name}'`)
        }
        catch(e){
            console.log(e);
        }
    }
    static logWarning(){
        this.emitter.emit('log_warning', 'Warning message');
    }
    static subscribeWarning(subscriber){
        try{
            if(this.#checkSubscriber(subscriber)) this.emitter.on('log_warning', (message => {subscriber.log(message)}));
            else throw(`Unable to subscribe for event 'log_warning'.\nSubscriber does not implement required method 'log'.\n Subscriber class: '${subscriber.constructor.name}'`)
        }
        catch(e){
            console.log(e);
        }
    }
    static logInformation(){
        this.emitter.emit('log_information', 'Information message');
    }
    static subscribeInformation(subscriber){
        try{
            if(this.#checkSubscriber(subscriber)) this.emitter.on('log_information', (message => {subscriber.log(message)}));
            else throw(`Unable to subscribe for event 'log_information'.\nSubscriber does not implement required method 'log'.\n Subscriber class: '${subscriber.constructor.name}'`)
        }
        catch(e){
            console.log(e);
        }
    }
    static #checkSubscriber(subscriber){
        return typeof subscriber.log === "function" ? true : false;
    }
}

class LogSubscriber {
    static seq_number =1;
    constructor(){
        this.seq_number = LogSubscriber.seq_number++;
    }
    log(message){
        console.log(`Logger #${this.seq_number}: ${message}`);
    }
}

const s1 = new LogSubscriber();
const s2 = new LogSubscriber();
const s3 = new LogSubscriber();

Logger.subscribeError(s1);
Logger.subscribeError(s2);
Logger.subscribeError(s3);

Logger.subscribeInformation(s2);
Logger.subscribeInformation(s1);

Logger.subscribeWarning(s3);
Logger.subscribeWarning(s1);

Logger.logError();
Logger.logInformation();
Logger.logWarning();