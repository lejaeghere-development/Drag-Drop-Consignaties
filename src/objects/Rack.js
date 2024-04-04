import EventEmitter from "./event-emitter";
import {
    Global
} from "./global";
import {
    setScaleFactor
} from "./scale_factor";
const jsonData = require('../../bottle-data/bottles.json');


export default class Rack extends Phaser.GameObjects.Group {
    constructor(game) {
        super(game);

        document.querySelector("#delete_confirm #confirm").addEventListener("click", this.deleteSecondRack.bind(this));
        document.querySelector("#delete_confirm #cancel").addEventListener("click", this.hideDeleteConfirm.bind(this));

    }
    setUp() {
        setScaleFactor.call(this, false);
        this.emitter = EventEmitter.getObj();
        this.emitter.on('rack:check_on_drag', this.checkOnDrag.bind(this))
        this.emitter.on('rack:hide_highlight', this.hideHighlight.bind(this))
        this.emitter.on('rack:check_to_place', this.checkToPlace.bind(this))
        this.emitter.on('rack:reset_position', this.resetCrateOnRack.bind(this))
        this.emitter.on('game:skip', this.onSkip.bind(this));
        this.emitter.on('game:resize', this.onResize.bind(this));
        this.emitter.on('game:show', this.showGame.bind(this))
        this.emitter.on('crate_selection:hide', this.showOrHideUI.bind(this, true));
        this.emitter.on('emitter:reset', () => {
            EventEmitter.kill();
        });
        // this.emitter.on('crate_selection:enable', this.showOrHideUI.bind(this, false));

        // this.rack1
        Global.crateData = {
            "rack1_left_1": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: -180,
                    y: -940
                }
            },
            "rack1_right_1": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: 180,
                    y: -940
                }
            },
            "rack1_left_2": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: -180,
                    y: -485
                }
            },
            "rack1_right_2": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: 180,
                    y: -485
                }
            },
            "rack1_left_3": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: -180,
                    y: -30
                }
            },
            "rack1_right_3": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: 180,
                    y: -30
                }
            },
            "rack1_left_4": {
                'status': 'taken',
                'filledBottles':null,
                'position': {
                    x: -180,
                    y: 425
                }
            },
            "rack1_right_4": {
                'status': 'taken',
                'filledBottles':null,
                'position': {
                    x: 180,
                    y: 425
                }
            },
            "rack2_left_1": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: -180,
                    y: -940
                }
            },
            "rack2_right_1": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: 180,
                    y: -940
                }
            },
            "rack2_left_2": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: -180,
                    y: -485
                }
            },
            "rack2_right_2": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: 180,
                    y: -485
                }
            },
            "rack2_left_3": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: -180,
                    y: -30
                }
            },
            "rack2_right_3": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: 180,
                    y: -30
                }
            },
            "rack2_left_4": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: -180,
                    y: 425
                }
            },
            "rack2_right_4": {
                'status': 'empty',
                'filledBottles':null,
                'position': {
                    x: 180,
                    y: 425
                }
            }
        }
        this.rackInfo = {
            'rack': 'rack1',
            'shelf': 4,
            'side': 'left'
        }
        this.placedCrates = [{
            'crate': [],
            'bottles': []
        }]
        this.matchShelfFound = false;
        this.isBigCrate = false;
        this.crateDragged = false;
    }

    init() {
        this.rack1 = this.create(this.c_w - this.extraLeftPer - this.extraTop/2 - (150 + 600 + 150) * this.scaleFact, this.c_h * .5 + 100 * this.scaleFact, 'items', 'rack0000')
            .setDepth(0)
            .setData('canShow', true)
            .setScale(this.scaleFact * 1.4);




        this.rack2 = this.create(this.c_w - this.extraLeftPer - this.extraTop - (1340 + 600 + 300) * this.scaleFact, this.c_h * .5 + 100 * this.scaleFact, 'items', 'rack0000')
            .setDepth(0)
            .setData('canShow', true)
            .setScale(this.scaleFact * 1.4);

    
        this.deleteBtn = this.create(this.c_w - this.extraLeftPer - (100 + 200 + 150) * this.scaleFact- this.extraTop/2, this.c_h * .5 - 800 * this.scaleFact, 'items', 'closeBtn0000')
        .setScale(this.scaleFact*1.2)
        .setData('canShow', true)
        .setInteractive({
            cursor: 'pointer'
        })
        .on('pointerdown', this.showDeleteConfirm.bind(this))
        .on('pointerover', this.onHover.bind(this, 'deleteBtn', 'closeBtn_10000'))
        .on('pointerout', this.onHover.bind(this, 'deleteBtn', 'closeBtn0000'));

        this.addBtn = this.create(this.c_w - this.extraLeftPer - this.extraTop/2 - (100 + 650 + 150) * this.scaleFact, this.c_h * .5 - 0 * this.scaleFact, 'items', 'addBtn0000')
        .setScale(this.scaleFact*1.3)
        .setVisible(false)
        .setInteractive({
            cursor: 'pointer'
        })
        .on('pointerdown', this.addRack.bind(this))
        .on('pointerover', this.onHover.bind(this, 'addBtn', 'addBtn_10000'))
        .on('pointerout', this.onHover.bind(this, 'addBtn', 'addBtn0000'));



        this.highlight = this.create(this.rack1.x, this.rack1.y + 425 * this.scaleFact, 'items', 'crate_24_outline0000')
            .setAlpha(0)
            .setDepth(0)
            .setScale(this.scaleFact * 0.7);

        this.scene.input.on('dragstart', this.onDragStart.bind(this));
        this.scene.input.on('drag', this.onBottleDrag.bind(this));
        this.scene.input.on('dragend', this.onDragEnd.bind(this));

    


            

            this.addCardInfo();


            this.rackInfo = {
                'rack': 'rack1',
                'shelf': 4,
                'side': 'left'
            }
            Global.totalBottles=24;
            this.isBigCrate= true;
                this.addCrateOnShelf([], this.rack1, '4');
                this.setVisible(false);

                
                this[`rack1_shelf4_right_info_txt`].setText('Leeggoed');
               
    }
    addRack(){
        if(Global.popupActive) return false;

        this.deleteBtn.setVisible(true);
        this.addBtn.setVisible(false);
        this.rack1.setVisible(true);
        this.rack1.setAlpha(1);
        this.rack1.setData('canShow', true);
        this.deleteBtn.setData('canShow', true);
        this[`rack2_shelf4_right_info`].setAlpha(0);
        this[`rack2_shelf4_right_info_txt`].setAlpha(0);
        for(let j=1;j<=4;j++){

       

            this[`rack${1}_shelf${j}_left_info`].setVisible(true);
            this[`rack${1}_shelf${j}_right_info`].setVisible(true);
            this[`rack${1}_shelf${j}_left_info_txt`].setVisible(true);
            this[`rack${1}_shelf${j}_right_info_txt`].setVisible(true);

            this[`rack${1}_shelf${j}_left_info`].setData('canShow', true);
            this[`rack${1}_shelf${j}_right_info`].setData('canShow', true);
            this[`rack${1}_shelf${j}_left_info_txt`].setData('canShow', true);
            this[`rack${1}_shelf${j}_right_info_txt`].setData('canShow', true);
        }
        this[`rack1_shelf4_right_info`].setAlpha(1);
        this[`rack1_shelf4_right_info_txt`].setAlpha(1);
        this[`rack1_shelf4_right_info_txt`].setText('Leeggoed');
        let totalBottles= Global.totalBottles;
        Global.totalBottles= 24;
        this.isBigCrate= true;
        this.rackInfo = {
            'rack': 'rack1',
            'shelf': 4,
            'side': 'left'
        }
        this.addCrateOnShelf([], this.rack1, '4');
        Global.totalBottles= totalBottles;
        this.updateSkipFrame();


        if(Global.extraCrate){

            [Global.extraCrate, ...Global.extraCrate.getData('crateItems')].forEach((child) => {
                child.destroy(true, true);
            })
            Global.crateData[`rack2_right_4`]['status']= 'empty';
            Global.extraCrate= null;
        }

        /* 
       
        */
    }
    showGame(){
        this.children.entries.forEach((child) => {
            child.setInteractive();
        });
    }
    onSkip(){
        this.children.entries.forEach((child) => {
            child.disableInteractive();
            if(child !== this.addBtn)
            child.setVisible(true)
        });
        // this.addBtn.setVisible(false)
        this.deleteBtn.setVisible(false);
    }
    addCardInfo(){
        for(let i=1;i<=2;i++){
            for(let j=1;j<=4;j++){
                this[`rack${i}_shelf${j}_left_info`]= this.create(this[`rack${i}`].x-(650)*this.scaleFact, this[`rack${i}`].y-(900 - 450*(j-1))*this.scaleFact, 'items', 'info_card20000')
                .setAlpha(0)    
                .setScale(this.scaleFact*1.2);

                this[`rack${i}_shelf${j}_left_info_txt`]= this.scene.make.text({
                    x: this[`rack${i}_shelf${j}_left_info`].x,
                    y: this[`rack${i}_shelf${j}_left_info`].y,
                    text: `hello`,
                    origin: {
                        x: 0.53,
                        y: 0.5
                    },
                    style: {
                        font: (Global.isMobile) ? '' + String(34 * this.scaleFact) + 'px Montserrat-Regular' : '' + String(34 * this.scaleFact) + 'px Montserrat-Regular',
                        fill: '#394c54',
                        align: "center",
                        wordWrap:{width: this[`rack${i}_shelf${j}_left_info`].width*this[`rack${i}_shelf${j}_left_info`].scaleX*.95}
                    }
                })
                .setAlpha(0)
        
                this[`rack${i}_shelf${j}_right_info`]= this.create(this[`rack${i}`].x+(650)*this.scaleFact, this[`rack${i}`].y-(680 - 450*(j-1))*this.scaleFact, 'items', 'info_card20000')
                .setAlpha(0)
                .setScale(-this.scaleFact*1.2,this.scaleFact*1.2);

                this[`rack${i}_shelf${j}_right_info_txt`]= this.scene.make.text({
                    x: this[`rack${i}_shelf${j}_right_info`].x,
                    y: this[`rack${i}_shelf${j}_right_info`].y,
                    text: `hello`,
                    origin: {
                        x: 0.47,
                        y: 0.5
                    },
                    style: {
                        font: (Global.isMobile) ? '' + String(34 * this.scaleFact) + 'px Montserrat-Regular' : '' + String(34 * this.scaleFact) + 'px Montserrat-Regular',
                        fill: '#394c54',
                        align: "center",
                        wordWrap:{width: this[`rack${i}_shelf${j}_left_info`].width*this[`rack${i}_shelf${j}_left_info`].scaleX*.95}
                    }
                })
                .setAlpha(0)
            }
        }
        


    }

    onHover(key, frame){
        // console.log(key, frame,' To Show')
        this[key].setFrame(frame);
    }
    showDeleteConfirm(){
        if(Global.popupActive) return false;

        Global.popupActive= true;
        document.querySelector("#delete_confirm").classList.add("active");
    }
    hideDeleteConfirm(){
        Global.popupActive= false;
        document.querySelector("#delete_confirm").classList.remove("active");
    }
    deleteSecondRack(){
        this.deleteBtn.setVisible(false);
        this.rack1.setVisible(false);
        this.deleteBtn.setData('canShow', false);
        this.rack1.setData('canShow', false);
        this.rack1.setAlpha(0);
        let disposeCrateFound= false;
        this.children.entries.forEach((child) => {
            if(child.getData('rackInfo') && child.getData('rackInfo')['rack'] == 'rack1'){
                child.getData('crateItems') && child.getData('crateItems').forEach((child) => {
                    let isCrateIndex= child.getData('isCrateIndex');
                    let crateTotalBottles= child.getData('crateTotalBottles');

                    isCrateIndex && crateTotalBottles>0 && this.emitter.emit('header:update_crate', -1);

                    child.destroy(true);
                })
               
                child.destroy(true);

            }
            if(child.getData('rackInfo') && child.getData('rackInfo')['rack'] == 'rack2'){

                if(child.getData('rackInfo')['shelf'] == 4 && child.getData('rackInfo')['side'] == 'right' && !disposeCrateFound){
                    this.matchShelfFound= false;
                    disposeCrateFound= true;
                    Global.canDispose= true;
                    /* for(let i=1;i<=4;i++){
                        Global.crateData[`rack2_right_${i}`]['status'] = 'taken';
                        Global.crateData[`rack2_left_${i}`]['status'] = 'taken';
                    } */

                    Global.crateData[`rack2_right_4`]['status'] = 'taken';
                    if(child.frame.name.indexOf("24") !== -1){
                        Global.crateData[`rack2_left_4`]['status'] = 'empty';
                    }
                    this.hideTag(child.getData('rackInfo'), Global.crateData[`rack2_right_4`]['filledBottles']);
                    child.setData('canShow', false)
                    // Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`]['status'] = 'empty';
                    this.checkToPlace(false, child);
                }
            }
        })
        
        for(let j=1;j<=4;j++){
            this[`rack${1}_shelf${j}_left_info`].setVisible(false);
            this[`rack${1}_shelf${j}_right_info`].setVisible(false);
       /*      this[`rack${1}_shelf${j}_left_info_txt`].setVisible(false);
            this[`rack${1}_shelf${j}_right_info_txt`].setVisible(false); */

            this[`rack${1}_shelf${j}_left_info`].setData('canShow', false);
            this[`rack${1}_shelf${j}_right_info`].setData('canShow', false);
            this[`rack${1}_shelf${j}_left_info_txt`].setData('canShow', false);
            this[`rack${1}_shelf${j}_right_info_txt`].setData('canShow', false);

            this[`rack${1}_shelf${j}_left_info`].setAlpha(0);
            this[`rack${1}_shelf${j}_left_info_txt`].setAlpha(0);

            this[`rack${1}_shelf${j}_right_info`].setAlpha(0);
            this[`rack${1}_shelf${j}_right_info_txt`].setAlpha(0);

            Global.crateData[`rack1_left_${j}`]['status']= 'taken';
            Global.crateData[`rack1_right_${j}`]['status']= 'taken';

        }
        
        this.addBtn.setVisible(true);
       
        this.rackInfo = {
            'rack': 'rack2',
            'shelf': 4,
            'side': 'right'
        }
        let totalBottles= Global.totalBottles;
        Global.totalBottles= 6;
        this.isBigCrate= false;
        this.addCrateOnShelf([], this.rack2, '4');
        Global.totalBottles= totalBottles;
        
        this.hideDeleteConfirm();
        this.updateSkipFrame();

    }
    showOrHideUI(status){
        this.setVisible(status);
   
        this[`rack1_shelf4_right_info`].setAlpha(status?1:0);
                this[`rack1_shelf4_right_info_txt`].setAlpha(status?1:0);
        if(!this.rack1.getData('canShow')){
            this.rack1.setVisible(false);
            this.deleteBtn.setVisible(false);
            for(let j=1;j<=4;j++){
                this[`rack${1}_shelf${j}_left_info`].setVisible(false);
                this[`rack${1}_shelf${j}_right_info`].setVisible(false);
                this[`rack${1}_shelf${j}_left_info_txt`].setVisible(false);
                this[`rack${1}_shelf${j}_right_info_txt`].setVisible(false);
            }
        }else{
            if(status){
                this.addBtn.setVisible(false);
            }
        }
        
    }
    checkToPlace(isNew, filledBottlesOrObject) {

        if (!this.matchShelfFound) {
            if (isNew) {
                this.emitter.emit('crate:reset_position', filledBottlesOrObject);
            } else {
                if(Global.canDispose){
                    let filledBottles= filledBottlesOrObject.getData('filledBottles')
                    filledBottles && this.emitter.emit('header:update_crate', -1);

                    [filledBottlesOrObject, ...filledBottlesOrObject.getData('crateItems')].forEach((child) => {
                        child.disableInteractive();
                    })

                    this.scene.tweens.add({
                        targets: [filledBottlesOrObject, ...filledBottlesOrObject.getData('crateItems')],
                        ease: 'Back.In',
                        scale: 0.2,
                        duration: 150,
                        repeat: 0, // -1: infinity
                        yoyo: false,
                        onComplete: function(){
                            [filledBottlesOrObject, ...filledBottlesOrObject.getData('crateItems')].forEach((child) => {
                                child.destroy(true, true);
                            })
                            // gameObject
                            this.emitter.emit('bin:reset_bin');
                        }.bind(this)
                    });
                }else{
                    
                    if (this.isBigCrate) {
                        let filledBottles= null;
                        if(Array.isArray(filledBottlesOrObject)){
                            filledBottles= filledBottlesOrObject;
                        }else{
                            let rackInfo = filledBottlesOrObject.getData('rackInfo');
                            this.rackInfo=rackInfo;
                            filledBottles= filledBottlesOrObject.getData('filledBottles')
                        }
                     

                        if(filledBottles){
                            this[`${this.rackInfo['rack']}_shelf${this.rackInfo['shelf']}_left_info`].setAlpha(1)
                            this[`${this.rackInfo['rack']}_shelf${this.rackInfo['shelf']}_right_info`].setAlpha(1)
                            Global.crateData[`${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`]['filledBottles'] = filledBottles.slice(0,2);
                            Global.crateData[`${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`]['filledBottles'] = filledBottles.slice(2,4);
                            filledBottles && this.showTag(this.rackInfo, filledBottles)
                        }
                       
                    }else{
                        let filledBottles= null;
                        if(Array.isArray(filledBottlesOrObject)){
                            filledBottles= filledBottlesOrObject;
                        }else{
                            let rackInfo = filledBottlesOrObject.getData('rackInfo');
                            this.rackInfo=rackInfo;
                            filledBottles= filledBottlesOrObject.getData('filledBottles')
                        }
                     
                        Global.crateData[`${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`]&& (Global.crateData[`${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`]['filledBottles'] =filledBottles);
                        filledBottles && this.showTag(this.rackInfo, filledBottles)

                    }

                    this.emitter.emit('rack:reset_position', filledBottlesOrObject);

                }

            }
            this.updateSkipFrame();
            return false;
        } else {
            
            if (isNew) {
                this.emitter.emit('header:update_crate_status', 'add');
                this.emitter.emit('header:update_crate', 1);
                this.addCrateOnShelf(filledBottlesOrObject);
                this.emitter.emit('crate:remove');
            } else {
                this.rearrageOnShelf(filledBottlesOrObject);

            }
            if (this.isBigCrate) {
                Global.crateData[`${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`]['status'] = 'taken';
                Global.crateData[`${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`]['status'] = 'taken';

                let filledBottles= null;
                if(Array.isArray(filledBottlesOrObject)){
                    filledBottles= filledBottlesOrObject;
                }else{
                    filledBottles= filledBottlesOrObject.getData('filledBottles')
                }
                if(filledBottles){
                    this[`${this.rackInfo['rack']}_shelf${this.rackInfo['shelf']}_left_info`].setAlpha(1)
                    this[`${this.rackInfo['rack']}_shelf${this.rackInfo['shelf']}_right_info`].setAlpha(1)
                    Global.crateData[`${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`]['filledBottles'] = filledBottles.slice(0,2);
                    Global.crateData[`${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`]['filledBottles'] = filledBottles.slice(2,4);
                    this.showTag(this.rackInfo, filledBottles)
                }
           

            } else {

                Global.crateData[`${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`]['status'] = 'taken';
                if(Array.isArray(filledBottlesOrObject)){
                    Global.crateData[`${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`]['filledBottles'] =filledBottlesOrObject;
                    this.showTag(this.rackInfo, filledBottlesOrObject)
                }else{
                    Global.crateData[`${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`]['filledBottles'] =filledBottlesOrObject.getData('filledBottles');
                    this.showTag(this.rackInfo, filledBottlesOrObject.getData('filledBottles'))
                }
                
            }

            this.updateSkipFrame();
        }
       
       
    }
    updateSkipFrame(){
        let isEmptyRemains= false;
       
        Object.keys(Global.crateData).forEach((crateDataKey) => {
            let rack= this[crateDataKey.split("_")[0]];

            if(Global.crateData[crateDataKey]['status'] === 'empty' && rack.visible){
                isEmptyRemains= true;

            }
        });

        if(isEmptyRemains){
            this.emitter.emit('header:update_skip_frame', 'skip');
            this.emitter.emit('header:hide_ready_info');
        }else{
            this.emitter.emit('header:update_skip_frame', 'ready');
            this.emitter.emit('header:show_ready_info');
        }
       
    }
    hideTag(rackInfo, items){

        if(items.length>1){
            this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info`].setAlpha(0);
            this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info_txt`].setAlpha(0);

            this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info`].setAlpha(0);
            this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info_txt`].setAlpha(0);
        
        }else{
            this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_${rackInfo['side']}_info`].setAlpha(0);
            this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_${rackInfo['side']}_info_txt`].setAlpha(0);
        
        }
    }
    showTag(rackInfo, items){

        let card1Str='';
        let card2Str='';
        let totalBottles=0
        // let 
        const allEqual = (obj) => {
            let isEqual= true;
            let last= obj[0];
            for(let i=1;i<obj.length-1;i++){
                if(last != obj[i]){
                    isEqual= false;
                }
            }
            return isEqual;
        }
        let _totalBottles= 0;
        let isAllEqual= allEqual(items);

        items.forEach((item, index) => {
            if(index>0 && index<2){
                card1Str += '\n'
            }
            if(index>2){
                card2Str += '\n'
            }
            let key= jsonData.filter(data => data['bottle_key'] == item.split('_group')[0])[0]['name'];
            _totalBottles= jsonData.filter(data => data['bottle_key'] == item.split('_group')[0])[0]['total_bottles'];


            // key= key['name'];

            /* if(key.length>10){
                key= `${key.substring(0, 10)}...`
            } */
            totalBottles+= 6;
            if(index<2){
                card1Str += `${key}  (${!isAllEqual?'6':_totalBottles})`
            }else{
                card2Str += `${key}  (${!isAllEqual?'6':_totalBottles})`
            }
            
            


        });
        
        if(this.isBigCrate){
            if(allEqual(items)){

                card1Str= `${card1Str.split('(')[0]}(${_totalBottles})`;
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info`].setAlpha(1);
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info_txt`].setAlpha(1);
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info_txt`].setText(card1Str)
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info`].setAlpha(0);
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info_txt`].setAlpha(0);

            }else{
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info`].setAlpha(1);
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info_txt`].setAlpha(1);
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info_txt`].setText(card1Str)
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info`].setAlpha(1);
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info_txt`].setAlpha(1);
                this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info_txt`].setText(card2Str)
            }
          

            
        
        }else{
            this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_${rackInfo['side']}_info`].setAlpha(1);
            this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_${rackInfo['side']}_info_txt`].setAlpha(1);
            this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_${rackInfo['side']}_info_txt`].setText(card1Str)
        
        }
            
    }
    rearrageOnShelf(gameObject) {

        
        this.highlight.setAlpha(0)

        gameObject.setData('rackInfo', this.rackInfo);
        gameObject.setData('isBigCrate', this.isBigCrate);
        // gameObject.setPosition(this.highlight.x, this.highlight.y);

        // this.crateMaskGr= this.scene.add.graphics();
        // this.crateMaskGr.setPosition(this.highlight.x-this.highlight.width*this.crate.scaleX, this.highlight.y-this.highlight.height*this.highlight.scaleY*2);
        // this.crateMaskGr.fillStyle(0xff0000, 0.0);
        // this.crateMaskGr.fillRect(0, 0, this.highlight.width*this.highlight.scaleX*3, this.highlight.height*this.highlight.scaleY*2.5)
        // this.crateMaskGr.setDepth(100);
        // this.add(this.crateMaskGr);
        // gameObject.setData('maskGr', this.crateMaskGr);
        [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
            // child.setMask(this.crateMaskGr.createGeometryMask())
            /* updateDepth && */ child.setDepth(child.getData('initDepth') + this.rackInfo['shelf'] * 8);
        });
        this.killAllTweens(gameObject);
        [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
            // child.setMask(this.crateMaskGr.createGeometryMask())
            child.setData('readyToDrag', false);
            this.scene.tweens.add({
                targets: child,
                ease: 'Back.Out',
                x: this.highlight.x,
                y: child.getData('filledIndex') !== 0 ? this.highlight.y + 120 * this.scaleFact + (child.getData('filledIndex') - 2.5) * (!this.isBigCrate?70:70) * this.scaleFact : this.highlight.y + 120 * this.scaleFact,
                duration: 300,
                repeat: 0, // -1: infinity
                yoyo: false,
                onComplete: child === gameObject ? this.addCrateMask.bind(this, gameObject, true) : null
            });
            /*    if(child.getData('filledIndex') !== 0){
                   child.setPosition(gameObject.x , gameObject.y + (child.getData('filledIndex') - 2.5) * 70 * this.scaleFact)
               }else{
                   child.setPosition(gameObject.x , gameObject.y);
               } */

        })
        // this.scene.tweens.killAll();
        
        // this.shrinkTwn && this.shrinkTwn.remove();
        this.scene.tweens.add({
            targets: this.scaleObj,
            ease: 'Back.Out',
            value: 1,
            duration: 350,
            repeat: 0, // -1: infinity
            yoyo: false,
            onUpdate: function (twn) {
                [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                    child.setScale(child.getData('initScale') * this.scaleObj['value'])
                })
                this.shrinkFact = 1.5 - twn.progress * .5

            }.bind(this),
            onComplete: function () {
                [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                    child.setData('readyToDrag', true)
                });

            }.bind(this)
        });





    }
    addCrateMask(gameObject, updateDepth) {

        this.crateMaskGr = this.scene.add.graphics();
        this.crateMaskGr.setPosition(this.highlight.x - this.highlight.width * this.crate.scaleX, this.highlight.y - this.highlight.height * this.highlight.scaleY * 2);
        this.crateMaskGr.fillStyle(0xff0000, 0.0);
        this.crateMaskGr.fillRect(0, 0, this.highlight.width * this.highlight.scaleX * 3, this.highlight.height * this.highlight.scaleY * 2.5)
        this.crateMaskGr.setDepth(100);
        this.add(this.crateMaskGr);
        gameObject.setData('maskGr', this.crateMaskGr);

        [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
            child.setMask(this.crateMaskGr.createGeometryMask())
            child.setData('initX', child.x);
            child.setData('initY', child.y);
            // updateDepth && child.setDepth(child.getData('initDepth') + this.rackInfo['shelf'] * 8);
        });
    }
    killAllTweens(gameObject){
        [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
            this.scene.tweens.killTweensOf(gameObject);
        })
    }
    resetCrateOnRack(gameObject) {
        if (gameObject.getData && gameObject.getData('insideRack')) {

            // alert("S");
            let rackInfo= gameObject.getData('rackInfo');
            [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                // child.setMask(this.crateMaskGr.createGeometryMask())

                /* updateDepth && */ child.setDepth(child.getData('initDepth') + (rackInfo['shelf']) * 8);
            });
            // this.scene.tweens.killAll();
            this.killAllTweens(gameObject);
            this.highlight.setPosition(gameObject.getData('initX'), gameObject.getData('initY') - 120 * this.scaleFact);
            [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                child.setData('readyToDrag', false);
                this.scene.tweens.add({
                    targets: child,
                    ease: 'Back.Out',
                    x: child.getData('initX'),
                    y: child.getData('initY'),
                    duration: 300,
                    repeat: 0, // -1: infinity
                    yoyo: false,
                    onComplete: child === gameObject ? this.addCrateMask.bind(this, gameObject, true) : null
                });
            })

            this.scene.tweens.add({
                targets: this.scaleObj,
                ease: 'Back.Out',
                value: 1,
                duration: 350,
                repeat: 0, // -1: infinity
                yoyo: false,
                onUpdate: function (twn) {
                    [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                        child.setScale(child.getData('initScale') * this.scaleObj['value'])
                    })
                    this.shrinkFact = 1.5 - twn.progress * .5

                }.bind(this),
                onComplete: function () {
                    [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                        child.setData('readyToDrag', true)
                    })

                }.bind(this)
            });
        }

    }
    onDragStart(pointer, gameObject, dragX, dragY) {
        if (!Global.crateActivated || Global.popupActive) return false;


        //   this.isBigCrate = (crateFrame.indexOf('6') == -1);
        if (gameObject.getData('insideRack')) {
            if (!gameObject.getData('readyToDrag')) return false;


            this.matchedRack = null;
            
            this.matchShelfFound= false;
            
            let rackInfo = gameObject.getData('rackInfo');
            this.rackInfo=rackInfo;
            let isBigCrate = gameObject.getData('isBigCrate');

            
            gameObject.getData('maskGr') && gameObject.getData('maskGr').destroy(true);
            if (isBigCrate) {
                Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`]['status'] = 'empty';
                Global.crateData[`${rackInfo['rack']}_right_${rackInfo['shelf']}`]['status'] = 'empty';
                if(Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`]['filledBottles']){
                    this.hideTag(rackInfo, Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`]['filledBottles']);
                    this.hideTag(rackInfo, Global.crateData[`${rackInfo['rack']}_right_${rackInfo['shelf']}`]['filledBottles']);
                    
                    gameObject.setData('filledBottles', Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`]['filledBottles'].concat(Global.crateData[`${rackInfo['rack']}_right_${rackInfo['shelf']}`]['filledBottles']))
                }
                
                Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`]['filledBottles'] = null;
                Global.crateData[`${rackInfo['rack']}_right_${rackInfo['shelf']}`]['filledBottles'] = null;
            } else {
                Global.crateData[`${rackInfo['rack']}_${rackInfo['side']}_${rackInfo['shelf']}`]['status'] = 'empty';
                this.hideTag(rackInfo, Global.crateData[`${rackInfo['rack']}_${rackInfo['side']}_${rackInfo['shelf']}`]['filledBottles']);
                gameObject.setData('filledBottles', Global.crateData[`${rackInfo['rack']}_${rackInfo['side']}_${rackInfo['shelf']}`]['filledBottles'])

                Global.crateData[`${rackInfo['rack']}_${rackInfo['side']}_${rackInfo['shelf']}`]['filledBottles'] =null;


            }


            
            this.crateDragged = true;

            [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                child.setData('initX', child.x);
                // child.setData('initDepth', child.depth)

                child.setDepth(child.getData('initDepth')+rackInfo['shelf']*8+1000)
                // child.setData('readyToDrag', false)
                child.setData('initY', child.y);
                child.clearMask(true)
            });
            if (gameObject.getData('maskGr')) {
                gameObject.getData('maskGr').destroy(true, true);
            }

            [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                child.setData('initScale', child.scaleX)
            });
            this.scaleObj = {
                'value': 1
            }

            this.shrinkTwn = this.scene.tweens.add({
                targets: this.scaleObj,
                ease: 'Back.Out',
                value: `*=1.5`,
                duration: 350,
                repeat: 0, // -1: infinity
                yoyo: false,
                onUpdate: function (twn) {
                    [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                        child.setScale(child.getData('initScale') * this.scaleObj['value'])
                        if (child.getData('filledIndex') !== 0) {
                            child.y = gameObject.y + (child.getData('filledIndex') - 2.5) * (!isBigCrate?70:70) * this.scaleFact * this.shrinkFact;
                        }
                    })

                    // this.shrinkScalFact= twn.progress;
                    this.shrinkFact = 1 + twn.progress * .5
                   
                }.bind(this)
            });


        }
        this.onBottleDrag(pointer, gameObject, gameObject.x, gameObject.y)
    }
    onBottleDrag(pointer, gameObject, dragX, dragY) {
        if (!Global.crateActivated || Global.popupActive) return false;

        if (gameObject.getData('insideRack')) {
            let isBigCrate = gameObject.getData('isBigCrate');
            if (!gameObject.getData('readyToDrag')) return false;
            [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {

                child.x = dragX;
                if (child.getData('filledIndex') !== 0) {
                    child.y = dragY + (child.getData('filledIndex') - 2.5) * (!isBigCrate?70:70) * this.scaleFact * this.shrinkFact;
                } else {
                    child.y = dragY;
                }
            })

            this.emitter.emit('rack:check_on_drag', gameObject.getBounds(), gameObject.frame.name)
            this.emitter.emit('bin:check_on_drag', gameObject.getBounds(), gameObject.frame.name, 0.1)

        }
    }
    onDragEnd(pointer, gameObject, dragX, dragY) {
        if (!Global.crateActivated || Global.popupActive) return false;

        if (gameObject.getData('insideRack')) {
            if (!gameObject.getData('readyToDrag')) return false;
            this.crateDragged = false;
            this.emitter.emit('rack:check_to_place', false, gameObject);

        }
    }
    addCrateOnShelf(filledBottles, optionalRack, optionalShelf) {


        this.highlight.setAlpha(0);

        this.crateChannel1= null;
        this.crateChannel2= null;

        let shelfFactor= this.rackInfo['shelf'] * 8;
        let createItems = []
        
        
        if(filledBottles.length== 0){
            this.highlight.setPosition(optionalRack.x + (this.isBigCrate ? 0 : Global.crateData[`${this.rackInfo['rack']}_${this.rackInfo['side']}_${optionalShelf}`]['position'].x) * this.scaleFact, optionalRack.y + Global.crateData[`${this.rackInfo['rack']}_${this.rackInfo['side']}_${optionalShelf}`]['position'].y * this.scaleFact)
            if(this.isBigCrate){
                for(let i=1;i<=3;i++){
                    Global.crateData[`rack1_left_${i}`]['status']= 'empty';
                    Global.crateData[`rack1_right_${i}`]['status']= 'empty';
                }
            }else{
                Global.crateData[`rack2_right_4`]['status']= 'taken';
            }
           
        }
        if (Global.totalBottles == 6) {
            this.crate = this.create(this.highlight.x, this.highlight.y + 120 * this.scaleFact, 'items', filledBottles.length== 0?`crate_${Global.totalBottles}_empty0000`:`crate_${Global.totalBottles}_back0000`)
                .setDepth(1 + shelfFactor);
            this.crateFront = this.create(this.crate.x, this.crate.y, 'items', `crate_${Global.totalBottles}_front0000`)
                .setVisible(filledBottles.length>0)
                .setAlpha(filledBottles.length>0)
                .setDepth(3 + shelfFactor);
                if(filledBottles.length === 0){
                    Global.extraCrate= this.crate;
                    this[`rack2_shelf4_right_info`].setAlpha(1);
                    this[`rack2_shelf4_right_info_txt`].setAlpha(1);
                    this[`rack2_shelf4_right_info_txt`].setText('Leeggoed');
                }
        } else {
            this.crate = this.create(this.highlight.x, this.highlight.y + 120 * this.scaleFact, 'items', filledBottles.length== 0?`crate_${Global.totalBottles}_empty0000`:`crate_${Global.totalBottles}_10000`)
                .setDepth(1 + shelfFactor);

            this.crateChannel1 = this.create(this.crate.x, this.crate.y, 'items', `crate_${Global.totalBottles}_30000`)
                .setDepth(3 + shelfFactor)
                .setVisible(filledBottles.length>0)
                 .setAlpha(filledBottles.length>0)
                .setData('filledIndex', 0)
                .setScale(this.scaleFact * 0.7);

            this.crateChannel2 = this.create(this.crate.x, this.crate.y, 'items', `crate_${Global.totalBottles}_70000`)
                .setDepth(7 + shelfFactor)
                .setVisible(filledBottles.length>0)
                 .setAlpha(filledBottles.length>0)
                .setData('filledIndex', 0)
                .setScale(this.scaleFact * 0.7);


            this.crateFront = this.create(this.crate.x, this.crate.y, 'items', `crate_${Global.totalBottles}_80000`)
                .setVisible(filledBottles.length>0)
                 .setAlpha(filledBottles.length>0)
                .setDepth(8 + shelfFactor);

                createItems.push(this.crateChannel1);
                createItems.push(this.crateChannel2);
                

        }
     

        this.crateFront
            .setData('filledIndex', 0)
            .setData('insideRack', true)
            .setData('readyToDrag', true)
            .setScale(this.scaleFact * 0.7);


        this.crate
            .setData('filledIndex', 0)
            .setData('insideRack', true)
            .setData('readyToDrag', true)
            .setScale(this.scaleFact * 0.7);
        this.crate.setData('rackInfo', this.rackInfo);
        this.crate.setData('isCrateIndex', true);
        this.crate.setData('crateTotalBottles', filledBottles.length);
        this.crate.setData('isBigCrate', this.isBigCrate);
        this.crateFront.setData('rackInfo', this.rackInfo);
        this.crateFront.setData('isBigCrate', this.isBigCrate);

        if(filledBottles.length>0){
            this.crateFront
            .setInteractive({
                draggable: true,
                cursor: 'pointer'

            });

            this.crate
            .setInteractive({
                draggable: true,
                cursor: 'pointer'

            });
        }

       

        for (let i = 1; i <= filledBottles.length; i++) {
            this[`bottle_set${i}`] = this.create(this.crate.x /* - (Math.ceil(this.bottleSets/2)-i)*500*this.scaleFact */ , this.crate.y + (i - 2.5) * (filledBottles.length==6?70:70) * this.scaleFact, /* `bottles_group_${Global.totalBottles}`, */ filledBottles[i - 1])
                .setScale(this.scaleFact * 0.7)
                .setData('filledIndex', i)
                .setData('filled', false)
                .setDepth((i == 1 ? 2 : i + 3) + shelfFactor);
            createItems.push(this[`bottle_set${i}`]);
        }

        // this.crateMaskGr= this.scene.add.graphics();
        // this.crateMaskGr.setPosition(this.highlight.x-this.highlight.width*this.highlight.scaleX, this.highlight.y-this.highlight.height*this.highlight.scaleY*2);
        // this.crateMaskGr.fillStyle(0xff0000, 0.0);
        // this.crateMaskGr.fillRect(0, 0, this.highlight.width*this.highlight.scaleX*3, this.highlight.height*this.highlight.scaleY*2.5)
        // this.crateMaskGr.setDepth(100);
        // this.add(this.crateMaskGr);
        // this.crate.setData('maskGr', this.crateMaskGr)



        createItems.push(this.crateFront);
        createItems.push(this.crate);

        this.crateChannel1 && createItems.push(this.crateChannel1);
        this.crateChannel2 && createItems.push(this.crateChannel2);

        this.crate.setData('crateItems', createItems);
        this.crateFront.setData('crateItems', createItems);
        this.addCrateMask(this.crate, false);
        [this.crate, ...this.crate.getData('crateItems')].forEach((child) => {
            child.setData('initDepth', child.depth - shelfFactor)
            // child.setMask(this.crateMaskGr.createGeometryMask())
            // child.setData('rack', this)
            child.setData('placeScale', child.scaleX)
            this.scene.tweens.add({
                targets: child,
                ease: 'Back.Out',
                scale: {
                    'from': 0,
                    'to': child.getData('placeScale')
                },
                duration: 350,
                repeat: 0, // -1: infinity
                yoyo: false,

            });
        })



    }
    hideHighlight() {
        this.highlight.setAlpha(0);
    }
    checkOnDrag(crateBound, crateFrame) {
        var boundsA1 = this.rack1.getBounds();
        var boundsA2 = this.rack2.getBounds();
        var boundsB = crateBound;

        this.dragCrateName = crateFrame;
        this.matchedRack = null;
        this.rackInfo = this.checkForRackPlacement(boundsA2, boundsB, 'rack2', this.dragCrateName)
        if (this.rackInfo['shelf'] == 0) {
            this.rackInfo = this.checkForRackPlacement(boundsA1, boundsB, 'rack1', this.dragCrateName);
            if (this.rackInfo['shelf'] !== 0) {
                this.matchedRack = this.rack1;
            }
        } else {
            this.matchedRack = this.rack2;
        }

        this.isBigCrate = (crateFrame.indexOf('6') == -1);
        if (this.matchedRack != null) {
          
            if (
                (!this.isBigCrate && Global.crateData[`${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`]['status'] === 'empty') ||
                (this.isBigCrate &&
                    Global.crateData[`${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`]['status'] === 'empty' &&
                    Global.crateData[`${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`]['status'] === 'empty'
                )
            ) {
                // this.highlight.setFrame
                this.highlight.setAlpha(1);
                // this.matchCrateType=
                this.matchShelfFound = true;

                this.highlight.setFrame(`crate_${this.isBigCrate?24:6}_outline0000`);
              
                this.highlight.setPosition(this.matchedRack.x + (this.isBigCrate ? 0 : Global.crateData[`${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`]['position'].x) * this.scaleFact, this.matchedRack.y + Global.crateData[`${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`]['position'].y * this.scaleFact)
            } else {
                this.isBigCrate = false;
                this.matchShelfFound = false;
                this.highlight.setAlpha(0);
            }
        } else {
            // this.isBigCrate = false;
            this.matchShelfFound = false;
            this.highlight.setAlpha(0);
        }
    }
    checkForRackPlacement(boundsA, boundsB, rackKey, crateType) {
        let overlapCheck = Phaser.Geom.Intersects.GetRectangleIntersection(boundsA, boundsB);

        let rackInfo = {
            'rack': rackKey,
            'shelf': 0,
            'side': null
        }
        let rack = this[rackKey];
        if (overlapCheck.width > 0 && rack.visible) {
            let rack2Y = rack.y - rack.height * .5 * rack.scaleY;
            let crateY = (boundsB.y + boundsB.height - rack2Y) / (rack.height * rack.scaleY);


            let XPos = ((overlapCheck.x - rack.x) / rack.width * rack.scaleX + 0.5);

            if (XPos <= 0.5) {
                if (crateY <= 0.25) {
                    rackInfo['shelf'] = 1;

                } else if (crateY <= 0.5) {
                    rackInfo['shelf'] = 2;

                } else if (crateY <= 0.75) {
                    rackInfo['shelf'] = 3;

                } else if (crateY <= 1) {
                    rackInfo['shelf'] = 4;

                }
 
                if(crateType.indexOf('6') !== -1){
                    if(boundsA.x >= boundsB.x){
                        rackInfo['side'] = 'left';
                    } else {
                        rackInfo['side'] = 'right';
                    }
                }else{
                    rackInfo['side'] = 'right';
                }
                
            }

        }
        return rackInfo;
    }
    onResize(){
        setScaleFactor.call(this, false);

        this.rack1 && this.rack1.scene && this.rack1.setPosition(this.c_w - this.extraLeftPer - this.extraTop/2 - (150 + 600 + 150) * this.scaleFact, this.c_h * .5 + 100 * this.scaleFact)
        .setScale(this.scaleFact * 1.4);

        this.rack2 && this.rack2.scene && this.rack2.setPosition(this.c_w - this.extraLeftPer - this.extraTop - (1340 + 600 + 300) * this.scaleFact, this.c_h * .5 + 100 * this.scaleFact)
        .setScale(this.scaleFact * 1.4);

        this.deleteBtn && this.deleteBtn.scene && this.deleteBtn.setPosition(this.c_w - this.extraLeftPer - this.extraTop/2 - (100 + 200 + 150) * this.scaleFact, this.c_h * .5 - 800 * this.scaleFact)
        .setScale(this.scaleFact*1.2);

        this.addBtn && this.addBtn.setPosition(this.c_w - this.extraLeftPer - this.extraTop/2 - (100 + 650 + 150) * this.scaleFact, this.c_h * .5 - 0 * this.scaleFact)
        .setScale(this.scaleFact*1.3);

        this.highlight.setScale(this.scaleFact * 0.7);


        for(let i=1;i<=2;i++){
            for(let j=1;j<=4;j++){
                this[`rack${i}_shelf${j}_left_info`] && this[`rack${i}_shelf${j}_left_info`].scene && this[`rack${i}_shelf${j}_left_info`].setPosition(this[`rack${i}`].x-(650)*this.scaleFact, this[`rack${i}`].y-(900 - 450*(j-1))*this.scaleFact)
                .setScale(this.scaleFact*1.2);

                this[`rack${i}_shelf${j}_left_info_txt`] && this[`rack${i}_shelf${j}_left_info_txt`].scene && this[`rack${i}_shelf${j}_left_info_txt`].setPosition(this[`rack${i}_shelf${j}_left_info`].x, this[`rack${i}_shelf${j}_left_info`].y)
                .setWordWrapWidth(this[`rack${i}_shelf${j}_left_info`].width*this[`rack${i}_shelf${j}_left_info`].scaleX*.95)
                .setFontSize(34 * this.scaleFact);

                this[`rack${i}_shelf${j}_right_info`] && this[`rack${i}_shelf${j}_right_info`].scene && this[`rack${i}_shelf${j}_right_info`].setPosition(this[`rack${i}`].x+(650)*this.scaleFact, this[`rack${i}`].y-(680 - 450*(j-1))*this.scaleFact)
                .setScale(-this.scaleFact*1.2,this.scaleFact*1.2);

                this[`rack${i}_shelf${j}_right_info_txt`] && this[`rack${i}_shelf${j}_right_info_txt`].scene && this[`rack${i}_shelf${j}_right_info_txt`].setPosition(this[`rack${i}_shelf${j}_right_info`].x, this[`rack${i}_shelf${j}_right_info`].y)
                .setWordWrapWidth(this[`rack${i}_shelf${j}_left_info`].width*this[`rack${i}_shelf${j}_left_info`].scaleX*.95)
                .setFontSize(34 * this.scaleFact);

            }
        }

        this.children.entries.forEach((gameObject) => {
            if(gameObject.getData('crateItems')){

                
                let matchedRack= gameObject.getData('rackInfo')['rack'];
                let side= gameObject.getData('rackInfo')['side'];
                let shelf= gameObject.getData('rackInfo')['shelf'];
                let isBigCrate= gameObject.getData('isBigCrate');

                gameObject
                .setPosition(this[matchedRack].x + (isBigCrate ? 0 : Global.crateData[`${matchedRack}_${side}_${shelf}`]['position'].x) * this.scaleFact, this[matchedRack].y + Global.crateData[`${matchedRack}_${side}_${shelf}`]['position'].y * this.scaleFact+ 120 * this.scaleFact)
                .setScale(this.scaleFact*.7);

                // return false;
                [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                    if(child.getData('filledIndex') && child.getData('filledIndex') >0){
                        child.setPosition(gameObject.x , gameObject.y + (child.getData('filledIndex') - 2.5) * (!isBigCrate?70:70) * this.scaleFact)
                        .setScale(this.scaleFact * 0.7)
                    }else{
                        child.setPosition(gameObject.x , gameObject.y)
                        .setScale(this.scaleFact*0.7)
                        
                    }
                    // child.setMask(this.crateMaskGr.createGeometryMask())
                    // child.setPosition(child.getData('initX'), child.getData('initY'))
                });
                gameObject.getData('maskGr') && gameObject.getData('maskGr').destroy(true);
                this.crateMaskGr = this.scene.add.graphics();
                this.crateMaskGr.setPosition(gameObject.x - this.highlight.width * gameObject.scaleX, gameObject.y- 120 * this.scaleFact - this.highlight.height * gameObject.scaleY * 2);
                this.crateMaskGr.fillStyle(0xff0000, 0.0);
                this.crateMaskGr.fillRect(0, 0, this.highlight.width * this.highlight.scaleX * 3, this.highlight.height * this.highlight.scaleY * 2.5)
                this.crateMaskGr.setDepth(100);
                this.add(this.crateMaskGr);
                gameObject.setData('maskGr', this.crateMaskGr);
                [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
                    child.setMask(this.crateMaskGr.createGeometryMask())
                    // child.setPosition(child.getData('initX'), child.getData('initY'))
                });
            }
           
            
        })
    }
}