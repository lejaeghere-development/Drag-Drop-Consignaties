import EventEmitter from "./event-emitter";
import {
    Global
} from "./global";
import {
    setScaleFactor
} from "./scale_factor";

export default class Intro extends Phaser.GameObjects.Group {
    constructor(game) {
        super(game);
    }
    setUp() {
        setScaleFactor.call(this, false);
        this.emitter = EventEmitter.getObj();
        this.emitter.on('crate_selection:hide', this.hideCrateSelection.bind(this));
        this.emitter.on('crate_selection:enable', this.enableCrates.bind(this));
        this.emitter.on('game:resize', this.onResize.bind(this));
        this.emitter.on('game:skip', this.onSkip.bind(this));
        this.emitter.on('emitter:reset', () => {
            EventEmitter.kill();
        });
    }

    init() {

        this.isFirst= true;
        this.title = this.create(this.c_w * .5, this.c_h * .5 - 400 * this.scaleFact, 'items', 'title0000')
            .setDepth(1001)
            .setScale(this.scaleFact * .8);

       




    }

    enableCrates() {
        let slotAvailable= false;
         Object.keys(Global.crateData).forEach((key) => {
            if(Global.crateData[key]['status'] == 'empty'){
                slotAvailable= true;
            }
         })
         if(!slotAvailable) return false;


        Global.crateActivated = false;
        document.querySelector(".search_bottles").classList.remove("active");
        document.querySelector("#search-container").classList.remove("active");
        document.querySelectorAll(".search_bottles .bottle").forEach((bottle) => {
            bottle.classList.remove("active");
        });
        Global.selectedBottleType=null;
        this.subBG = this.create(this.c_w * .5, this.c_h * .5 - 100 * this.scaleFact, 'items', 'sub_bg0000')
        .setDepth(1001)
        .setScale(this.scaleFact * .85);

    this.introTxt = this.scene.make.text({
            x: this.subBG.x,
            y: this.subBG.y,
            text: `Selecteer hier het type krat`,
            origin: {
                x: 0.5,
                y: 0.5
            },
            style: {
                font: (Global.isMobile) ? '' + String(50 * this.scaleFact) + 'px greycliff-medium' : '' + String(50 * this.scaleFact) + 'px greycliff-medium',
                fill: '#0A657A',
                align: "center"
            }
        })
        .setDepth(1001)

    this.add(this.introTxt);
        if(this.isFirst){
            this.isFirst= false;
        }else{
            this.BG = this.scene.add.graphics();
            this.BG.fillStyle(0xffffff, 0.85);
            this.BG.fillRect(0, 0, this.c_w, this.c_h);
            this.BG.setDepth(1000)
            this.add(this.BG);
        }


        this.crate_6 = this.create(this.c_w * .5 - 1500 * this.scaleFact, this.c_h * .5 + 600 * this.scaleFact, 'items', 'crate_60000')
            .setInteractive({
                cursor: 'pointer',
                pixelPerfect: true
            })
            .setDepth(1000)
            .on('pointerdown', this.selectCrate.bind(this, 6, 'fixed'))
            .setScale(this.scaleFact * 1.2);

        this.crate_6_infoBG = this.create(this.c_w * .5 - 1500 * this.scaleFact, this.c_h * .5 + 800 * this.scaleFact, 'items', 'bottle_info_60000')
            .setDepth(1000)
            .setScale(this.scaleFact * 1.8);

        this.crate_6_infoTxt = this.scene.make.text({
                x: this.crate_6_infoBG.x,
                y: this.crate_6_infoBG.y - 25 * this.scaleFact,
                text: `Grote Flessen`,
                origin: {
                    x: 0.5,
                    y: 0.5
                },
                style: {
                    font: (Global.isMobile) ? '' + String(45 * this.scaleFact) + 'px greycliff-medium' : '' + String(45 * this.scaleFact) + 'px greycliff-medium',
                    fill: '#ffffff',
                    align: "center"
                }
            })
            .setDepth(1000)

        this.add(this.crate_6_infoTxt);



        this.crate_24 = this.create(this.c_w * .5 - 300 * this.scaleFact, this.c_h * .5 + 600 * this.scaleFact, 'items', 'crate_240000')
            .setInteractive({
                cursor: 'pointer',
                pixelPerfect: true
            })
            .setDepth(1000)
            .on('pointerdown', this.selectCrate.bind(this, 24, 'fixed'))
            .setInteractive({
                cursor: 'pointer'
            })
            .setScale(this.scaleFact * 1.2);

        this.crate_24_infoBG = this.create(this.c_w * .5 - 300 * this.scaleFact, this.c_h * .5 + 800 * this.scaleFact, 'items', 'bottle_info_240000')
            .setDepth(1000)
            .setScale(this.scaleFact * 1.8);

        this.crate_24_infoTxt = this.scene.make.text({
                x: this.crate_24_infoBG.x,
                y: this.crate_24_infoBG.y - 25 * this.scaleFact,
                text: `Kleine Flessen`,
                origin: {
                    x: 0.5,
                    y: 0.5
                },
                style: {
                    font: (Global.isMobile) ? '' + String(45 * this.scaleFact) + 'px greycliff-medium' : '' + String(45 * this.scaleFact) + 'px greycliff-medium',
                    fill: '#ffffff',
                    align: "center"
                }
            })
            .setDepth(1005)

        this.add(this.crate_24_infoTxt);


        this.crate_24_custom = this.create(this.c_w * .5 + 1200 * this.scaleFact, this.c_h * .5 + 600 * this.scaleFact, 'items', 'crate_240000')
            .setInteractive({
                cursor: 'pointer',
                pixelPerfect: true
            })
            .setDepth(1000)
            .on('pointerdown', this.selectCrate.bind(this, 24, 'custom'))
            .setInteractive({
                cursor: 'pointer'
            })
            .setScale(this.scaleFact * 1.2);


            this.infoIcon= this.create(this.crate_24_custom.x+this.crate_24_custom.width*this.crate_24_custom.scaleX*.4, this.crate_24_custom.y-450*this.scaleFact, 'items','infoBtn0000')
            .setScale(this.scaleFact)
            .setDepth(1000)
            .setInteractive({
                cursor: 'pointer'
            })
            .on('pointerdown', () => {
                this.emitter.emit('crate_info:show');
            })


        this.crate_24_custom_infoBG = this.create(this.c_w * .5 + 1200 * this.scaleFact, this.c_h * .5 + 800 * this.scaleFact, 'items', 'bottle_info_240000')
            .setDepth(1000)
            .setScale(this.scaleFact * 1.8);

        this.crate_24custom_infoTxt = this.scene.make.text({
                x: this.crate_24_custom_infoBG.x,
                y: this.crate_24_custom_infoBG.y - 25 * this.scaleFact,
                text: `Kleine flessen mixed`,
                origin: {
                    x: 0.5,
                    y: 0.5
                },
                style: {
                    font: (Global.isMobile) ? '' + String(45 * this.scaleFact) + 'px greycliff-medium' : '' + String(45 * this.scaleFact) + 'px greycliff-medium',
                    fill: '#ffffff',
                    align: "center"
                }
            })
            .setDepth(1005)

        this.add(this.crate_24custom_infoTxt);

     
    }
    selectCrate(bottles, crateType) {
        if(Global.popupActive) return false;
        
        Global.totalBottles = bottles;
        Global.crateType = crateType;


        this.clear(true, true);

        // alert("DS")
        Global.crateActivated = true;
        this.emitter.emit('crate:add_crate');
        this.emitter.emit('search:show');
        this.emitter.emit('crate_selection:hide');
    }
    hideCrateSelection() {
        this.emitter.emit('header:update_crate_status', 'change')
        this.setVisible(false);
    }
    onResize(){
        setScaleFactor.call(this, false);


        this.infoIcon && this.infoIcon.scene && (this.infoIcon.setScale(this.scaleFact).setPosition(this.crate_24_custom.x+this.crate_24_custom.width*this.crate_24_custom.scaleX*.4, this.crate_24_custom.y-450*this.scaleFact));
        this.title && this.title.scene && this.title.setPosition(this.c_w * .5, this.c_h * .5 - 400 * this.scaleFact)
        .setScale(this.scaleFact * .8);

        this.subBG && this.subBG.scene && this.subBG.setPosition(this.c_w * .5, this.c_h * .5 - 100 * this.scaleFact)
        .setScale(this.scaleFact * .85);

        this.introTxt && this.introTxt.scene && this.introTxt
        .setPosition(this.subBG.x, this.subBG.y)
        .setFontSize(50 * this.scaleFact);

        if(this.BG){
            this.BG.clear();
            this.BG.fillStyle(0xffffff, 0.85);
            this.BG.fillRect(0, 0, this.c_w, this.c_h)
        }

        this.crate_6 && this.crate_6.scene && this.crate_6.setPosition(this.c_w * .5 - 1500 * this.scaleFact, this.c_h * .5 + 600 * this.scaleFact)
        .setScale(this.scaleFact * 1.2);

        this.crate_6_infoBG && this.crate_6_infoBG.scene && this.crate_6_infoBG.setPosition(this.c_w * .5 - 1500 * this.scaleFact, this.c_h * .5 + 800 * this.scaleFact)
        .setScale(this.scaleFact * 1.8);

        this.crate_6_infoTxt && this.crate_6_infoTxt.scene && this.crate_6_infoTxt
        .setPosition(this.crate_6_infoBG.x, this.crate_6_infoBG.y - 25 * this.scaleFact)
        .setFontSize(50 * this.scaleFact);

        this.crate_24 && this.crate_24.scene && this.crate_24.setPosition(this.c_w * .5 - 300 * this.scaleFact, this.c_h * .5 + 600 * this.scaleFact)
        .setScale(this.scaleFact * 1.2);

        this.crate_24_infoBG && this.crate_24_infoBG.scene && this.crate_24_infoBG.setPosition(this.c_w * .5 - 300 * this.scaleFact, this.c_h * .5 + 800 * this.scaleFact)
        .setScale(this.scaleFact * 1.8);

        this.crate_24_infoTxt && this.crate_24_infoTxt.scene && this.crate_24_infoTxt
        .setPosition(this.crate_24_infoBG.x, this.crate_24_infoBG.y - 25 * this.scaleFact)
        .setFontSize(50 * this.scaleFact);

        this.crate_24_custom && this.crate_24_custom.scene && this.crate_24_custom.setPosition(this.c_w * .5 + 1200 * this.scaleFact, this.c_h * .5 + 600 * this.scaleFact)
            .setScale(this.scaleFact * 1.2);

            this.crate_24_custom_infoBG && this.crate_24_custom_infoBG.scene && this.crate_24_custom_infoBG.setPosition(this.c_w * .5 + 1200 * this.scaleFact, this.c_h * .5 + 800 * this.scaleFact)
            .setScale(this.scaleFact * 1.8);

            this.crate_24custom_infoTxt && this.crate_24custom_infoTxt.scene && this.crate_24custom_infoTxt
            .setPosition(this.crate_24_custom_infoBG.x, this.crate_24_custom_infoBG.y - 25 * this.scaleFact)
            .setFontSize(50 * this.scaleFact);

    }
    onSkip(){
        this.clear(true, true);
    }
}