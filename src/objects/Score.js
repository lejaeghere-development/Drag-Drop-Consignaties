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
        setScaleFactor.call(this, false);
        this.emitter = EventEmitter.getObj();
        this.emitter.on('score:show', this.showScore.bind(this))
        this.emitter.on('game:resize', this.onResize.bind(this));
        this.emitter.on('emitter:reset', () => {
            EventEmitter.kill();
        });
    }

    init() {}
    async showScore() {

        this.scoreHead = this.scene.make.text({
                x: this.extraLeftPer + 1100 * this.scaleFact + this.extraTop/2,
                y: this.c_h * .5 + 200 * this.scaleFact ,
                text: `Congratualtions!`,
                origin: {
                    x: 0.5,
                    y: 0.5
                },
                style: {
                    font: (Global.isMobile) ? '' + String(140 * this.scaleFact) + 'px Montserrat-Bold' : '' + String(140 * this.scaleFact) + 'px Montserrat-Bold',
                    fill: '#007892',
                    align: "center"
                }
            })
            .setDepth(1005)

        this.add(this.scoreHead);

        this.scoreTxt = this.scene.make.text({
                x: this.extraLeftPer + 1100 * this.scaleFact + this.extraTop/2,
                y: this.c_h * .5 + 450 * this.scaleFact ,
                text: 'Your drinks are on the way. You will receive an email shortly with an overview of your crate racks.', //`${Global.scoreTotal} pts`,
                origin: {
                    x: 0.5,
                    y: 0.5
                },
                style: {
                    font: (Global.isMobile) ? '' + String(60 * this.scaleFact) + 'px Montserrat-Regular' : '' + String(60 * this.scaleFact) + 'px Montserrat-Regular',
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
        await updateData();

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