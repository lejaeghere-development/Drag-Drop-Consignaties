import { Global } from "../objects/global";
import { setScaleFactor } from "../objects/scale_factor";

export default class PreLoader extends Phaser.Scene {
    constructor() {
        super({ key: "PreLoader" });
    }
    init() {}
    onProgress(v) {

    }
    preload() {
        let asset_version = "1.0.0";

    }
    create() {
        setScaleFactor.call(this, true);

        this.loadGame();
    }
 
    loadGame(){
        
        Global.curr_state="preloader";
        Global.curr_state_obj= this;
        window.addEventListener("resize", Global.onResize);
        Global.onResize();
      
    }
    proceedNext(){
        Global.curr_state="";
        Global.curr_state_obj=null;
        this.scene.start("Loader");
    }
}