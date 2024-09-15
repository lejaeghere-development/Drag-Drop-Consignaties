import {
    getLatestConfig,
    updateData
} from "./api";
import EventEmitter from "./event-emitter";
import {
    Global
} from "./global";
import {
    setScaleFactor
} from "./scale_factor";

export default class Score extends Phaser.GameObjects.Group {
    constructor(game) {
        super(game);
    }
    setUp() {
        this.scoreShowed= false;
        setScaleFactor.call(this, false);
        this.emitter = EventEmitter.getObj();

        Global.emitter.on('score:show', this.showScore.bind(this))
        Global.emitter.on('game:resize', this.onResize.bind(this));
    
    }

    init() {
        this.scoreBG= this.scene.add.graphics();
        this.scoreBG.setDepth(1004);
    }
    async showScore() {
        // if(this.scoreShowed) return false;

        this.scoreShowed= true;

   
        if(Global.lastOrientation !== "portrait"){
            this.scoreBG.setVisible(false);
        }else{
            this.scoreBG.setVisible(true);
            this.scoreBG.clear();
            this.scoreBG.fillStyle(0xffffff, 0.85);
            this.scoreBG.fillRect(0,0,this.c_w, this.c_h);
        }
        this.scoreHead = this.scene.make.text({
                x: Global.lastOrientation == "portrait"?this.c_w*.5:this.extraLeftPer + 1100 * this.scaleFact + this.extraTop/2,
                y: this.c_h * .5 + 200 * this.scaleFact ,
                text: `Top!`,
                origin: {
                    x: 0.5,
                    y: 0.5
                },
                style: {
                    font: (Global.lastOrientation == "portrait") ? '' + String(240 * this.scaleFact) + 'px greycliff-bold' : '' + String(140 * this.scaleFact) + 'px greycliff-bold',
                    fill: '#007892',
                    align: "center"
                }
            })
            .setDepth(1005)

        this.add(this.scoreHead);

        this.scoreTxt = this.scene.make.text({
                x: Global.lastOrientation == "portrait"?this.c_w*.5:this.extraLeftPer + 1100 * this.scaleFact + this.extraTop/2,
                y: this.c_h * .5 + (Global.lastOrientation == "portrait"?600:450) * this.scaleFact ,
                text: 'Je ontvangt binnenkort een mail met je gekozen drankenvooraad.', //`${Global.scoreTotal} pts`,
                origin: {
                    x: 0.5,
                    y: 0.5
                },
                style: {
                    font: (Global.lastOrientation == "portrait") ? '' + String(100 * this.scaleFact) + 'px greycliff-medium' : '' + String(60 * this.scaleFact) + 'px greycliff-medium',
                    fill: '#007892',
                    align: "center",
                    wordWrap: {
                        width: (Global.lastOrientation == "portrait"?2000:1400) * this.scaleFact
                    }
                }
            })
            .setDepth(1005)

        this.add(this.scoreTxt);

        this.replayBtn = this.create(this.scoreTxt.x, this.c_h * .5 + (Global.lastOrientation == "portrait"?1100:750) * this.scaleFact , 'items', 'replay0000')
            .setScale(this.scaleFact * (Global.lastOrientation == "portrait"?2:1.2))
            .setInteractive({
                cursor: 'pointer'
            })
            .setDepth(1005)
            .once('pointerdown', this.replayGame.bind(this))
            .on('pointerover', this.onHover.bind(this, 'replayBtn', 'replay_10000'))
            .on('pointerout', this.onHover.bind(this, 'replayBtn', 'replay0000'))

        Global.dataToSent['score'] = Global.scoreTotal;
        let updatedData= await updateData();

        setTimeout(this.onResize.bind(this), 0)
    }
    async replayGame() {  
        // let res= await getLatestConfig();
        // window.userConfig= res['combination'];
        // Global.totalBottles=0;
        Global.emitter.emit('game:replay')
    }
    onHover(key, frame) {
        this[key].setFrame(frame);
    }
    onResize(){
        setScaleFactor.call(this, false);
        this.scoreHead && this.scoreHead
        .setPosition(Global.lastOrientation == "portrait"?this.c_w*.5:this.extraLeftPer + 1100 * this.scaleFact + this.extraTop/2, this.c_h * .5 + 200 * this.scaleFact  )
        .setFontSize((Global.lastOrientation == "portrait"?240:140) * this.scaleFact);

        this.scoreTxt && this.scoreTxt
        .setPosition(Global.lastOrientation == "portrait"?this.c_w*.5:this.extraLeftPer + 1100 * this.scaleFact + this.extraTop/2, this.c_h * .5 + (Global.lastOrientation == "portrait"?600:450) * this.scaleFact  )
        .setWordWrapWidth((Global.lastOrientation == "portrait"?2000:1400) * this.scaleFact)
        .setFontSize((Global.lastOrientation == "portrait"?100:60) * this.scaleFact);

        this.replayBtn && this.replayBtn
        .setPosition(this.scoreTxt.x, this.c_h * .5 + (Global.lastOrientation == "portrait"?1100:750) * this.scaleFact  )
        .setScale(this.scaleFact * (Global.lastOrientation == "portrait"?2:1.2))
        
        if(this.scoreShowed){
            if(Global.lastOrientation !== "portrait"){
                this.scoreBG.setVisible(false);
            }else{
                this.scoreBG.setVisible(true);
                this.scoreBG.clear();
                this.scoreBG.fillStyle(0xffffff, 0.85);
                this.scoreBG.fillRect(0,0,this.c_w, this.c_h);
            }
        }
       

    }
}