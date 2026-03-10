import EventEmitter from './event-emitter';
import { Global } from './global';
import { setScaleFactor } from './scale_factor';

export default class Crates extends Phaser.GameObjects.Group {
  constructor(game) {
    super(game);
  }
  setUp() {
    setScaleFactor.call(this, false);
    this.emitter = EventEmitter.getObj();

    Global.emitter.on('crate:add_crate', this.addCrate.bind(this));
    Global.emitter.on('crate:check_on_drag', this.checkOnDrag.bind(this));
    Global.emitter.on('crate:add_crate_bottle', this.addBottle.bind(this));
    Global.emitter.on(
      'crate:remove_crate_bottle',
      this.removeBottle.bind(this)
    );
    Global.emitter.on('crate:reset_position', this.resetCrate.bind(this));
    Global.emitter.on('crate:remove', this.removeCrate.bind(this));
    Global.emitter.on('game:skip', this.onSkip.bind(this));
    Global.emitter.on('game:resize', this.onResize.bind(this));
    Global.emitter.on(
      'bottle:clear_crate_last_item',
      this.removeLastCrateBottleSet.bind(this)
    );

    Global.emitter.on(
      'crate_selection:hide',
      this.showOrHideUI.bind(this, true)
    );
    // Global.emitter.on('crate_selection:enable', this.showOrHideUI.bind(this, false));
    Global.emitter.on('crate:remove', this.onDragRemoved.bind(this, true));
    Global.emitter.on(
      'drop_filled_crate_at',
      this.dropFilledCrateAt.bind(this)
    );
  }

  init() {
    this.lastDraggedIndex = -1;
    this.nextSpotFound = true;
    this.shrinkScalFact = 0;
    this.crateDragged = false;
    this.filledBottles = [];
    this.filledIndeces = [];
    this.crates = [];

    this.filledIndex = 1;
    this.bottleToDrag = null;
    this.shrinkFact = 1;

    for (let i = 0; i < this.bottleSets; i++) {
      this.filledBottles[i] = null;
    }

    this.scene.input.on('dragstart', this.onDragStart.bind(this));
    this.scene.input.on('drag', this.onBottleDrag.bind(this));
    this.scene.input.on('dragend', this.onDragEnd.bind(this));

    setTimeout(() => {
      Global.prevCrateData = JSON.parse(JSON.stringify(Global.crateData));
    }, 700);
  }

  showOrHideUI(status) {
    this.setVisible(status);
  }

