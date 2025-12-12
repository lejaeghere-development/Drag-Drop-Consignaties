import EventEmitter from './event-emitter';
import { Global } from './global';
import { setScaleFactor } from './scale_factor';

export default class Bottles extends Phaser.GameObjects.Group {
  constructor(game) {
    super(game);
  }
  setUp() {
    setScaleFactor.call(this, false);
    this.emitter = EventEmitter.getObj();

    Global.emitter.on('bottle:add_new', this.addBottle.bind(this, true));
    Global.emitter.on(
      'bottle:add_into_crate',
      this.addBottle.bind(this, false, false)
    );

    Global.emitter.on(
      'crate_selection:hide',
      this.showOrHideUI.bind(this, true)
    );
    Global.emitter.on('game:skip', this.onSkip.bind(this));
    Global.emitter.on('game:resize', this.onResize.bind(this));
    Global.emitter.on('bottle:remove', this.removeBottle.bind(this));

    // Global.emitter.on('crate_selection:enable', this.showOrHideUI.bind(this, false));
  }

  init() {
    this.bottles = [];

    this.scene.input.on('drag', this.onBottleDrag.bind(this));
    this.scene.input.on('dragend', this.onBottleDragEnd.bind(this));
  }

  showOrHideUI(status) {
    this.setVisible(status);
  }
  removeBottle() {
    this.bottleNew && this.bottleNew.destroy(true, true);
    this.bottleTwn && this.bottleTwn.remove();
  }
  addBottle(isNew, bottleData, replace = true, showIntro) {
    if (isNew) {
      if (this.bottleNew && !replace) return false;

      this.bottleNew && this.bottleNew.destroy(true, true);
      this.bottleTwn && this.bottleTwn.remove();
      this.bottleNew = this.create(
        this.extraLeftPer +
          this.extraTop / 2 +
          (Global.lastOrientation == 'portrait' ? 2200 : 1600) *
            this.scaleFact /* this.c_w * .25 - 100 * this.scaleFact */,
        0,
        /* 'bottles', */ `${
          bottleData['bottle_key'].indexOf('dummy') != -1
            ? 'dummy'
            : bottleData['bottle_key']
        }_single`
      )
        .setData('keyRef', bottleData['bottle_key'])
        .setScale(this.scaleFact * 1.5)
        .setData('readyToDrag', false)
        .setDepth(20 + Global.extraDepth);

      this.emitter.emit('hint:hide');
      this.bottleNew.setInteractive({
        draggable: true,
        pixelPerfect: true,
        cursor: 'pointer',
      });
      this.bottleNew.on('pointerdown', () => {
        this.emitter.emit('hint:hide');
        this.hintDelay && this.hintDelay.remove();
      });
      this.bottleNew.y =
        this.c_h -
        this.extraTop +
        (this.bottleNew.height * this.bottleNew.scaleY) / 2;

      this.showBottle(showIntro);

      setTimeout(() => {
        Global.bottleOnCrate = true;
        Global.crateCanBeDragged = true;

        Global.emitter.emit(
          'crate:check_on_drag',
          this.bottleNew.getBounds(),
          // gameObject.texture.key
          this.bottleNew.getData('keyRef')
        );
        if (Global.bottleOnCrate) {
          Global.emitter.emit('crate:add_crate_bottle');
          this.bottleNew.destroy(true, true);
        }
      }, 500);
    }
  }
  onSkip() {
    /*         setTimeout(() => {
            alert(Global.popupActive)
        }, 1000) */
    if (!this.bottleNew /* || Global.popupActive */) return false;

    this.bottleTwn = this.scene.tweens.add({
      targets: this.bottleNew,
      ease: 'Back.In', // 'Cubic', 'Elastic', 'Bounce', 'Back'
      y:
        this.c_h -
        this.extraTop +
        (this.bottleNew.height * this.bottleNew.scaleY) / 2,
      duration: 250,
      repeat: 0, // -1: infinity
      delay: 0,
      yoyo: false,
      onComplete: function (bottleNew) {
        bottleNew.setVisible(false);
        bottleNew.setData('readyToDrag', true);
        bottleNew
          .setData('fromList', true)
          .setData('initX', this.bottleNew.x)
          .setData('initY', this.bottleNew.y);
      }.bind(this, this.bottleNew),

      // interpolation: null,
    });
  }
  showBottle(showIntro) {
    this.bottleNew.setVisible(true);
    this.bottleTwn = this.scene.tweens.add({
      targets: this.bottleNew,
      ease: 'Back.Out', // 'Cubic', 'Elastic', 'Bounce', 'Back'
      y:
        this.c_h -
        this.extraTop -
        this.bottleNew.height * this.bottleNew.scaleY * 0.45 -
        150 * this.scaleFact,
      duration: 400,
      repeat: 0, // -1: infinity
      yoyo: false,
      onComplete: function (bottleNew) {
        bottleNew.setData('readyToDrag', true);
        bottleNew
          .setData('fromList', true)
          .setData('initX', this.bottleNew.x)
          .setData('initY', this.bottleNew.y);
      }.bind(this, this.bottleNew),

      // interpolation: null,
    });
    // this.hintDelay && this.hintDelay.remove();
    // if (showIntro) {
    //   this.hintDelay = this.scene.time.addEvent({
    //     delay: 3000, // ms
    //     callback: function () {
    //       this.emitter.emit('hint:show', {
    //         type: 'bottle',
    //         start: { x: this.bottleNew.x, y: this.bottleNew.y },
    //         end: {
    //           x:
    //             this.bottleNew.x -
    //             (Global.lastOrientation == 'portrait' ? 1000 : 750) *
    //               this.scaleFact,
    //           y:
    //             this.bottleNew.y -
    //             (Global.lastOrientation == 'portrait' ? 100 : 75) *
    //               this.scaleFact,
    //         },
    //       });
    //     }.bind(this),
    //     loop: false,
    //   });
    // }
  }
  onBottleDrag(pointer, gameObject, dragX, dragY) {
    if (!Global.crateActivated || Global.popupActive) return false;

    Global.totalBottles = Global.choosenTotalBottles;
    let _frame = gameObject.frame.name;
    if (!gameObject.getData('readyToDrag') || _frame.indexOf('crate') !== -1)
      return false;

    gameObject.x = dragX;
    gameObject.y = dragY;

    Global.emitter.emit(
      'crate:check_on_drag',
      gameObject.getBounds(),
      // gameObject.texture.key
      gameObject.getData('keyRef')
    );
    Global.emitter.emit(
      'bin:check_on_drag',
      gameObject.getBounds(),
      gameObject.texture.key,
      1
    );
  }
  onBottleDragEnd(pointer, gameObject, dragX, dragY) {
    if (!Global.crateActivated || Global.popupActive) return false;

    let _frame = gameObject.frame.name;

    if (!gameObject.getData('fromList') || _frame.indexOf('crate') !== -1)
      return false;

    // alert('ABC' + Global.bottleOnCrate);
    if (!Global.bottleOnCrate) {
      if (Global.canDispose) {
        gameObject.disableInteractive();
        this.scene.tweens.add({
          targets: gameObject,
          ease: 'Back.In',
          scale: 0,
          duration: 150,
          repeat: 0, // -1: infinity
          yoyo: false,
          onComplete: function (gameObject) {
            gameObject.destroy(true, true);
            // this.bottleNew=null;
            Global.emitter.emit('bin:reset_bin');
          }.bind(this, gameObject),
        });
      } else {
        gameObject.setData('readyToDrag', false);
        this.scene.tweens.add({
          targets: gameObject,
          ease: 'Cubic.InOut',
          x: gameObject.getData('initX'),
          y: gameObject.getData('initY'),
          duration: 350,
          repeat: 0, // -1: infinity
          yoyo: false,
          onComplete: function (gameObject) {
            gameObject.setData('readyToDrag', true);
          }.bind(this, gameObject),
        });
      }
    } else {
      Global.emitter.emit('crate:add_crate_bottle');

      this.scene.tweens.add({
        targets: gameObject,
        ease: 'Back.In',
        scale: 0,
        duration: 150,
        repeat: 0, // -1: infinity
        yoyo: false,
        onComplete: function (gameObject) {
          gameObject.destroy(true, true);
          if (!Global.crateCanBeDragged) {
            if (Global.crateType == 'custom') {
              setTimeout(() => {
                Global.emitter.emit(
                  'bottle:add_new',
                  Global.lastBottleKey,
                  true,
                  false
                );
              }, 500);
            }
          }
        }.bind(this, gameObject),
      });
    }
  }
  onResize() {
    setScaleFactor.call(this, false);

    if (this.bottleNew && this.bottleNew.scene) {
      this.bottleTwn && this.bottleTwn.remove();
      this.bottleNew
        .setScale(this.scaleFact * 1.5)

        .setPosition(
          this.extraLeftPer +
            this.extraTop / 2 +
            (Global.lastOrientation == 'portrait' ? 2200 : 1600) *
              this.scaleFact,
          this.c_h -
            this.extraTop -
            this.bottleNew.height * this.bottleNew.scaleY * 0.45 -
            150 * this.scaleFact
        )
        .setData('readyToDrag', true)
        .setData('fromList', true)
        .setData('initX', this.bottleNew.x)
        .setData('initY', this.bottleNew.y);
    }
  }
}
