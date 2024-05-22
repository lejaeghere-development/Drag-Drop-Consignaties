import { sendEmail } from "../objects/api";
import { shuffle } from "../objects/array-util";
import { Global } from "../objects/global";
import { AppLoader } from "../objects/loader_2";
import { setScaleFactor } from "../objects/scale_factor";
const jsonData = require('../../bottle-data/bottles.json');

export default class Loader extends Phaser.Scene {
    constructor() {
        super({
            key:"Loader"
        });
    }
    init() {
        setScaleFactor.call(this, true);
        this.appLoader = new AppLoader(this);
        this.appLoader.init(
            `${this.s3Prefix}/LoaderIcon.png`,
            "greycliff-bold"
          );
    }
    preload(v) {
      let asset_version = "4.0.0";
      this.load.image('BG', './assets/BG.png?v=1.0');
      this.load.atlas('items', `./assets/items.png?v=${asset_version}`, `./assets/items.json?v=${asset_version}`);
       this.load.plugin('rexdropshadowpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdropshadowpipelineplugin.min.js', true);    
      jsonData.forEach((json) => {
        this.load.image(`${json['bottle_key']}_single`, `./assets/bottles/singles/${json['bottle_key']}.png?v=1.0`);
        this.load.image(`${json['bottle_key']}_group`, `./assets/bottles/group/${json['bottle_key']}.png?v=1.0`);
      });
      
    }
    create(){
        this.scene.start("Game");
    }
}