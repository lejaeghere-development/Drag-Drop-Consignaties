import { Global } from "./global";

let obj=null;
let indexRun=0;
export default class EventEmitter extends Phaser.Events.EventEmitter{
 
    constructor(){
        super();
    }
    static getObj(){
        if(obj===null){
            obj=new EventEmitter();
            Global.emitter= obj;
        }
        return obj;
    }
    subsribe(type,fn){
        this.addListener(type,fn);
    }
    static kill(){
       
        if(obj){
            obj.removeAllListeners();
            obj.shutdown();
            obj=null;
        }
        // obj.destroy();
    }
}