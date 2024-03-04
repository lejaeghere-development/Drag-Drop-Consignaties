import EventEmitter from "./event-emitter";
import {
    Global
} from "./global";
import {
    setScaleFactor
} from "./scale_factor";

export default class Header extends Phaser.GameObjects.Group {
    constructor(game) {
        super(game);
    }
    setUp() {
        setScaleFactor.call(this, false);
        this.emitter = EventEmitter.getObj();
        this.emitter.on('header:update_crate', this.updateCrate.bind(this));
        this.emitter.on('header:show_skip', this.showSkip.bind(this));
        this.emitter.on('game:resize', this.onResize.bind(this));
        this.emitter.on('crate:add_crate', this.onCrateAdd.bind(this))
        this.emitter.on('header:update_crate_status', this.updateCrateBtnStatus.bind(this));
        this.emitter.on('header:update_skip_frame', this.updateSkipFrame.bind(this));
        this.emitter.on('header:show_ready_info', this.showReadyInfo.bind(this));
        this.emitter.on('header:hide_ready_info', this.hideReadyInfo.bind(this));

        this.emitter.on('game:show', this.showGame.bind(this));
        this.emitter.on('emitter:reset', () => {
            EventEmitter.kill();
        });

        Global.cratesCreated=0;
        this.readyInfoShown= false;
        document.querySelector("#skip_confirm #confirm").addEventListener("click", this.skipGame.bind(this));
        document.querySelector("#skip_confirm #cancel").addEventListener("click", this.cancelSkip.bind(this));


        document.querySelector("#ready_info #confirm").addEventListener("click", this.skipGame.bind(this));
        document.querySelector("#ready_info #cancel").addEventListener("click", this.cancelReadyInfo.bind(this));
    }

    init() {
        this.BG = this.scene.add.graphics();
        this.BG.fillStyle(0xffffff, 1);
        this.BG.fillRect(this.extraLeftPer, this.extraTop, (this.c_w - this.extraLeftPer) * 0.2, 300 * this.scaleFact);
        this.BG.fillStyle(0x55A383, 1)
        this.BG.fillRect((this.c_w - this.extraLeftPer) * 0.2, this.extraTop, (this.c_w - this.extraLeftPer) * 0.8, 300 * this.scaleFact);
        this.add(this.BG);

        this.logo = this.create(this.extraLeftPer + (this.c_w - this.extraLeftPer) * 0.1, 150 * this.scaleFact+this.extraTop, 'items', 'logo0000')
            // .setVisible(false)
            .setScale(this.scaleFact * 1.2);

        this.crateCreatedBG = this.create(this.extraLeftPer + (this.c_w - this.extraLeftPer) * 0.2 + 200 * this.scaleFact, 150 * this.scaleFact+this.extraTop, 'items', 'crate_filled_bg0000')
            .setScale(this.scaleFact * 1.5);

        this.crateCreatedTxt = this.scene.make.text({
                x: this.crateCreatedBG.x - 60 * this.scaleFact,
                y: this.crateCreatedBG.y + 5 * this.scaleFact,
                text: `0`,
                origin: {
                    x: 0.5,
                    y: 0.5
                },
                style: {
                    font: (Global.isMobile) ? '' + String(70 * this.scaleFact) + 'px Montserrat-Bold' : '' + String(70 * this.scaleFact) + 'px Montserrat-Bold',
                    fill: '#ffffff',
                    align: "center"
                }
            })
            .setDepth(1005)

        this.add(this.crateCreatedTxt);

        this.crateCreatedHead = this.scene.make.text({
                x: this.crateCreatedBG.x + 150 * this.scaleFact,
                y: this.crateCreatedBG.y + 5 * this.scaleFact,
                text: `Crates Stacked`,
                origin: {
                    x: 0,
                    y: 0.5
                },
                style: {
                    font: (Global.isMobile) ? '' + String(70 * this.scaleFact) + 'px Montserrat-Regular' : '' + String(70 * this.scaleFact) + 'px Montserrat-Regular',
                    fill: '#ffffff',
                    align: "center"
                }
            })
            .setDepth(1005)

        this.add(this.crateCreatedHead);


        this.addOrChangeCrate = this.create(this.c_w-this.extraLeftPer - 300*this.scaleFact, 150 * this.scaleFact+this.extraTop, 'items', 'changeCrate0000')
        .setScale(this.scaleFact * 0.75)
        .setInteractive({
            cursor: 'pointer'
        })
        .setVisible(false)
        .on('pointerdown', this.triggerCrate.bind(this))
        .on('pointerover', this.onHover.bind(this, 'addOrChangeCrate', 'changeCrate_10000'))
        .on('pointerout', this.onHover.bind(this, 'addOrChangeCrate', 'changeCrate0000'))

        this.skipBtn = this.create(this.c_w-this.extraLeftPer - 800*this.scaleFact, 150 * this.scaleFact+this.extraTop, 'items', 'skip0000')
        .setScale(this.scaleFact * 0.75)
        .setInteractive({
            cursor: 'pointer'
        })
        .setVisible(false)
        .on('pointerdown', this.onSkipPress.bind(this))
        .on('pointerover', this.onHover.bind(this, 'skipBtn', 'skip_10000'))
        .on('pointerout', this.onHover.bind(this, 'skipBtn', 'skip0000'))

        this.onResize();

    }
    
