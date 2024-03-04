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
    }
    preload() {
    }
    init() {}
    create() {
        setScaleFactor.call(this, true);
        this.emitter = EventEmitter.getObj();
        this.emitter.on('game:replay', this.replayGame.bind(this))
        this.emitter.on('game:skip', this.calculateScore.bind(this));


        this.BGGr = this.add.graphics();
        this.BGGr.fillStyle(0xffffff, 1.0);
        this.BGGr.fillRect(0,0,this.c_w, this.c_h)

        this.BG= this.add.image(this.c_w*.5, this.extraTop + 300*this.scaleFact, 'BG')
        .setOrigin(0.5, 0)
        .setScale((this.c_w-this.extraLeftPer)*.00025);


        this.header= new Header(this);
        this.header.setUp();
        this.header.init();


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

        this.bin= new Bin(this);
        this.bin.setUp();
        this.bin.init();

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
    }
    calculateScore(){
        Global.scoreTotal=0;
        Object.keys(Global.crateData).forEach((key) => {
            if(Global.crateData[key]['filledBottles']){
                Global.scoreTotal += Global.crateData[key]['filledBottles'].length*60;
            }
        });
        this.renderer.snapshot(image => {

         
            const snap = this.textures.createCanvas('snap', image.width, image.height);

            snap.draw(0, 0, image);

            const base64 = snap.canvas.toDataURL();


            let img = new Image();
            img.onload = async function() {
                let canvas = document.createElement('canvas');
                canvas.width =  image.width/2;
                canvas.height =  image.height/2;
                let ctx = canvas.getContext('2d');
    
                ctx.drawImage(img, 0, 0, image.width/2, image.height/2);
                let resizedBase64 = canvas.toDataURL('image/jpeg'); // Change to 'image/png' for PNG format

                await saveImage(resizedBase64);
       
            };
            img.src = base64;

           
        }, 'image/jpeg');

       

    }
    replayGame(){
        this.emitter.emit('emitter:reset');
        EventEmitter.kill();
        this.scene.start("Game")
    }
    onCrateSelected(){

    }
}