import EventEmitter from "./event-emitter";
import {
    Global
} from "./global";
import {
    setScaleFactor
} from "./scale_factor";

export default class Bin extends Phaser.GameObjects.Group {
    constructor(game) {
        super(game);
    }
    setUp() {
        setScaleFactor.call(this, false);
        this.emitter = EventEmitter.getObj();
        this.emitter.on('bin:check_on_drag', this.checkOnDrag.bind(this));
        this.emitter.on('bin:reset_bin', this.closeLid.bind(this));
        this.emitter.on('game:skip', this.hideBin.bind(this));
        this.emitter.on('crate_selection:hide', this.showOrHideUI.bind(this, true));
        // this.emitter.on('crate_selection:enable', this.showOrHideUI.bind(this, false));
        this.emitter.on('game:resize', this.onResize.bind(this));
        this.emitter.on('game:show', this.showGame.bind(this));
        this.emitter.on('emitter:reset', () => {
            EventEmitter.kill();
        });
    }

    init() {
        this.bin= this.create(this.c_w-this.extraLeftPer-200*this.scaleFact, this.c_h-this.extraTop-300*this.scaleFact, 'items', 'bin0000')
        .setScale(this.scaleFact*.4)

        this.setVisible(false);
    }
    showGame(){
        this.bin.setVisible(true)
    }
    showOrHideUI(status){
        this.setVisible(status)
    }
    checkOnDrag(bound, frame, overlapMul) {
        if (!Global.crateActivated) return false;

        // if (bottleFrame.indexOf("crate") !== -1) return false;

        var boundsA = this.bin.getBounds();
        var boundsB = bound;
        let overlapCheck = Phaser.Geom.Intersects.GetRectangleIntersection(boundsA, boundsB);
       
        if (overlapCheck.width >= boundsA.width*overlapMul && overlapCheck.height >= boundsB.height * .15) {
            this.openLid();
        } else {
            this.closeLid();
        }
    }
    hideBin(){
        this.bin.setVisible(false);
    }
    openLid(){ this.bin.setFrame('bin_opened0000'); Global.canDispose= true; }
    closeLid(){ this.bin.setFrame('bin0000'); Global.canDispose= false; }
    onResize(){
        setScaleFactor.call(this, false);
        
        this.bin.setPosition(this.c_w-this.extraLeftPer-200*this.scaleFact, this.c_h-this.extraTop-300*this.scaleFact)
        .setScale(this.scaleFact*.4)
    }
}