    updateSkipFrame(btnStatus){
        this.skipBtn.setFrame(btnStatus == 'skip'?'skip0000':'ready0000')
        .on('pointerover', this.onHover.bind(this, 'skipBtn', btnStatus == 'skip'?'skip_10000':'ready_10000'))
        .on('pointerout', this.onHover.bind(this, 'skipBtn', btnStatus == 'skip'?'skip0000':'ready0000'))

    }
    triggerCrate(){
        if(Global.popupActive) return false;
        this.emitter.emit('bottle:remove');
        this.emitter.emit('crate:remove');
        this.emitter.emit('crate_selection:enable');
    }
    updateCrateBtnStatus(status){
        if(status == 'add'){
            this.addOrChangeCrate.setFrame('addCrate0000');
            this.addOrChangeCrate
            .on('pointerover', this.onHover.bind(this, 'addOrChangeCrate', 'addCrate_10000'))
            .on('pointerout', this.onHover.bind(this, 'addOrChangeCrate', 'addCrate0000'))
        }else if(status == 'change'){
            this.addOrChangeCrate.setFrame('changeCrate0000');
            this.addOrChangeCrate
            .on('pointerover', this.onHover.bind(this, 'addOrChangeCrate', 'changeCrate_10000'))
            .on('pointerout', this.onHover.bind(this, 'addOrChangeCrate', 'changeCrate0000'))
        }
    }
   /*  showOrHideUI(status){
        this.setVisible(status)
    } */
    updateCrate(toAdd){
        Global.cratesCreated += toAdd;
        this.crateCreatedTxt.setText(Global.cratesCreated)
    }
    onCrateAdd(){
        this.addOrChangeCrate.setVisible(true)
    }
    showReadyInfo(){
        if(!this.readyInfoShown){
            this.readyInfoShown= true;

            document.querySelector("#ready_info").classList.add("active");
            Global.popupActive= true;
        }
    }
    hideReadyInfo(){
        // this.readyInfoShown= false;
        document.querySelector("#ready_info").classList.remove("active");
        Global.popupActive= false;
    }
    onSkipPress(){
        if(Global.popupActive) return false;

        if(this.skipBtn.frame.name.indexOf("skip") != -1){
            document.querySelector("#skip_confirm").classList.add("active");
            Global.popupActive= true;
        }else{
            this.skipGame();
        }
    }
    skipGame(){
        Global.popupActive= false;
        this.emitter.emit('game:skip');
        this.skipBtn.setVisible(false);
        this.addOrChangeCrate.setVisible(false);
        document.querySelector("#skip_confirm").classList.remove("active")
        document.querySelector("#ready_info").classList.remove("active");
        document.querySelector("#ready_info").classList.remove("active");
        this.hideSkip();
    }
    showGame(){
        this.skipBtn.setVisible(true);
        this.addOrChangeCrate.setVisible(true);
    }
    cancelReadyInfo(){
        document.querySelector("#ready_info").classList.remove("active");
        Global.popupActive= false;
    }
    cancelSkip(){
        Global.popupActive= false;
        document.querySelector("#skip_confirm").classList.remove("active")

    }
    onHover(key, frame){
        this[key].setFrame(frame);
    }
    showSkip(){
        this.skipBtn.setVisible(true)
    }
    hideSkip(){
        this.skipBtn.setVisible(false);
    }
    onResize(){
        setScaleFactor.call(this, false);

        this.BG.clear();
        this.BG.fillStyle(0xffffff, 1);
        this.BG.fillRect(this.extraLeftPer, this.extraTop, (this.c_w) * 0.2- this.extraLeftPer/2, 300 * this.scaleFact);
        this.BG.fillStyle(0x55A383, 1)
        this.BG.fillRect((this.c_w) * 0.2+ this.extraLeftPer/2, this.extraTop, (this.c_w) * 0.8-this.extraLeftPer, 300 * this.scaleFact);
        this.add(this.BG);

        this.logo.setPosition(this.extraLeftPer*.75 + (this.c_w ) * 0.1, 150 * this.scaleFact+this.extraTop)
        .setScale(this.scaleFact * 1.2);

        this.crateCreatedBG.setPosition(/* this.extraLeftPer + */ (this.c_w ) * 0.2+ this.extraLeftPer/2 + 200 * this.scaleFact, 150 * this.scaleFact+this.extraTop)
        .setScale(this.scaleFact * 1.5);

        this.crateCreatedTxt
        .setPosition(this.crateCreatedBG.x - 60 * this.scaleFact, this.crateCreatedBG.y + 5 * this.scaleFact)
        .setFontSize(70 * this.scaleFact);

        this.crateCreatedHead
        .setPosition(this.crateCreatedBG.x + 150 * this.scaleFact, this.crateCreatedBG.y + 5 * this.scaleFact)
        .setFontSize(70 * this.scaleFact);

        this.addOrChangeCrate.setPosition(this.c_w-this.extraLeftPer - 300*this.scaleFact, 150 * this.scaleFact+this.extraTop)
        .setScale(this.scaleFact * 0.75)

        this.skipBtn.setPosition(this.c_w-this.extraLeftPer - 800*this.scaleFact, 150 * this.scaleFact+this.extraTop)
        .setScale(this.scaleFact * 0.75)
    }
}