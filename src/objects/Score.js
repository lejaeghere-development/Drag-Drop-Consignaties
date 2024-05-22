import {
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
        this.emitter.on('score:show', this.showScore.bind(this))
        this.emitter.on('game:resize', this.onResize.bind(this));
        this.emitter.on('emitter:reset', () => {
            // this.scoreShowed= false;
            /* this.remove(true);
            this.emitter.off('score:show');
            this.emitter.off('game:resize');
            this.emitter.off('emitter:reset'); */
            EventEmitter.kill();
        });
    }

    init() {}
    async showScore() {
        // if(this.scoreShowed) return false;

        this.scoreShowed= true;
        console.log("showScore")

        this.scoreHead = this.scene.make.text({
                x: this.extraLeftPer + 1100 * this.scaleFact + this.extraTop/2,
                y: this.c_h * .5 + 200 * this.scaleFact ,
                text: `Proficiat!`,
                origin: {
                    x: 0.5,
                    y: 0.5
                },
                style: {
                    font: (Global.isMobile) ? '' + String(140 * this.scaleFact) + 'px greycliff-bold' : '' + String(140 * this.scaleFact) + 'px greycliff-bold',
                    fill: '#007892',
                    align: "center"
                }
            })
            .setDepth(1005)

        this.add(this.scoreHead);

        this.scoreTxt = this.scene.make.text({
                x: this.extraLeftPer + 1100 * this.scaleFact + this.extraTop/2,
                y: this.c_h * .5 + 450 * this.scaleFact ,
                text: 'Vanaf nu niet meer sleuren met dranken, je krijgt binnenkort een overzicht van je consignatie via mail', //`${Global.scoreTotal} pts`,
                origin: {
                    x: 0.5,
                    y: 0.5
                },
                style: {
                    font: (Global.isMobile) ? '' + String(60 * this.scaleFact) + 'px greycliff-medium' : '' + String(60 * this.scaleFact) + 'px greycliff-medium',
                    fill: '#007892',
                    align: "center",
                    wordWrap: {
                        width: 1400 * this.scaleFact
                    }
                }
            })
            .setDepth(1005)

        this.add(this.scoreTxt);

        this.replayBtn = this.create(this.scoreTxt.x, this.c_h * .5 + 750 * this.scaleFact , 'items', 'replay0000')
            .setScale(this.scaleFact * 1.2)
            .setInteractive({
                cursor: 'pointer'
            })
            // .setVisible(false)
            .once('pointerdown', this.replayGame.bind(this))
            .on('pointerover', this.onHover.bind(this, 'replayBtn', 'replay_10000'))
            .on('pointerout', this.onHover.bind(this, 'replayBtn', 'replay0000'))

        Global.dataToSent['score'] = Global.scoreTotal;
        let updatedData= await updateData();
        console.log(updatedData,' updateData')

    }
    replayGame() {
     
        this.emitter.emit('game:replay')
    }
    onHover(key, frame) {
        this[key].setFrame(frame);
    }
    onResize(){
        setScaleFactor.call(this, false);
        this.scoreHead && this.scoreHead
        .setPosition(this.extraLeftPer + 1100 * this.scaleFact + this.extraTop/2, this.c_h * .5 + 200 * this.scaleFact  )
        .setFontSize(140 * this.scaleFact);

        this.scoreTxt && this.scoreTxt
        .setPosition(this.extraLeftPer + 1100 * this.scaleFact + this.extraTop/2, this.c_h * .5 + 450 * this.scaleFact  )
        .setWordWrapWidth(1400 * this.scaleFact)
        .setFontSize(60 * this.scaleFact);

        this.replayBtn && this.replayBtn
        .setPosition(this.scoreTxt.x, this.c_h * .5 + 750 * this.scaleFact  )
        .setScale(this.scaleFact * 1.2)
        

    }
}