  onDragStart(pointer, gameObject, dragX, dragY) {
    if (!Global.crateActivated || Global.popupActive) return false;

    let _frame = gameObject.texture.key;

    this.hintDelay && this.hintDelay.remove();
    this.emitter.emit('hint:hide');
    if (_frame.indexOf('group') != -1) {
      Global.totalBottles = Global.choosenTotalBottles;
      this.nextSpotFound = true;
      Global.bottleOnCrate = true;
      if (Global.crateType == 'fixed') {
        // this.filledIndex = 1; Commented out to avoid resetting filledIndex
        this.filledIndeces = [];
        this.filledBottles = [];
        // alert("S")
        for (let i = 1; i <= Global.totalBottles / 6; i++) {
          this[`bottle_set${i}`].setAlpha(0.5);
          if (
            this[`bottle_set${i}ToDrag`] &&
            this[`bottle_set${i}ToDrag`].scene &&
            this[`bottle_set${i}ToDrag`] !== gameObject
          ) {
            this[`bottle_set${i}ToDrag`].destroy();
          }
        }
      } else {
        this.filledIndex = gameObject.getData('filledIndex');
        let indexToRemove = this.filledIndeces.indexOf(this.filledIndex);
        this.filledIndeces.splice(indexToRemove, 1);
        this.filledBottles[this.filledIndex - 1] = null;
        this[`bottle_set${this.filledIndex}`].setAlpha(0.5);
      }

      this.bottleToDrag = gameObject;
      gameObject.setDepth(20 + Global.extraDepth);
      // gameObject.setTexture(`bottles`);
      gameObject.setTexture(
        `${_frame.split('_group')[0].split('_single')[0]}_single`
      );
    } else if (gameObject == this.crate || gameObject == this.crateFront) {
      if (!this.crate.getData('readyToDrag') || Global.popupActive)
        return false;

      this.crateDragged = true;
      this.children.entries.forEach((child) => {
        child.setData('initX', child.x);
        child.setData('initY', child.y);
      });

      this.children.entries.forEach((child) => {
        child.setData('initScale', child.scaleX);
      });
      this.scaleObj = {
        value: 1,
      };

      this.shrinkTwn = this.scene.tweens.add({
        targets: this.scaleObj,
        ease: 'Back.InOut',
        value: `/=1.5`,
        duration: 350,
        repeat: 0, // -1: infinity
        yoyo: false,
        onUpdate: function (twn) {
          this.children.entries.forEach((child) => {
            child.setScale(child.getData('initScale') * this.scaleObj['value']);
          });

          // this.shrinkScalFact= twn.progress;
          this.shrinkFact = 1 + twn.progress * 0.5;

          for (let i = 1; i <= this.bottleSets; i++) {
            this[`bottle_set${i}`].setPosition(
              this.crate.x,
              this.crate.y +
                (((i - 2.5) * 150 * this.scaleFact) / this.shrinkFact) *
                  (this.bottleSets == 6 ? 0.7 : 0.85)
            );
          }
          this.crateChannel1 &&
            this.crateChannel1.setPosition(this.crate.x, this.crate.y);
          this.crateChannel2 &&
            this.crateChannel2.setPosition(this.crate.x, this.crate.y);
          this.onBottleDrag(pointer, gameObject, gameObject.x, gameObject.y);
        }.bind(this),
        // onCom
      });
    }
  }
  onBottleDrag(pointer, gameObject, dragX, dragY) {
    if (!Global.crateActivated || Global.popupActive) return false;

    if (this.bottleToDrag) {
      this.bottleToDrag.x = dragX;
      this.bottleToDrag.y = dragY;

      Global.emitter.emit(
        'crate:check_on_drag',
        this.bottleToDrag.getBounds(),
        this.bottleToDrag.texture.key
      );
    }
    if (
      (gameObject == this.crate || gameObject == this.crateFront) &&
      this.crateDragged
    ) {
      if (!this.crate.getData('readyToDrag') || Global.popupActive)
        return false;

      this.crate.x = dragX;
      this.crate.y = dragY;

      this.crateFront.x = this.crate.x;
      this.crateFront.y = this.crate.y;

      this.crateChannel1 &&
        this.crateChannel1.setPosition(this.crate.x, this.crate.y);
      this.crateChannel2 &&
        this.crateChannel2.setPosition(this.crate.x, this.crate.y);

      Global.emitter.emit(
        'rack:check_on_drag',
        this.crate.getBounds(),
        this.crate.frame.name
      );
      Global.emitter.emit(
        'bin:check_on_drag',
        this.crate.getBounds(),
        this.crate.frame.name,
        0.1
      );

      for (let i = 1; i <= this.bottleSets; i++) {
        this[`bottle_set${i}`].setPosition(
          this.crate
            .x /* - (Math.ceil(this.bottleSets/2)-i)*500*this.scaleFact/this.shrinkFact */,
          this.crate.y +
            (((i - 2.5) * 150 * this.scaleFact) / this.shrinkFact) *
              (this.bottleSets == 6 ? 0.7 : 0.85)
        );
        this[`bottle_set${i}ToDrag`].setPosition(
          this.crate
            .x /* - (Math.ceil(this.bottleSets/2)-i)*500*this.scaleFact/this.shrinkFact */,
          this.crate.y +
            (((i - 2.5) * 150 * this.scaleFact) / this.shrinkFact) *
              (this.bottleSets == 6 ? 0.7 : 0.85)
        );
      }
    }
  }
  addCrate(byForce) {
    this.shrinkScalFact = 0;
    this.crateDragged = false;
    this.filledBottles = [];
    this.filledIndeces = [];
    this.crates = [];
    this.nextSpotFound = true;
    this.filledIndex = 1;
    this.bottleToDrag = null;
    this.shrinkFact = 1;
    this.crateChannel1 = null;
    this.crateChannel2 = null;
    Global.crateCanBeDragged = false;

    Global.emitter.emit('rack:reset_swap_crate');
    Global.emitter.emit('rack:hide_all_clickable');
    /*  this.crate && this.crate.destroy();
         this.crateFront && this.crateFront.destroy();
         this.crateChannel1 && this.crateChannel1.destroy();
         this.crateChannel2 && this.crateChannel2.destroy();
         for (let i = 1; i <= this.bottleSets; i++) {
             this[`bottle_set${i}`] && this[`bottle_set${i}`].destroy(); 
         } */
    this.removeCrate(false);

    this.addCrateTO && clearTimeout(this.addCrateTO);

    this.addCrateTO = setTimeout(() => {
      if (Global.totalBottles == 6 || Global.totalBottles == 12) {
        this.bottleSets = Global.totalBottles == 12 ? 2 : 1;
        this.crate = this.create(
          this.extraLeftPer +
            this.extraTop / 4 +
            (Global.lastOrientation == 'portrait' ? 1100 : 700) *
              this.scaleFact /* this.c_w * .5 + 200 * this.scaleFact *-0.5 */,
          this.c_h - this.extraTop - 400 * this.scaleFact,
          'items',
          `crate_${Global.totalBottles}_back0000`
        )
          .setDepth(11 + Global.extraDepth)
          .setData('readyToDrag', true)
          .setAlpha(0)
          .setScale(this.scaleFact * 1.5 * (this.bottleSets == 2 ? 0.85 : 1));
        this.crateFront = this.create(
          this.extraLeftPer +
            this.extraTop / 4 +
            (Global.lastOrientation == 'portrait' ? 1100 : 700) *
              this.scaleFact /* this.c_w * .5 + 200 * this.scaleFact *-0.5 */,
          this.c_h - this.extraTop - 400 * this.scaleFact,
          'items',
          `crate_${this.bottleSets == 2 ? 12 : Global.totalBottles}_front0000`
        )
          .setDepth(12 + Global.extraDepth + this.bottleSets * 2)
          .setAlpha(0)
          // .setData('readyToDrag', true)
          .setScale(this.scaleFact * 1.5 * (this.bottleSets == 2 ? 0.85 : 1));
      } else {
        this.bottleSets = 4;
        this.crate = this.create(
          this.extraLeftPer +
            this.extraTop / 4 +
            (Global.lastOrientation == 'portrait' ? 1100 : 700) *
              this.scaleFact /* this.c_w * .5 + 200 * this.scaleFact *-0.5 */,
          this.c_h - this.extraTop - 400 * this.scaleFact,
          'items',
          `crate_${Global.totalBottles}_10000`
        )
          .setDepth(11 + Global.extraDepth)
          .setAlpha(0)
          .setData('readyToDrag', true)
          .setScale(this.scaleFact * 1.5 * 0.85);

        this.crateChannel1 = this.create(
          this.extraLeftPer +
            this.extraTop / 4 +
            (Global.lastOrientation == 'portrait' ? 1100 : 700) *
              this.scaleFact /* this.c_w * .5 + 200 * this.scaleFact *-0.5 */,
          this.c_h - this.extraTop - 400 * this.scaleFact,
          'items',
          `crate_${Global.totalBottles}_30000`
        )
          .setDepth(13 + Global.extraDepth)
          .setAlpha(0)
          .setScale(this.scaleFact * 1.5 * 0.85);

        this.crateChannel2 = this.create(
          this.extraLeftPer +
            this.extraTop / 4 +
            (Global.lastOrientation == 'portrait' ? 1100 : 700) *
              this.scaleFact /* this.c_w * .5 + 200 * this.scaleFact *-0.5 */,
          this.c_h - this.extraTop - 400 * this.scaleFact,
          'items',
          `crate_${Global.totalBottles}_70000`
        )
          .setDepth(17 + Global.extraDepth)
          .setAlpha(0)
          .setScale(this.scaleFact * 1.5 * 0.85);

        this.crateFront = this.create(
          this.extraLeftPer +
            this.extraTop / 4 +
            (Global.lastOrientation == 'portrait' ? 1100 : 700) *
              this.scaleFact /* this.c_w * .5 + 200 * this.scaleFact *-0.5 */,
          this.c_h - this.extraTop - 400 * this.scaleFact,
          'items',
          `crate_${Global.totalBottles}_80000`
        )
          .setDepth(18 + Global.extraDepth)
          .setAlpha(0)
          // .setData('readyToDrag', true)
          .setScale(this.scaleFact * 1.5 * 0.85);
      }

      for (let i = 1; i <= this.bottleSets; i++) {
        this[`bottle_set${i}`] = this.create(
          this.crate.x +
            (this.bottleSets == 2
              ? (i == 1 ? -0.22 : 0.22) * this.crate.width * this.crate.scaleX
              : 0),
          this.crate.y +
            ((((Global.totalBottles == 6 || this.bottleSets == 2 ? 1 : i) -
              2.5) *
              150 *
              this.scaleFact) /
              this.shrinkFact) *
              (Global.totalBottles == 6 || this.bottleSets == 2 ? 0.7 : 0.85),
          `bottles_group_${Global.totalBottles}`,
          ''
        )
          .setScale(
            this.scaleFact * 1.5 * (Global.totalBottles == 6 ? 1 : 0.85)
          )
          .setAlpha(0)
          .setData('filled', false)
          .setDepth((i == 1 ? 12 : i + 13) + Global.extraDepth);
      }

      this.crate.setData('initX', this.crate.x);
      this.crate.setData('initY', this.crate.y);

      this.crates.push(this.crate);
      this.showCrate();
    }, 100);
  }
  onSkip() {
    this.scene.tweens.add({
      targets: this.children.entries,
      ease: 'Back.Out',
      y: `+=${1000 * this.scaleFact}`,
      duration: 250,
      repeat: 0,
      delay: 0,
      yoyo: false,
      onComplete: function () {
        this.clear(true, true);
      }.bind(this),
    });
  }
  showCrate() {
    this.children.entries.forEach((child) => {
      child.y += 1000 * this.scaleFact;
    });
    this.crate.setAlpha(1);
    this.crateFront.setAlpha(1);
    this.crateChannel1 && this.crateChannel1.setAlpha(1);
    this.crateChannel2 && this.crateChannel2.setAlpha(1);
    this.scene.tweens.add({
      targets: this.children.entries,
      ease: 'Back.Out',
      y: `-=${1000 * this.scaleFact}`,
      duration: 200,
      repeat: 0,
      delay: 0,
      yoyo: false,
    });
  }
  showGroupHighlight(bottleFrame) {
    let newBottleFrame =
      bottleFrame.indexOf('dummy') != -1 ? 'dummy' : bottleFrame;

    Global.bottleOnCrate = false;
    if (Global.crateType == 'fixed') {
      for (let i = 1; i <= Global.totalBottles / 6; i++) {
        //_group
        if (!this[`bottle_set${i}`].scene) continue;

        this[`bottle_set${i}`].setTexture(
          `${newBottleFrame.split('_single')[0].split('_group')[0]}_group`
        );
        this[`bottle_set${i}`].setData('keyRef', bottleFrame);
        // this[`bottle_set${i}`].setFrame(bottleFrame);
        this[`bottle_set${i}`].setVisible(true).setAlpha(0.5);

        Global.bottleOnCrate = true;
      }
    } else {
      if (!this[`bottle_set${this.filledIndex}`].scene) return;
      this[`bottle_set${this.filledIndex}`].setTexture(
        `${newBottleFrame.split('_single')[0].split('_group')[0]}_group`
      );
      this[`bottle_set${this.filledIndex}`].setData('keyRef', bottleFrame);
      // this[`bottle_set${this.filledIndex}`].setFrame(bottleFrame);
      this[`bottle_set${this.filledIndex}`].setVisible(true).setAlpha(0.5);

      Global.bottleOnCrate = true;
    }
  }
  hideGroupHighlight() {
    if (Global.crateType == 'fixed') {
      for (let i = 1; i <= Global.totalBottles / 6; i++) {
        this[`bottle_set${i}`].setAlpha(0);
      }
    } else {
      this[`bottle_set${this.filledIndex}`].setAlpha(0);
    }
    Global.bottleOnCrate = false;
  }
  checkOnDrag(bottleBound, bottleFrame) {
    if (!Global.crateActivated || Global.popupActive) return false;

    if (bottleFrame.indexOf('crate') !== -1 || !this.nextSpotFound)
      return false;

    var boundsA = this.crate.getBounds();
    var boundsB = bottleBound;
    let overlapCheck = Phaser.Geom.Intersects.GetRectangleIntersection(
      boundsA,
      boundsB
    );

    // this.showGroupHighlight(bottleFrame);

    this.showGroupHighlight(bottleFrame);
    // Global.bottleOnCrate = true;
    // if (
    //   overlapCheck.width >= boundsB.width * 0.75 &&
    //   overlapCheck.height >= boundsB.height * 0.1
    // ) {
    //   this.showGroupHighlight(bottleFrame); //`${bottleFrame.split('0000')[0]}_group0000`);
    // } else {
    //   this.hideGroupHighlight();
    // }
  }
  addBottle() {
    if (!this.nextSpotFound || Global.popupActive) return false;

    if (Global.crateType == 'fixed') {
      for (let i = 1; i <= Global.totalBottles / 6; i++) {
        this[`bottle_set${i}`].setAlpha(1);

        let bottle = this[`bottle_set${i}`];

        this[`bottle_set${i}ToDrag`] = this.create(
          bottle.x,
          bottle.y,
          /* `bottles_group_${Global.totalBottles}`, */ `${bottle.texture.key}` /* bottle.texture.key */
        )
          .setScale(bottle.scaleX)
          .setData('filledIndex', i)
          .setData('fromCrate', true)
          .setDepth(this[`bottle_set${i}`].depth);
        this[`bottle_set${i}ToDrag`].setInteractive({
          draggable: false,
          cursor: 'pointer',
          pixelPerfect: true,
        });

        this[`bottle_set${i}`].setVisible(false);
        // this[`bottle_set${i}ToDrag`].setVisible(false);

        this.lastDraggedIndex = i;

        this.filledBottles[i - 1] = bottle.getData('keyRef'); //bottle.texture.key;
        this.filledIndeces.push(i);
        this.updateNextFillIndex();
      }
    } else {
      this[`bottle_set${this.filledIndex}`].setAlpha(1);

      let bottle = this[`bottle_set${this.filledIndex}`];
      this[`bottle_set${this.filledIndex}ToDrag`] = this.create(
        bottle.x,
        bottle.y,
        /* `bottles_group_${Global.totalBottles}`, */ bottle.texture.key
      )
        .setScale(bottle.scaleX)
        .setData('filledIndex', this.filledIndex)
        .setData('fromCrate', true)
        .setDepth(this[`bottle_set${this.filledIndex}`].depth);
      this[`bottle_set${this.filledIndex}ToDrag`].setInteractive({
        draggable: false,
        cursor: 'pointer',
        pixelPerfect: true,
      });
      this.filledBottles[this.filledIndex - 1] = bottle.getData('keyRef'); //bottle.texture.key;
      this.filledIndeces.push(this.filledIndex);
      this.updateNextFillIndex();
    }

    Global.bottleOnCrate = false;
  }
  removeLastCrateBottleSet() {
    if (/* this.lastDraggedIndex != -1 && */ !this.nextSpotFound) {
      if (Global.crateType == 'fixed') {
        for (let i = this.filledIndex; i > 0; i--) {
          this[`bottle_set${i}`].setVisible(false);
          this[`bottle_set${i}ToDrag`].setVisible(false);
        }
        Global.emitter.emit('rack:reset_swap_crate');
        Global.emitter.emit('rack:hide_all_clickable');
        // this.filledIndeces = [];
        // this.filledBottles = [];
      } else {
        this[`bottle_set${this.bottleSets}`].setVisible(false);
        this[`bottle_set${this.bottleSets}ToDrag`].setVisible(false);
        Global.emitter.emit('rack:reset_swap_crate');
        Global.emitter.emit('rack:hide_all_clickable');
        this.filledIndex = this.bottleSets;
        // this.filledIndex--;
      }

      // this.filledIndex = 1;
      this.nextSpotFound = true;
    }
    this.lastDraggedIndex = -1;
  }
  updateNextFillIndex() {
    this.nextSpotFound = false;
    for (let i = 1; i <= this.bottleSets; i++) {
      if (this.filledIndeces.indexOf(i) == -1 && !this.nextSpotFound) {
        this.filledIndex = i;
        this.nextSpotFound = true;
      }
    }

    if (!this.nextSpotFound) {
      this.enableCrateToDrag();
    }
  }
  disableCrateToDrag() {
    this.crate.disableInteractive();
    this.crateFront.disableInteractive();
    Global.crateCanBeDragged = false;
    Global.emitter.emit('rack:hide_all_clickable');
  }
  enableCrateToDrag() {
    this.crate.setInteractive({
      draggable: !Global.isMobile && false,
      cursor: 'pointer',
      pixelPerfect: true,
    });
    this.crateFront.setInteractive({
      draggable: !Global.isMobile && false,
      cursor: 'pointer',
      pixelPerfect: true,
    });
    Global.crateCanBeDragged = true;
    // if(Global.isMobile){

    Global.emitter.emit('rack:reset_swap_crate');
    Global.emitter.emit('rack:hide_all_clickable');

    Global.emitter.emit(
      'rack:highlight_empty_space',
      false,
      Global.totalBottles
    );
    // }
  }
  removeBottle() {
    this[`bottle_set${this.filledIndex}`].setAlpha(0);
  }
  removeCrate(callFinalCb = true) {
    this.children.entries.forEach((child) => {
      child.disableInteractive();
    });
    this.scene.tweens.add({
      targets: this.children.entries,
      ease: 'Back.In',
      scale: 0,
      duration: callFinalCb ? 150 : 0,
      repeat: 0, // -1: infinity
      yoyo: false,
      onComplete: callFinalCb
        ? this.onDragRemoved.bind(this)
        : function () {
            this.clear(true, true);
          }.bind(this),
    });
  }
  onDragRemoved() {
    this.clear(true, true);
    setTimeout(() => {
      // Global.emitter.emit('crate_selection:enable');
      Global.emitter.emit('header:show_skip');
    }, 250);
    Global.emitter.emit('bin:reset_bin');
  }
  resetCrate() {
    if (!this.crate.getData('readyToDrag') || Global.popupActive) return false;

    this.crate.setData('readyToDrag', false);

    this.shrinkTwn && this.shrinkTwn.remove();
    this.children.entries.forEach((child) => {
      this.scene.tweens.add({
        targets: child,
        ease: 'Back.InOut',
        x: child.getData('initX'),
        y: child.getData('initY'),
        duration: 350,
        repeat: 0, // -1: infinity
        yoyo: false,
      });
    });
    // alert(this.shrinkScalFact)
    /* let scaleObj={
            'value':1
        } */
    this.scene.tweens.add({
      targets: this.scaleObj,
      ease: 'Back.InOut',
      value: 1,
      duration: 350,
      repeat: 0, // -1: infinity
      yoyo: false,
      onUpdate: function (twn) {
        this.children.entries.forEach((child) => {
          child.setScale(child.getData('initScale') * this.scaleObj['value']);
        });
        this.shrinkFact = 1.5 - twn.progress * 0.5;
      }.bind(this),
      onComplete: function () {
        this.crate.setData('readyToDrag', true);
      }.bind(this),
    });
    Global.emitter.emit('rack:hide_highlight');
  }
  dropFilledCrateAt(dropPos) {
    // dropPos.x-=500*this.scaleFact
    this.crate &&
      this.crate.scene &&
      this.crate
        .setPosition(dropPos.x, dropPos.y)
        .setScale(this.crate.scaleX * 0.3);
    this.crateFront &&
      this.crateFront.scene &&
      this.crateFront
        .setPosition(dropPos.x, dropPos.y)
        .setScale(this.crateFront.scaleX * 0.3);
    this.crateChannel1 &&
      this.crateChannel1.scene &&
      this.crateChannel1
        .setPosition(dropPos.x, dropPos.y)
        .setScale(this.crateChannel1.scaleX * 0.3);
    this.crateChannel2 &&
      this.crateChannel2.scene &&
      this.crateChannel2
        .setPosition(dropPos.x, dropPos.y)
        .setScale(this.crateChannel2.scaleX * 0.3);

    for (let i = 1; i <= this.bottleSets; i++) {
      this[`bottle_set${i}`] &&
        this[`bottle_set${i}`].scene &&
        this[`bottle_set${i}`]
          .setPosition(
            this.crate.x,
            this.crate.y +
              (((i - 2.5) * 150 * this.scaleFact) / this.shrinkFact) *
                (Global.totalBottles == 6 ? 0.7 : 0.85) *
                0.3
          )
          .setScale(
            this.scaleFact * 1.5 * (Global.totalBottles == 6 ? 1 : 0.85) * 0.3
          );
      this[`bottle_set${i}ToDrag`] &&
        this[`bottle_set${i}ToDrag`].scene &&
        this[`bottle_set${i}ToDrag`]
          .setPosition(this[`bottle_set${i}`].x, this[`bottle_set${i}`].y)
          .setScale(
            this.scaleFact * 1.5 * (Global.totalBottles == 6 ? 1 : 0.85) * 0.3
          );
    }
    Global.emitter.emit('rack:hide_all_clickable');
    Global.emitter.emit('rack:check_to_place', true, this.filledBottles);
  }
  onDragEnd(pointer, gameObject, dragX, dragY) {
    if (!Global.crateActivated || Global.popupActive) return false;

    if (!gameObject.getData('fromCrate')) {
      if (
        (gameObject == this.crate || gameObject == this.crateFront) &&
        this.crateDragged
      ) {
        this.crateDragged = false;
        if (Global.canDispose) {
          this.removeCrate();
          setTimeout(() => {
            Global.emitter.emit('crate:add_crate');
            Global.emitter.emit(
              'bottle:add_new',
              Global.lastBottleKey,
              false,
              false
            );
          }, 250);
        } else {
          Global.emitter.emit('rack:check_to_place', true, this.filledBottles);
        }
      }

      return false;
    }

    if (!Global.bottleOnCrate) {
      this.disableCrateToDrag();
      Global.emitter.emit('crate:remove_crate_bottle');
    } else {
      Global.emitter.emit('crate:add_crate_bottle');
    }
    this.updateNextFillIndex();
    // if(this.nextSpotFound)
    // al
    this.scene.tweens.add({
      targets: gameObject,
      ease: 'Back.In',
      scale: 0,
      duration: 150,
      repeat: 0, // -1: infinity
      yoyo: false,
      onComplete: function (gameObject) {
        gameObject.destroy(true, true);
      }.bind(this, gameObject),
    });
  }
  onResize() {
    setScaleFactor.call(this, false);

    this.crate &&
      this.crate.scene &&
      this.crate
        .setPosition(
          this.extraLeftPer +
            this.extraTop / 4 +
            (Global.lastOrientation == 'portrait' ? 1100 : 700) *
              this.scaleFact,
          this.c_h - this.extraTop - 400 * this.scaleFact
        )
        .setScale(this.scaleFact * 1.5 * (Global.totalBottles == 6 ? 1 : 0.85));

    this.crateFront &&
      this.crateFront.scene &&
      this.crateFront
        .setPosition(
          this.extraLeftPer +
            this.extraTop / 4 +
            (Global.lastOrientation == 'portrait' ? 1100 : 700) *
              this.scaleFact,
          this.c_h - this.extraTop - 400 * this.scaleFact
        )
        .setScale(this.scaleFact * 1.5 * (Global.totalBottles == 6 ? 1 : 0.85));

    this.crateChannel1 &&
      this.crateChannel1.scene &&
      this.crateChannel1
        .setPosition(
          this.extraLeftPer +
            this.extraTop / 4 +
            (Global.lastOrientation == 'portrait' ? 1100 : 700) *
              this.scaleFact,
          this.c_h - this.extraTop - 400 * this.scaleFact
        )
        .setScale(this.scaleFact * 1.5 * (Global.totalBottles == 6 ? 1 : 0.85));

    this.crateChannel2 &&
      this.crateChannel2.scene &&
      this.crateChannel2
        .setPosition(
          this.extraLeftPer +
            this.extraTop / 4 +
            (Global.lastOrientation == 'portrait' ? 1100 : 700) *
              this.scaleFact,
          this.c_h - this.extraTop - 400 * this.scaleFact
        )
        .setScale(this.scaleFact * 1.5 * (Global.totalBottles == 6 ? 1 : 0.85));

    for (let i = 1; i <= this.bottleSets; i++) {
      this[`bottle_set${i}`] &&
        this[`bottle_set${i}`].scene &&
        this[`bottle_set${i}`]
          .setPosition(
            this.crate.x +
              (this.bottleSets == 2
                ? (i == 1 ? -0.22 : 0.22) * this.crate.width * this.crate.scaleX
                : 0),
            this.crate.y +
              ((((Global.totalBottles == 6 || this.bottleSets == 2 ? 1 : i) -
                2.5) *
                150 *
                this.scaleFact) /
                this.shrinkFact) *
                (Global.totalBottles == 6 || this.bottleSets == 2 ? 0.7 : 0.85)
          )
          .setScale(
            this.scaleFact * 1.5 * (Global.totalBottles == 6 ? 1 : 0.85)
          );
      this[`bottle_set${i}ToDrag`] &&
        this[`bottle_set${i}ToDrag`].scene &&
        this[`bottle_set${i}ToDrag`]
          .setPosition(this[`bottle_set${i}`].x, this[`bottle_set${i}`].y)
          .setScale(
            this.scaleFact * 1.5 * (Global.totalBottles == 6 ? 1 : 0.85)
          );
    }

    if (this.crate && this.crate.scene) {
      this.crate.setData('initX', this.crate.x);
      this.crate.setData('initY', this.crate.y);
    }
  }
}
