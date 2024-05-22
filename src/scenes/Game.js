import Bin from "../objects/Bin";
import Bottles from "../objects/Bottles";
import Crates from "../objects/Crate";
import Crate from "../objects/Crate";
import Header from "../objects/Header";
import Intro from "../objects/Intro";
import Rack from "../objects/Rack";
import Register from "../objects/Register";
import Score from "../objects/Score";
import SearchBox from "../objects/SearchBox";
import { saveImage } from "../objects/api";
import EventEmitter from "../objects/event-emitter";
import { Global } from "../objects/global";
import { setScaleFactor } from "../objects/scale_factor";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "Game"
        });
       
        document.querySelector("#crate_info #cancel").addEventListener("click", this.hideCrateInfo.bind(this))
        document.querySelector("#crate_info2 #cancel").addEventListener("click", this.hideCrateInfo2.bind(this))
    }
    preload() {
    }
    init() {}
    create() {
        
        setScaleFactor.call(this, true);
        this.emitter = EventEmitter.getObj();
        this.emitter.on('game:replay', this.replayGame.bind(this))
        this.emitter.on('game:skip', this.calculateScore.bind(this));
        this.emitter.on('crate_info:show', this.showCrateInfo.bind(this));
        this.emitter.on('crate_info:hide', this.hideCrateInfo.bind(this));

        this.emitter.on('crate_info2:show', this.showCrateInfo2.bind(this));
        this.emitter.on('crate_info2:hide', this.hideCrateInfo2.bind(this));
        

        this.BGGr = this.add.graphics();
        this.BGGr.fillStyle(0xffffff, 1.0);
        this.BGGr.fillRect(0,0,this.c_w, this.c_h)

      /*   this.BG= this.add.image(this.c_w*.5, this.extraTop + 300*this.scaleFact, 'BG')
        .setOrigin(0.5, 0)
        .setScale((this.c_w-this.extraLeftPer)*.00025); */


        this.header= new Header(this);
        this.header.setUp();
        this.header.init();


        this.bin= new Bin(this);
        this.bin.setUp();
        this.bin.init();

        this.rack= new Rack(this);
        this.rack.setUp();
        this.rack.init();



        this.intro= new Intro(this);
        this.intro.setUp();
        this.intro.init();

        this.searchBox= new SearchBox(this);
        this.searchBox.setUp();
        this.searchBox.init();


    

        this.crates= new Crates(this);
        this.crates.setUp();
        this.crates.init();

        this.bottles= new Bottles(this);
        this.bottles.setUp();
        this.bottles.init();

   

        this.register= new Register(this);
        this.register.setUp();
        this.register.init();


        this.score= new Score(this);
        this.score.setUp();
        this.score.init();

        this.emitter.emit('crate_selection:enable');
        // 

        this.scale.on('resize', () => {
            this.emitter.emit('game:resize');
  
            setScaleFactor.call(this, true);
        });

        /* setTimeout(() => {
            this.emitter.emit('game:skip');
        }, 1000) */

        // this.emitter.emit('game:skip');

        /* setTimeout(() => {
            this.emitter.emit('game:skip');
        }, 2000) */


        // this.emitter.emit('game:skip');
    }

    showCrateInfo(){
        if(Global.popupActive) return false;

        Global.popupActive= true;
        document.querySelector("#crate_info").classList.add("active");
    }
    showCrateInfo2(){
        if(Global.popupActive) return false;

        Global.popupActive= true;
        document.querySelector("#crate_info2").classList.add("active");
    }
    hideCrateInfo(){
        Global.popupActive= false;
        document.querySelector("#crate_info").classList.remove("active");
    }
    hideCrateInfo2(){
        Global.popupActive= false;
        document.querySelector("#crate_info2").classList.remove("active");
    }
    calculateScore(){
        let combination= {}
        Object.keys(Global.crateData).forEach((key) => {
            combination[key]= Global.crateData[key]['filledBottles']
        })
        console.log(combination,' combination')
        setTimeout(() => {
            Global.scoreTotal=0;
        Object.keys(Global.crateData).forEach((key) => {
            if(Global.crateData[key]['filledBottles']){
                Global.scoreTotal += Global.crateData[key]['filledBottles'].length*60;
            }
        });
        console.log(Global.crateData,'Global.crateData')
        this.startX= (this.c_w - this.extraLeftPer - this.extraTop - (1340 + 600 + 1300) * this.scaleFact);
        // console.log(this.startX,this.c_w-this.startX/2-100*this.scaleFact,'__width');
        this.renderer.snapshotArea(this.startX, (this.extraTop+300 * this.scaleFact), (this.c_w-this.startX), (this.c_h-this.extraTop-300 * this.scaleFact), image => {

            let snapKey= `snap${++Global.snapCnt}`;
            console.log(snapKey,'snapKey')
            const snap = this.textures.createCanvas(snapKey, image.width, image.height);

            snap.draw(0, 0, image);

            const base64 = snap.canvas.toDataURL();


            let img = new Image();
            img.onload = async function() {
                let canvas = document.createElement('canvas');
                canvas.width =  image.width;
                canvas.height =  image.height;
                let ctx = canvas.getContext('2d');
    
                ctx.drawImage(img, 0, 0, image.width, image.height);
                let resizedBase64 = canvas.toDataURL('image/jpeg'); // Change to 'image/png' for PNG format

                await saveImage(resizedBase64);
       
            };
            img.src = base64;

           
        }, 'image/jpeg', 1.0);
        }, 250)

       

    }
    replayGame(){
        this.emitter.emit('emitter:reset');
        EventEmitter.kill();
        this.scene.start("Game")
    }
    onCrateSelected(){

    }
}