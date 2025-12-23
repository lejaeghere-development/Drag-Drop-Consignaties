import { CANVAS } from 'phaser';
import EventEmitter from './event-emitter';
import { Global } from './global';
import { setScaleFactor } from './scale_factor';

export default class Rack extends Phaser.GameObjects.Group {
  constructor(game) {
    super(game);
    if (!Global.rackTriggered) {
      Global.rackTriggered = true;
      document
        .querySelector('#delete_confirm #confirm')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          this.deleteSecondRack();
        });
      document
        .querySelector('#delete_confirm #cancel')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          this.hideDeleteConfirm();
        });
    }
  }
  setUp() {
    this.rackIndecsToHide = [];
    window.racks = parseInt(window.racks);
    Global.totalCustomCrates = 0;
    setScaleFactor.call(this, false);
    this.emitter = EventEmitter.getObj();
    Global.emitter.on('rack:check_on_drag', this.checkOnDrag.bind(this));
    Global.emitter.on('rack:bring_top', this.updateRackDepth.bind(this, 1200));
    Global.emitter.on('rack:bring_back', this.updateRackDepth.bind(this, 0));
    Global.emitter.on('rack:hide_highlight', this.hideHighlight.bind(this));
    Global.emitter.on('rack:check_to_place', this.checkToPlace.bind(this));
    Global.emitter.on('rack:reset_position', this.resetCrateOnRack.bind(this));
    Global.emitter.on('game:skip', this.onSkip.bind(this));
    Global.emitter.on('game:resize', this.onResize.bind(this));
    Global.emitter.on('game:show', this.showGame.bind(this));
    Global.emitter.on('hint:show', this.highlightPlaceHolders.bind(this, true));
    Global.emitter.on('search:show', () => {
      this.arrowLeft && this.arrowLeft.setVisible(true);
      this.arrowRight && this.arrowRight.setVisible(true);
      this.rackInfoTxt && this.rackInfoTxt.setVisible(true);
    });
    Global.emitter.on('rack:reset', () => {
      for (let i = 1; i <= window.racks; i++) {
        setTimeout(() => {
          this.navigateToNextRack(1, 0);
        }, i * 100);
      }
      this.navigateToNextRack.bind(this, -1, 0);
    });
    Global.emitter.on('rack:slide', this.navigateToNextRack.bind(this, -1, 0));
    Global.emitter.on(
      'hint:hide',
      this.highlightPlaceHolders.bind(this, false)
    );

    Global.emitter.on(
      'crate_selection:hide',
      this.showOrHideUI.bind(this, true)
    );
    Global.emitter.on(
      'rack:update_availability',
      this.calculateFilledTotal.bind(this)
    );
    Global.emitter.on('hint:hide', () => {
      this.hintDelay && this.hintDelay.remove();
    });
    Global.emitter.on(
      'rack:highlight_empty_space',
      this.highlightEmptySpaces.bind(this)
    );
    Global.emitter.on(
      'rack:hide_all_clickable',
      this.hideAllClickable.bind(this)
    );
    Global.emitter.on(
      'rack:reset_swap_crate',
      this.resetSelectedSwapCrate.bind(this)
    );

    this.highlightsClickable = {};
    this.crateSelectedToRemove = null;
    this.crateSelectedToSwap = null;
    this.highlightRef = null;
    this.lastCustomCrate = null;
    this.lastCustomCrateInfo = null;
    this.lastcustomCrateIndex = null;
    this.canCheckDrag = false;
    this.dragStartKey = null;
    this.dragProgressKey = null;
    Global.crateData = {};
    this.rackNavigateIndex = 0;
    this.lastRackNavigateIndex = 0;

    for (i = window.racks; i > 0; i--) {
      Global.crateData[`rack${i}_left_1`] = {
        status: 'empty',
        filledBottles: null,
        position: {
          x: -180,
          y: -940,
        },
        isBig: false,
        crateType: null,
      };
      Global.crateData[`rack${i}_right_1`] = {
        status: 'empty',
        filledBottles: null,
        position: {
          x: 180,
          y: -940,
        },
        isBig: false,
        crateType: null,
      };
      Global.crateData[`rack${i}_left_2`] = {
        status: 'empty',
        filledBottles: null,
        position: {
          x: -180,
          y: -485,
        },
        isBig: false,
        crateType: null,
      };
      Global.crateData[`rack${i}_right_2`] = {
        status: 'empty',
        filledBottles: null,
        position: {
          x: 180,
          y: -485,
        },
        isBig: false,
        crateType: null,
      };
      Global.crateData[`rack${i}_left_3`] = {
        status: 'empty',
        filledBottles: null,
        position: {
          x: -180,
          y: -30,
        },
        isBig: false,
        crateType: null,
      };
      Global.crateData[`rack${i}_right_3`] = {
        status: 'empty',
        filledBottles: null,
        position: {
          x: 180,
          y: -30,
        },
        isBig: false,
        crateType: null,
      };
      Global.crateData[`rack${i}_left_4`] = {
        status: parseInt(window.showEmpty) && i == 1 ? 'taken' : 'empty',
        filledBottles: null,
        position: {
          x: -180,
          y: 425,
        },
        isBig: false,
        crateType: null,
      };
      Global.crateData[`rack${i}_right_4`] = {
        status: parseInt(window.showEmpty) && i == 1 ? 'taken' : 'empty',
        filledBottles: null,
        position: {
          x: 180,
          y: 425,
        },
        isBig: false,
        crateType: null,
      };
    }

    this.rackInfo = {
      rack: 'rack1',
      shelf: 4,
      side: 'left',
    };
    this.placedCrates = [
      {
        crate: [],
        bottles: [],
      },
    ];
    this.matchShelfFound = false;
    this.isBigCrate = false;
    this.crateDragged = false;
  }
  calculateFilledTotal() {
    Global.filledTotal = 0;
    Object.keys(Global.crateData).forEach((key) => {
      if (
        Global.crateData[key]['filledBottles'] !== null &&
        Global.crateData[key]['filledBottles'].length > 0
      ) {
        if (
          !Global.crateData[key]['isBig'] ||
          (Global.crateData[key]['isBig'] && key.indexOf('left') !== -1) /*  && 
                    (this.rack1.visible || (!this.rack1.visible && key != "rack_right_4")) */
        ) {
          Global.filledTotal += Global.crateData[key]['isBig'] ? 1 : 0.5;
        }
      }
    });
  }
  init() {
    this.initConfigDone = false;

    this.rackControls = new Phaser.GameObjects.Group(this.scene);
    this.rackGr = new Phaser.GameObjects.Group(this.scene);

    if (window.racks > 2) {
      this.arrowRight = this.rackControls
        .create(
          this.c_w -
            this.extraLeftPer -
            this.extraTop / 2 -
            1200 * this.scaleFact,
          this.c_h * 0.5 - 880 * this.scaleFact,
          'arrow'
        )
        .setVisible(false)
        .setScale(this.scaleFact * 0.5)
        .setInteractive({
          cursor: 'pointer',
        })
        .on('pointerdown', this.navigateToNextRack.bind(this, -1, 500));
      this.rackInfoTxt = this.scene.make
        .text({
          x:
            this.c_w -
            this.extraLeftPer -
            this.extraTop / 2 -
            1580 * this.scaleFact,
          y: this.c_h * 0.5 - 880 * this.scaleFact,
          text: `2/4 Racks`,
          origin: {
            x: 0.5,
            y: 0.5,
          },
          style: {
            font: Global.isMobile
              ? '' + String(70 * this.scaleFact) + 'px greycliff-medium'
              : '' + String(70 * this.scaleFact) + 'px greycliff-medium',
            fill: '#54A383',
            align: 'center',
          },
        })
        .setVisible(false);
      this.rackControls.add(this.rackInfoTxt);
      this.arrowLeft = this.rackControls
        .create(
          this.c_w -
            this.extraLeftPer -
            this.extraTop / 2 -
            1950 * this.scaleFact,
          this.c_h * 0.5 - 880 * this.scaleFact,
          'arrow'
        )
        .setScale(-this.scaleFact * 0.5, this.scaleFact * 0.5)
        .setInteractive({
          cursor: 'pointer',
        })
        .setAlpha(0.5)
        .setVisible(false)
        .on('pointerdown', this.navigateToNextRack.bind(this, 1, 500));
      this.navigateToNextRack(Math.ceil((window.racks - 2) / 2), 0);
      this.rackContainerMaskGr = this.scene.add.graphics();
      this.rackContainerMaskGr.fillStyle(0xffffff, 1.0);
      this.rackControls.add(this.rackContainerMaskGr);
      this.rackContainerMaskGr.fillRect(
        0,
        this.extraTop + 300 * this.scaleFact,
        this.c_w -
          this.extraLeftPer -
          this.extraTop / 2 -
          (900 + 1800 + 450) * this.scaleFact,
        this.c_h - 300 * this.scaleFact
      );

      this.rackContainerMaskGr.setDepth(1400);
    }

    for (i = 1; i <= window.racks; i++) {
      this[`rack${i}`] = this.create(
        this.c_w -
          this.extraLeftPer -
          this.extraTop / 2 -
          (900 + 1350 * (i - 1)) * this.scaleFact,
        this.c_h * 0.5 + 250 * this.scaleFact,
        'items',
        'rack0000'
      )
        .setDepth(1200)
        .setData('canShow', true)
        .setScale(this.scaleFact * 1.4);

      // this[`rack${i}`].mask = rackMask;
    }

    this.deleteCrateBtn = this.create(
      this.c_w -
        this.extraLeftPer -
        (100 + 200 + 150) * this.scaleFact -
        this.extraTop / 2,
      this.c_h * 0.5 - 700 * this.scaleFact,
      'items',
      'closeBtn_10000'
    )
      .setScale(this.scaleFact * (Global.isMobile ? 2 : 1.5))
      .setAlpha(0)
      .setInteractive({
        cursor: 'pointer',
      })
      .setDepth(1200 + 1)
      .on('pointerdown', this.checkIfCanRemoveForMobile.bind(this));

    this.addBtn = this.create(
      this.c_w -
        this.extraLeftPer -
        this.extraTop / 2 -
        (100 + 650 + 150) * this.scaleFact,
      this.c_h * 0.5 - 0 * this.scaleFact,
      'items',
      'addBtn0000'
    )
      .setScale(this.scaleFact * 1.3)
      .setVisible(false)
      .setInteractive({
        cursor: 'pointer',
      })
      .on('pointerdown', this.addRack.bind(this));

    this.highlight = this.create(
      this.rack1.x,
      this.rack1.y + 425 * this.scaleFact,
      'items',
      'crate_24_outline0000'
    )
      .setAlpha(0)
      .setDepth(1200)
      .setScale(this.scaleFact * 0.7);

    this.highlightRef = this.highlight;

    this.scene.input.on('dragstart', this.onDragStart.bind(this));
    this.scene.input.on('drag', this.onBottleDrag.bind(this));
    this.scene.input.on('dragend', this.onDragEnd.bind(this));

    if (Global.isMobile || true) {
      Object.keys(Global.crateData).forEach((crateDataKey) => {
        let rack = this[crateDataKey.split('_')[0]];
        let posData = Global.crateData[crateDataKey]['position'];

        this[`highlight_${crateDataKey}`] = this.create(
          rack.x + posData.x * this.scaleFact,
          rack.y + posData.y * this.scaleFact,
          'items',
          'crate_6_outline0000'
        )
          .setAlpha(0)
          .setDepth(1200)
          .setData(
            'rackIndex',
            parseInt(crateDataKey.split('_')[0].split('rack')[1])
          )
          .setData('depth', 1200)
          .setInteractive()
          .on('pointerdown', (pointer) => {
            // alert(pointer.target);
            if (
              Global.popupActive ||
              // Global.isMobile ||
              // !pointer.target ||
              (pointer.target && pointer.target.getContext == undefined)
            )
              return false;
            // alert(Global.popupActive);
            const rackIndex = crateDataKey.split('_')[0]
              ? parseInt(crateDataKey.split('_')[0].split('rack')[1])
              : 1;
            if (this.rackIndecsToHide.indexOf(rackIndex) != -1) return false;

            this.emitter.emit('hint:hide');
            this.isBigCrate = false;
            this.matchShelfFound = true;

            this.rackInfo = {
              rack: crateDataKey.split('_')[0],
              shelf: parseInt(crateDataKey.split('_')[2]),
              side: crateDataKey.split('_')[1],
            };
            // this.highlightRef=  this[`highlight_${crateDataKey}`];
            this.highlight.setPosition(
              rack.x + posData.x * this.scaleFact,
              rack.y + posData.y * this.scaleFact
            );

            if (this.crateSelectedToSwap != null) {
              Global.emitter.emit(
                'rack:check_to_place',
                false,
                this.crateSelectedToSwap
              );
              Global.emitter.emit('rack:hide_all_clickable');
            } else {
              Global.emitter.emit('drop_filled_crate_at', {
                x: rack.x + posData.x * this.scaleFact,
                y: rack.y + posData.y * this.scaleFact,
              });
            }
          })
          .setScale(this.scaleFact * 0.7);

        this.highlightsClickable[crateDataKey] =
          this[`highlight_${crateDataKey}`];
        if (crateDataKey.indexOf('right') != -1) {
          this[`highlight_${crateDataKey.replace('right', 'center')}`] =
            this.create(
              rack.x,
              rack.y + posData.y * this.scaleFact,
              'items',
              'crate_24_outline0000'
            )
              .setDepth(1200)
              .setData('depth', 1200)
              .setAlpha(0)
              .setData(
                'rackIndex',
                parseInt(crateDataKey.split('_')[0].split('rack')[1])
              )
              .setInteractive()
              .on('pointerdown', (pointer) => {
                if (
                  /*  Global.popupActive ||
                  ((Global.isMobile || true) &&
                    (!pointer.target ||
                      (pointer.target &&
                        pointer.target.getContext == undefined))) */
                  Global.popupActive ||
                  // Global.isMobile ||
                  /* !pointer.target || */
                  (pointer.target && pointer.target.getContext == undefined)
                )
                  return false;

                const rackIndex = crateDataKey.split('_')[0]
                  ? parseInt(crateDataKey.split('_')[0].split('rack')[1])
                  : 1;
                if (this.rackIndecsToHide.indexOf(rackIndex) != -1)
                  return false;

                this.hintDelay && this.hintDelay.remove();
                this.emitter.emit('hint:hide');
                this.isBigCrate = true;
                this.matchShelfFound = true;

                this.rackInfo = {
                  rack: crateDataKey.split('_')[0],
                  shelf: parseInt(crateDataKey.split('_')[2]),
                  side: 'right',
                };

                // this.highlightRef=  this[`highlight_${crateDataKey}`];
                this.highlight.setPosition(
                  rack.x,
                  rack.y + posData.y * this.scaleFact
                );

                if (this.crateSelectedToSwap != null) {
                  Global.emitter.emit(
                    'rack:check_to_place',
                    false,
                    this.crateSelectedToSwap
                  );
                  Global.emitter.emit('rack:hide_all_clickable');
                } else {
                  Global.emitter.emit('drop_filled_crate_at', {
                    x: rack.x,
                    y: rack.y + posData.y * this.scaleFact,
                  });
                }
              })
              .setScale(this.scaleFact * 0.7);
          this.highlightsClickable[crateDataKey.replace('right', 'center')] =
            this[`highlight_${crateDataKey.replace('right', 'center')}`];
        }
      });
    }

    this.addCardInfo();

    this.rackInfo = {
      rack: 'rack1',
      shelf: 4,
      side: 'left',
    };
    Global.totalBottles = 24;
    this.isBigCrate = true;
    if (parseInt(window.showEmpty)) {
      this.addCrateOnShelf([], this.rack1, '4');
      this[`rack1_shelf4_left_info_txt`].setText('Leeggoed');
    }

    this.setVisible(false);
  }
  highlightPlaceHolders(status, data) {
    if (data && data.type == 'bottle') return false;
    this.emptyHighlights &&
      this.emptyHighlights.forEach((item) => {
        if (this.rackIndecsToHide.indexOf(item.getData('rackIndex')) != -1)
          return false;
        item.setDepth(status ? 2002 : item.getData('depth'));
      });
    if (!status) {
      this.emptyHighlights = [];
    }
  }
  navigateToNextRack(navIndex, twnTime = 1000) {
    if (this.rackTwn && this.rackTwn.progress < 1) return false;

    this.emitter.emit('hint:hide');
    this.rackNavigateIndex += navIndex;
    this.rackNavigateIndex = Math.max(0, this.rackNavigateIndex);

    this.rackNavigateIndex = Math.min(
      Math.ceil((window.racks - 2) / 2),
      this.rackNavigateIndex
    );

    let rackIndex = Math.min(
      window.racks,
      this.rackNavigateIndex * 2 + (window.racks % 2 == 0 ? 2 : 1)
    );

    rackIndex = window.racks - rackIndex + 2;
    rackIndex = Math.min(window.racks, rackIndex);
    this.rackIndex = rackIndex;

    this.rackInfoTxt &&
      this.rackInfoTxt.setText(`${rackIndex}/${window.racks} Racks`);

    this.arrowLeft && this.arrowLeft.setAlpha(1);
    this.arrowRight && this.arrowRight.setAlpha(1);
    if (rackIndex == 2) {
      this.arrowLeft && this.arrowLeft.setAlpha(0.5);
    }
    if (rackIndex == window.racks) {
      this.arrowRight && this.arrowRight.setAlpha(0.5);
    }
    if (this.lastRackNavigateIndex !== this.rackNavigateIndex) {
      const rackIndecsToShow = [
        window.racks - (rackIndex - 1),
        window.racks -
          (rackIndex -
            (window.racks % 2 == 1 && rackIndex == window.racks ? 1 : 2)),
      ];
      this.rackIndecsToHide = Array.from(
        { length: window.racks },
        (_, i) => i + 1
      ).filter((i) => !rackIndecsToShow.includes(i));

      this.rackTwn = this.scene.tweens.add({
        targets: this.children.entries,
        x: `+=${
          (Global.lastOrientation == 'portrait' ? 1100 : 1350) *
          2 *
          this.scaleFact *
          navIndex
        }`,
        ease: 'Cubic.InOut',
        duration: twnTime,
        onUpdate: (twn) => {
          this.rackIndecsToHide.forEach((ind) => {
            this[`rack${ind}`].setAlpha(1 - twn.progress);
          });
          rackIndecsToShow.forEach((ind) => {
            this[`rack${ind}`].setAlpha(twn.progress);
          });
        },
        onComplete: () => {
          this.rackIndecsToHide.forEach((ind) => {
            this[`rack${ind}`].setAlpha(0);
          });
          rackIndecsToShow.forEach((ind) => {
            this[`rack${ind}`].setAlpha(1);
          });
        },
      });
    }
    this.lastRackNavigateIndex = this.rackNavigateIndex;

    // this.rackContainer.x += 400 * this.scaleFact;
  }
  updateRackDepth(depth) {
    this.children.entries.forEach((item) => {
      item.setDepth(depth);
    });
  }
  addRack(pointer) {
    if (
      Global.popupActive ||
      ((Global.isMobile || true) /* !pointer.target || */ &&
        pointer.target &&
        pointer.target.getContext == undefined)
    )
      return false;

    this.addBtn.setVisible(false);
    this.rack1.setVisible(true);
    window.rack1Visible = true;
    this.rack1.setAlpha(1);
    this.rack1.setData('canShow', true);
    // this.deleteBtn.setData('canShow', true);

    this[`rack2_shelf4_right_info`].setAlpha(0);
    this[`rack2_shelf4_right_info_txt`].setAlpha(0);
    for (let j = 1; j <= 4; j++) {
      this[`rack${1}_shelf${j}_left_info`].setVisible(true);
      this[`rack${1}_shelf${j}_right_info`].setVisible(true);
      this[`rack${1}_shelf${j}_left_info_txt`].setVisible(true);
      this[`rack${1}_shelf${j}_right_info_txt`].setVisible(true);

      this[`rack${1}_shelf${j}_left_info`].setData('canShow', true);
      this[`rack${1}_shelf${j}_right_info`].setData('canShow', true);
      this[`rack${1}_shelf${j}_left_info_txt`].setData('canShow', true);
      this[`rack${1}_shelf${j}_right_info_txt`].setData('canShow', true);
    }

    let totalBottles = Global.totalBottles;
    Global.totalBottles = 24;
    this.isBigCrate = true;
    this.rackInfo = {
      rack: 'rack1',
      shelf: 4,
      side: 'left',
    };

    if (parseInt(window.showEmpty)) {
      this.addCrateOnShelf([], this.rack1, '4');
      this[`rack1_shelf4_left_info`].setAlpha(1);
      this[`rack1_shelf4_left_info_txt`].setAlpha(1);
      this[`rack1_shelf4_left_info_txt`].setText('Leeggoed');
    }
    Global.totalBottles = totalBottles;
    this.updateSkipFrame();

    if (Global.extraCrate) {
      [Global.extraCrate, ...Global.extraCrate.getData('crateItems')].forEach(
        (child) => {
          if (child.getData('infoBtn')) {
            child.getData('infoBtn').destroy(true);
          }
          child.destroy(true, true);
        }
      );
      if (parseInt(window.showEmpty)) {
        Global.crateData[`rack2_right_4`]['status'] = 'empty';
        Global.crateData[`rack2_right_4`]['filledBottles'] = null;
      }

      Global.extraCrate = null;
    }
    this.calculateCustomCrate();
    Global.emitter.emit('header:update_crate', 0);
    /* 
       
        */
    Global.emitter.emit(
      'rack:highlight_empty_space',
      this.crateSelectedToSwap != null
    );
  }
  calculateCustomCrate(turnOff = false) {
    if (
      /* this.rack1.visible &&  */ Global.totalCustomCrates >=
        window.racks /* ||
      (!this.rack1.visible && Global.totalCustomCrates >= 1) */ ||
      turnOff
    ) {
      Global.canUseCustomToggle = false;
      if (
        /* this.rack1.visible && */ Global.totalCustomCrates >=
        window.racks /*  ||
        (!this.rack1.visible && Global.totalCustomCrates >= 1) */
      ) {
        Global.emitter.emit('toggle:update', false, false);
      } else {
        Global.emitter.emit('toggle:update', false, true);
      }
    } else {
      Global.canUseCustomToggle = true;
      Global.emitter.emit('toggle:update', true, turnOff);
    }
  }
  showGame() {
    if (window.racks > 2) {
      this.arrowRight.setVisible(true);
      this.rackInfoTxt.setVisible(true);
      this.arrowLeft.setVisible(true);
    }
    this.children.entries.forEach((child) => {
      child.setInteractive();
    });
  }
  onSkip() {
    if (window.racks > 2) {
      this.arrowRight.setVisible(false);
      this.rackInfoTxt.setVisible(false);
      this.arrowLeft.setVisible(false);
    }
    return false;
    this.children.entries.forEach((child) => {
      child.disableInteractive();
      if (child !== this.addBtn) child.setVisible(true);
    });
    // this.addBtn.setVisible(false)
    this.deleteBtn.setVisible(false);
  }
  hideAllClickable(byPass) {
    if (!(Global.isMobile || true)) return false;

    Object.keys(this.highlightsClickable).forEach((key) => {
      this.highlightsClickable[key].setAlpha(0);
    });
    this.highlightRef = this.highlight;
    !byPass && (this.crateSelectedToSwap = null);
  }
  highlightEmptySpaces(byPass = false) {
    if (!(Global.isMobile || true)) return false;
    let isEmptyRemains = false;

    this.hideAllClickable(byPass);
    if (!Global.crateCanBeDragged && !byPass) return false;

    this.emitter.emit('hint:hide');
    if (!byPass && Global.crateCanBeDragged) {
      this.hintDelay = this.scene.time.addEvent({
        delay: 3000, // ms
        callback: function () {
          if (emptyHighlights.length > 0) this.emitter.emit('rack:bring_top');
          this.emitter.emit('hint:show', {
            type: 'rack',
            items: emptyHighlights,
            rackIndecsToHide: this.rackIndecsToHide,
          });
        }.bind(this),
        loop: false,
      });
    }
    let emptyHighlights = [];
    Object.keys(Global.crateData).forEach((crateDataKey) => {
      let rack = this[crateDataKey.split('_')[0]];

      if (
        Global.crateData[crateDataKey]['status'] === 'empty' &&
        rack.visible
      ) {
        if (
          (Global.isMobile || true) &&
          ((crateDataKey.indexOf('right') != -1 &&
            Global.crateData[crateDataKey.replace('right', 'left')][
              'status'
            ] === 'empty') ||
            (crateDataKey.indexOf('left') != -1 &&
              Global.crateData[crateDataKey.replace('left', 'right')][
                'status'
              ] === 'empty')) &&
          Global.totalBottles == 24
        ) {
          if (crateDataKey.indexOf('right') != -1) {
            emptyHighlights.push(
              this[`highlight_${crateDataKey.replace('right', 'center')}`]
            );
            this[
              `highlight_${crateDataKey.replace('right', 'center')}`
            ].setAlpha(1);
          } else {
            emptyHighlights.push(
              this[`highlight_${crateDataKey.replace('left', 'center')}`]
            );
            this[
              `highlight_${crateDataKey.replace('left', 'center')}`
            ].setAlpha(1);
          }
        } else if (Global.totalBottles == 6) {
          emptyHighlights.push(this[`highlight_${crateDataKey}`]);
          this[`highlight_${crateDataKey}`].setAlpha(1);
        }
      }
    });
    this.emptyHighlights = emptyHighlights;
  }
  checkIfCanRemoveForMobile() {
    if (this.crateSelectedToRemove == null) return false;

    this.deleteCrateBtn.setAlpha(0);
    Global.canDispose = true;
    this.matchShelfFound = false;
    Global.emitter.emit(
      'rack:check_to_place',
      false,
      this.crateSelectedToRemove
    );
    Global.emitter.emit('rack:hide_all_clickable');
  }
  addCardInfo() {
    for (let i = 1; i <= window.racks; i++) {
      for (let j = 1; j <= 4; j++) {
        this[`rack${i}_shelf${j}_left_info`] = this.create(
          this[`rack${i}`].x - 650 * this.scaleFact,
          this[`rack${i}`].y - (900 - 450 * (j - 1)) * this.scaleFact,
          'items',
          'info_card20000'
        )
          .setAlpha(0)
          .setDepth(1200 + 100)
          .setScale(this.scaleFact * 1.2);

        this[`rack${i}_shelf${j}_left_info_txt`] = this.scene.make
          .text({
            x: this[`rack${i}_shelf${j}_left_info`].x,
            y: this[`rack${i}_shelf${j}_left_info`].y,
            text: `hello`,
            origin: {
              x: 0.53,
              y: 0.5,
            },
            style: {
              font: Global.isMobile
                ? '' + String(34 * this.scaleFact) + 'px greycliff-medium'
                : '' + String(34 * this.scaleFact) + 'px greycliff-medium',
              fill: '#000000',
              align: 'center',
              wordWrap: {
                width:
                  this[`rack${i}_shelf${j}_left_info`].width *
                  this[`rack${i}_shelf${j}_left_info`].scaleX *
                  0.95,
              },
            },
          })
          .setDepth(1200 + 100)
          .setAlpha(0);
        this.add(this[`rack${i}_shelf${j}_left_info_txt`]);

        this[`rack${i}_shelf${j}_right_info`] = this.create(
          this[`rack${i}`].x + 650 * this.scaleFact,
          this[`rack${i}`].y - (680 - 450 * (j - 1)) * this.scaleFact,
          'items',
          'info_card20000'
        )
          .setAlpha(0)
          .setDepth(1200 + 100)
          .setScale(-this.scaleFact * 1.2, this.scaleFact * 1.2);

        this[`rack${i}_shelf${j}_right_info_txt`] = this.scene.make
          .text({
            x: this[`rack${i}_shelf${j}_right_info`].x,
            y: this[`rack${i}_shelf${j}_right_info`].y,
            text: `hello`,
            origin: {
              x: 0.47,
              y: 0.5,
            },
            style: {
              font: Global.isMobile
                ? '' + String(34 * this.scaleFact) + 'px greycliff-medium'
                : '' + String(34 * this.scaleFact) + 'px greycliff-medium',
              fill: '#000000',
              align: 'center',
              wordWrap: {
                width:
                  this[`rack${i}_shelf${j}_left_info`].width *
                  this[`rack${i}_shelf${j}_left_info`].scaleX *
                  0.95,
              },
            },
          })
          .setDepth(1200 + 100)
          .setAlpha(0);
        this.add(this[`rack${i}_shelf${j}_right_info_txt`]);
      }
    }
  }

  onHover(key, frame) {
    this[key].setFrame(frame);
  }
  showDeleteConfirm(pointer) {
    if (
      Global.popupActive ||
      (Global.isMobile &&
        (!pointer.target ||
          (pointer.target && pointer.target.getContext == undefined)))
    )
      return false;

    // Global.popupActive= true;
    Global.emitter.emit('popup_update', true);
    document.querySelector('#delete_confirm').classList.add('active');
  }
  hideDeleteConfirm() {
    // Global.popupActive= false;
    Global.emitter.emit('popup_update', false);
    document.querySelector('#delete_confirm').classList.remove('active');
  }
  deleteSecondRack(defaultAction = false) {
    this.hideDeleteConfirm();
    if (this.crateSelectedToSwap != null) {
      this.hideAllClickable(true);
      setTimeout(() => {
        this.prevCrateStats = this.isBigCrate;
        this.isBigCrate = Global.totalBottles == 24; //this.crateSelectedToSwap.getData('isBigCrate')
        this.matchShelfFound = false;
        Global.emitter.emit(
          'rack:check_to_place',
          false,
          this.crateSelectedToSwap
        );

        this.crateSelectedToSwap = null;
        this.isBigCrate = this.prevCrateStats;
      }, 0);

      // this.onDragEnd(pointer, this.crateSelectedToSwap);
    }
    // this.deleteBtn.setVisible(false);
    this.rack1.setVisible(false);
    window.rack1Visible = false;
    // this.deleteBtn.setData('canShow', false);
    this.rack1.setData('canShow', false);
    this.rack1.setAlpha(0);
    let disposeCrateFound = false;
    this.children.entries.forEach((child) => {
      if (
        child.getData('rackInfo') &&
        child.getData('rackInfo')['rack'] == 'rack1'
      ) {
        child.getData('crateItems') &&
          child.getData('crateItems').forEach((child) => {
            let isCrateIndex = child.getData('isCrateIndex');
            let crateTotalBottles = child.getData('crateTotalBottles');
            if (child.getData('isCustom')) {
              Global.totalCustomCrates--;
              this.calculateCustomCrate();
            }
            // isCrateIndex && crateTotalBottles>0 && Global.emitter.emit('header:update_crate', -1);
            if (child.getData('infoBtn')) {
              child.getData('infoBtn').destroy(true);
            }
            child.destroy(true);
            // this.crateFront.setData('infoBtn', this.infoIcon);
          });
        if (child == this.lastCustomCrate) {
          this.lastCustomCrate = null;
        }
        child && child.destroy && child.destroy(true);
      } else {
      }

      if (
        child.getData('rackInfo') &&
        child.getData('rackInfo')['rack'] == 'rack2' &&
        parseInt(window.showEmpty)
      ) {
        if (
          child.getData('rackInfo')['shelf'] == 4 &&
          child.getData('rackInfo')['side'] == 'right' &&
          !disposeCrateFound
        ) {
          this.matchShelfFound = false;
          disposeCrateFound = true;
          Global.canDispose = true;

          this.checkToPlace(false, child);

          if (parseInt(window.showEmpty) && window.racks >= 2) {
            Global.crateData[`rack2_right_4`]['status'] = 'taken';
            Global.crateData[`rack2_right_4`]['filledBottles'] = null;
            if (child.frame.name.indexOf('24') !== -1) {
              Global.crateData[`rack2_left_4`]['status'] = 'empty';
              Global.crateData[`rack2_left_4`]['filledBottles'] = null;
            }
          }

          this.hideTag(
            child.getData('rackInfo'),
            Global.crateData[`rack2_right_4`]['filledBottles']
          );
          child.setData('canShow', false);
          if (child.getData('isCustom')) {
            this.lastCustomCrate = null;
          }
        }
      }
    });
    setTimeout(() => {
      if (
        Global.totalCustomCrates >= window.racks &&
        this.lastCustomCrate != null
      ) {
        this.lastCustomCrate.getData('crateItems') &&
          this.lastCustomCrate.getData('crateItems').forEach((child) => {
            let isCrateIndex = child.getData('isCrateIndex');
            let crateTotalBottles = child.getData('crateTotalBottles');
            if (child.getData('isCustom')) {
              Global.totalCustomCrates--;
              this.calculateCustomCrate();
            }
            // isCrateIndex && crateTotalBottles>0 && Global.emitter.emit('header:update_crate', -1);
            if (child.getData('infoBtn')) {
              child.getData('infoBtn').destroy(true);
            }

            child.destroy(true);
            // this.crateFront.setData('infoBtn', this.infoIcon);
          });
        this.hideTag(
          this.lastCustomCrateInfo,
          Global.crateData[this.lastcustomCrateIndex]['filledBottles']
        );

        if (parseInt(window.showEmpty)) {
          Global.crateData[this.lastcustomCrateIndex]['status'] = 'empty';
          Global.crateData[this.lastcustomCrateIndex]['filledBottles'] = null;
          Global.crateData[
            this.lastcustomCrateIndex.replace('_right_', '_left_')
          ]['status'] = 'empty';
          Global.crateData[
            this.lastcustomCrateIndex.replace('_right_', '_left_')
          ]['filledBottles'] = null;
        }

        this.lastCustomCrateInfo = null;
        this.lastCustomCrate = null;
        this.lastcustomCrateIndex = null;
      }
    }, 250);
    Global.emitter.emit('header:update_crate', 0); // As per new logic
    for (let j = 1; j <= 4; j++) {
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

      Global.crateData[`rack1_left_${j}`]['status'] = 'taken';
      Global.crateData[`rack1_right_${j}`]['status'] = 'taken';
      Global.crateData[`rack1_left_${j}`]['filledBottles'] = null;
      Global.crateData[`rack1_right_${j}`]['filledBottles'] = null;
    }

    /* !defaultAction && */ this.addBtn.setVisible(true);

    if (window.racks >= 2) {
      this.rackInfo = {
        rack: 'rack2',
        shelf: 4,
        side: 'right',
      };
      if (parseInt(window.showEmpty)) {
        this.addCrateOnShelf([], this.rack2, '4');
      }
    }

    let totalBottles = Global.totalBottles;
    Global.totalBottles = 6;
    this.isBigCrate = false;

    Global.totalBottles = totalBottles;

    !defaultAction && this.updateSkipFrame();

    this.calculateCustomCrate();

    setTimeout(() => {
      Global.totalBottles = Global.choosenTotalBottles;
      Global.emitter.emit('rack:highlight_empty_space');
    }, 100);
    // Global.emitter.emit('rack:highlight_empty_space', this.crateSelectedToSwap!=null);
  }
  areAllStringsSame(arr) {
    if (arr.length === 0) return true; // An empty array can be considered all the same

    return arr.every((str) => str === arr[0]);
  }
  showOrHideUI(status) {
    if (status && !this.initConfigDone) {
      this.initConfigDone = true;
      if (!window.rack1Visible) {
        this.deleteSecondRack(true);
      }

      // window.userConfig =
      //   '{&quot;rack2_left_1&quot;:[&quot;CARLSBERG_0&quot;,&quot;CARLSBERG_0&quot;],&quot;rack2_right_1&quot;:[&quot;CARLSBERG_0&quot;,&quot;CARLSBERG_0&quot;],&quot;rack2_left_2&quot;:[&quot;CARLSBERG_0&quot;,&quot;CARLSBERG_0&quot;],&quot;rack2_right_2&quot;:[&quot;CARLSBERG_0&quot;,&quot;CARLSBERG_0&quot;],&quot;rack2_left_3&quot;:[&quot;CARLSBERG_0&quot;,&quot;CARLSBERG_0&quot;],&quot;rack2_right_3&quot;:[&quot;CARLSBERG_0&quot;,&quot;CARLSBERG_0&quot;],&quot;rack2_left_4&quot;:[&quot;CARLSBERG_0&quot;,&quot;CARLSBERG_0&quot;],&quot;rack2_right_4&quot;:[&quot;CARLSBERG_0&quot;,&quot;CARLSBERG_0&quot;],&quot;rack1_left_1&quot;:[&quot;pepsii&quot;,&quot;pepsii&quot;],&quot;rack1_right_1&quot;:[&quot;pepsii&quot;,&quot;pepsii&quot;],&quot;rack1_left_2&quot;:[&quot;dummy2&quot;,&quot;dummy2&quot;],&quot;rack1_right_2&quot;:[&quot;dummy2&quot;,&quot;dummy2&quot;],&quot;rack1_left_3&quot;:[&quot;dummy3&quot;,&quot;dummy3&quot;],&quot;rack1_right_3&quot;:[&quot;dummy3&quot;,&quot;dummy3&quot;],&quot;rack1_left_4&quot;:[&quot;VIVEN_NADA_IPA_NA&quot;,&quot;VIVEN_NADA_IPA_NA&quot;],&quot;rack1_right_4&quot;:[&quot;VIVEN_NADA_IPA_NA&quot;,&quot;VIVEN_NADA_IPA_NA&quot;]}';
      if (window.userConfig.length > 0) {
        window.userConfigClone = JSON.parse(
          window.userConfig.replace(/&quot;/g, '"')
        );
        for (const key in window.userConfigClone) {
          if (Array.isArray(window.userConfigClone[key])) {
            window.userConfigClone[key] = window.userConfigClone[key].map(
              (item) =>
                item.endsWith('_group') ? item.replace(/_group$/, '') : item
            );
          }
        }
        setTimeout(() => {
          Global.defaultCrateExists = false;
        }, 1000);

        setTimeout(() => {
          for (let rackIndex = 1; rackIndex <= window.racks; rackIndex++) {
            for (let shelfIndex = 1; shelfIndex <= 4; shelfIndex++) {
              Global.crateType = 'fixed';
              if (this[`rack${rackIndex}`].visible) {
                if (
                  window.userConfigClone[
                    `rack${rackIndex}_left_${shelfIndex}`
                  ] &&
                  window.userConfigClone[`rack${rackIndex}_left_${shelfIndex}`]
                    .length > 1
                ) {
                  if (
                    this.rack1.visible ||
                    (!this.rack1.visible && shelfIndex != 4)
                  ) {
                    this.matchShelfFound = true;
                    this.rackInfo = {
                      rack: `rack${rackIndex}`,
                      shelf: shelfIndex,
                      side: 'right',
                    };
                    let bottleConfig = [
                      ...window.userConfigClone[
                        `rack${rackIndex}_left_${shelfIndex}`
                      ],
                      ...window.userConfigClone[
                        `rack${rackIndex}_right_${shelfIndex}`
                      ],
                    ];
                    const isCustom = !this.areAllStringsSame(bottleConfig);
                    if (isCustom) {
                      Global.crateType = 'custom';
                    }
                    this.checkToPlace(
                      true,
                      bottleConfig,
                      true,
                      `rack${rackIndex}`,
                      'left',
                      shelfIndex,
                      true
                    );
                  }
                } else {
                  if (
                    window.userConfigClone[
                      `rack${rackIndex}_left_${shelfIndex}`
                    ] &&
                    window.userConfigClone[
                      `rack${rackIndex}_left_${shelfIndex}`
                    ].length > 0
                  ) {
                    this.matchShelfFound = true;
                    //rackKey='', side='', shelfKey=''
                    this.rackInfo = {
                      rack: `rack${rackIndex}`,
                      shelf: shelfIndex,
                      side: 'left',
                    };
                    this.checkToPlace(
                      true,
                      [
                        ...window.userConfigClone[
                          `rack${rackIndex}_left_${shelfIndex}`
                        ],
                      ],
                      true,
                      `rack${rackIndex}`,
                      'left',
                      shelfIndex,
                      false
                    );
                  }
                  if (
                    window.userConfigClone[
                      `rack${rackIndex}_right_${shelfIndex}`
                    ] &&
                    window.userConfigClone[
                      `rack${rackIndex}_right_${shelfIndex}`
                    ].length > 0
                  ) {
                    if (
                      this.rack1.visible ||
                      (!this.rack1.visible && shelfIndex != 4)
                    ) {
                      this.matchShelfFound = true;
                      //rackKey='', side='', shelfKey=''
                      this.rackInfo = {
                        rack: `rack${rackIndex}`,
                        shelf: shelfIndex,
                        side: 'right',
                      };
                      this.checkToPlace(
                        true,
                        [
                          ...window.userConfigClone[
                            `rack${rackIndex}_right_${shelfIndex}`
                          ],
                        ],
                        true,
                        `rack${rackIndex}`,
                        'right',
                        shelfIndex,
                        false
                      );
                    }
                  }
                }
              }
            }
          }

          // this.matchShelfFound=false;
        }, 0);
      }

      //checkToPlace(isNew, filledBottlesOrObject) {
    }
    this.setVisible(status);

    //Commented To enable empty crate removal.

    this[`rack1_shelf4_left_info`].setAlpha(
      status * parseInt(window.showEmpty) ? 1 : 0
    );
    this[`rack1_shelf4_left_info_txt`].setAlpha(
      status * parseInt(window.showEmpty) ? 1 : 0
    );
    if (!this.rack1.getData('canShow')) {
      this.rack1.setVisible(false);
      // this.deleteBtn.setVisible(false);
      for (let j = 1; j <= 4; j++) {
        this[`rack${1}_shelf${j}_left_info`].setVisible(false);
        this[`rack${1}_shelf${j}_right_info`].setVisible(false);
        this[`rack${1}_shelf${j}_left_info_txt`].setVisible(false);
        this[`rack${1}_shelf${j}_right_info_txt`].setVisible(false);
      }
    } else {
      if (status) {
        this.addBtn.setVisible(false);
      }
    }
    this.infoIcon && this.infoIcon.setVisible(status);
  }
  checkToPlace(
    isNew,
    filledBottlesOrObject,
    prefill = false,
    rackKey = '',
    side = '',
    shelfKey = '',
    isBig
  ) {
    if (
      Global.popupActive &&
      ((this.crateSelectedToSwap == null && (Global.isMobile || true)) ||
        !(Global.isMobile || true))
    )
      return false;
    if (Global.isMobile || true) {
      this.deleteCrateBtn.setAlpha(0);
      this.crateSelectedToRemove = null;
    }

    if (!this.matchShelfFound) {
      if (isNew) {
        if (!prefill) {
          Global.emitter.emit('crate:reset_position', filledBottlesOrObject);
        }
      } else {
        if (Global.canDispose) {
          let filledBottles = filledBottlesOrObject.getData('filledBottles');

          let obj = filledBottlesOrObject.getData('rackInfo');
          if (!filledBottles) {
            this[`${obj['rack']}_shelf${obj['shelf']}_left_info`].setAlpha(0);
            this[`${obj['rack']}_shelf${obj['shelf']}_left_info_txt`].setAlpha(
              0
            );
            this[`${obj['rack']}_shelf${obj['shelf']}_right_info`].setAlpha(0);
            this[`${obj['rack']}_shelf${obj['shelf']}_right_info_txt`].setAlpha(
              0
            );
            this.infoIcon.setVisible(false);
          }
          // alert('DSDSDS' + ':' + `${obj['rack']}_left_${obj['shelf']}`);

          filledBottles && Global.emitter.emit('header:update_crate', -1);
          [
            filledBottlesOrObject,
            ...filledBottlesOrObject.getData('crateItems'),
          ].forEach((child) => {
            child.disableInteractive();
          });

          if (!filledBottles) {
            window.showEmpty = '0';
          }
          this.scene.tweens.add({
            targets: [
              filledBottlesOrObject,
              ...filledBottlesOrObject.getData('crateItems'),
            ],
            ease: 'Back.In',
            scale: 0.2,
            duration: 150,
            repeat: 0, // -1: infinity
            yoyo: false,
            onComplete: function () {
              if (
                filledBottlesOrObject &&
                filledBottlesOrObject.getData('crateItems')
              ) {
                [
                  filledBottlesOrObject,
                  ...filledBottlesOrObject.getData('crateItems'),
                ].forEach((child) => {
                  child.destroy(true, true);
                });
              }

              // gameObject

              Global.emitter.emit('bin:reset_bin');
            }.bind(this),
          });
          if (
            filledBottlesOrObject &&
            filledBottlesOrObject.getData('rackInfo') &&
            filledBottlesOrObject.frame.name.indexOf('24') != -1
          ) {
            let obj = filledBottlesOrObject.getData('rackInfo');
            this.hideTag(
              filledBottlesOrObject.getData('rackInfo'),
              Global.crateData[`${obj['rack']}_left_${obj['shelf']}`][
                'filledBottles'
              ]
            );
          }

          //
          let isCustom = false;
          filledBottlesOrObject.getData('crateItems').forEach((item) => {
            if (item.getData('isCustom')) {
              isCustom = true;
            }
          });
          if (isCustom) {
            Global.totalCustomCrates--;
            this.calculateCustomCrate();
          }
        } else {
          if (this.isBigCrate) {
            let filledBottles = null;
            if (Array.isArray(filledBottlesOrObject)) {
              filledBottles = filledBottlesOrObject;
            } else {
              let rackInfo = filledBottlesOrObject.getData('rackInfo');
              this.rackInfo = rackInfo;
              filledBottles = filledBottlesOrObject.getData('filledBottles');
            }

            if (filledBottles) {
              this[
                `${this.rackInfo['rack']}_shelf${this.rackInfo['shelf']}_left_info`
              ].setAlpha(1);
              this[
                `${this.rackInfo['rack']}_shelf${this.rackInfo['shelf']}_right_info`
              ].setAlpha(1);
              Global.crateData[
                `${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`
              ]['status'] = 'taken';
              Global.crateData[
                `${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`
              ]['status'] = 'taken';
              Global.crateData[
                `${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`
              ]['filledBottles'] = filledBottles.slice(0, 2);
              Global.crateData[
                `${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`
              ]['filledBottles'] = filledBottles.slice(2, 4);
              Global.crateData[
                `${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`
              ]['isBig'] = true;
              Global.crateData[
                `${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`
              ]['isBig'] = true;

              // Global.crateData[`${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`]['crateType']= Global.crateType;
              filledBottles &&
                this.showTag(this.rackInfo, filledBottles, this.isBigCrate);
            } else {
              Global.crateData[
                `${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`
              ]['status'] = 'taken';
              Global.crateData[
                `${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`
              ]['status'] = 'taken';
            }
          } else {
            let filledBottles = null;
            if (Array.isArray(filledBottlesOrObject)) {
              filledBottles = filledBottlesOrObject;
            } else {
              let rackInfo = filledBottlesOrObject.getData('rackInfo');
              this.rackInfo = rackInfo;
              filledBottles = filledBottlesOrObject.getData('filledBottles');
            }

            if (filledBottles) {
              Global.crateData[
                `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`
              ] &&
                ((Global.crateData[
                  `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`
                ]['filledBottles'] = filledBottles),
                (Global.crateData[
                  `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`
                ]['isBig'] = false),
                (Global.crateData[
                  `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`
                ]['status'] = 'taken'));
              filledBottles &&
                this.showTag(this.rackInfo, filledBottles, this.isBig);
            } else {
              Global.crateData[
                `${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`
              ]['status'] = 'taken';
              Global.crateData[
                `${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`
              ]['status'] = 'taken';
            }
          }
          Global.emitter.emit('rack:reset_position', filledBottlesOrObject);
        }
      }
      this.updateSkipFrame();
      // this.calculateCustomCrate();
      return false;
    } else {
      Global.emitter.emit('header:update_crate', 0);
      if (isNew) {
        Global.emitter.emit('header:update_crate_status', 'add', prefill);

        Global.crateActivated = true;
        this.addCrateOnShelf(
          filledBottlesOrObject,
          undefined,
          undefined,
          prefill,
          rackKey,
          side,
          shelfKey,
          isBig
        );
        Global.emitter.emit('crate:remove');

        if (!prefill && Global.crateType == 'custom') {
          this.crateFront.setData('isCustom', true);
          Global.totalCustomCrates++;
          this.lastCustomCrate = this.crateFront;
          this.lastCustomCrateInfo = this.rackInfo;
          this.lastcustomCrateIndex = `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`;
        } else if (prefill) {
          // alert("DSdfs")
          let filledBottles2;
          if (Array.isArray(filledBottlesOrObject)) {
            filledBottles2 = filledBottlesOrObject;
          } else {
            filledBottles2 = filledBottlesOrObject.getData('filledBottles');
          }
          if (filledBottles2.length > 1) {
            let firstItem = filledBottles2[0];
            let isCustom = false;
            for (let i = 1; i < filledBottles2.length; i++) {
              if (filledBottles2[i] != firstItem) {
                isCustom = true;
              }
            }
            if (isCustom) {
              this.crateFront.setData('isCustom', true);
              Global.totalCustomCrates++;

              this.lastCustomCrate = this.crateFront;
              this.lastCustomCrateInfo = this.rackInfo;
              this.lastcustomCrateIndex = `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`;
            }
          }
        }

        this.calculateCustomCrate(Global.crateType == 'custom' && !prefill);
        if (!prefill) {
          setTimeout(() => {
            // Global.emitter.emit('crate:add_crate');
            // Global.emitter.emit(
            //   'bottle:add_new',
            //   Global.lastBottleKey,
            //   true,
            //   false
            // );
          }, 250);
        }
      } else {
        if (this.crateFront == this.lastCustomCrate) {
          this.lastCustomCrateInfo = this.rackInfo;
          this.lastcustomCrateIndex = `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`;
        }

        this.rearrageOnShelf(filledBottlesOrObject);
      }
      if (!prefill) {
        Global.crateData[
          `${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`
        ]['crateType'] = Global.crateType;
      }
      let conditionCheck = prefill ? isBig : this.isBigCrate;

      if (conditionCheck) {
        Global.crateData[
          `${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`
        ]['status'] = 'taken';
        Global.crateData[
          `${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`
        ]['status'] = 'taken';
        Global.crateData[
          `${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`
        ]['isBig'] = true;
        Global.crateData[
          `${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`
        ]['isBig'] = true;
        // Global.crateData[`${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`]['crateType']= Global.crateType;
        if (!prefill) {
          // alert("DSA")
          // Global.crateData[`${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`]['crateType']= Global.crateType;
        }
        let filledBottles = null;
        if (Array.isArray(filledBottlesOrObject)) {
          filledBottles = filledBottlesOrObject;
        } else {
          filledBottles = filledBottlesOrObject.getData('filledBottles');
        }

        if (filledBottles) {
          this[
            `${this.rackInfo['rack']}_shelf${this.rackInfo['shelf']}_left_info`
          ].setAlpha(1);
          this[
            `${this.rackInfo['rack']}_shelf${this.rackInfo['shelf']}_right_info`
          ].setAlpha(1);
          Global.crateData[
            `${this.rackInfo['rack']}_left_${this.rackInfo['shelf']}`
          ]['filledBottles'] = filledBottles.slice(0, 2);
          Global.crateData[
            `${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`
          ]['filledBottles'] = filledBottles.slice(2, 4);
          // Global.crateData[`${this.rackInfo['rack']}_right_${this.rackInfo['shelf']}`]['crateType']= Global.crateType;
          this.showTag(this.rackInfo, filledBottles, conditionCheck);
        }
      } else {
        Global.crateData[
          `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`
        ]['status'] = 'taken';
        Global.crateData[
          `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`
        ]['isBig'] = false;
        if (Array.isArray(filledBottlesOrObject)) {
          Global.crateData[
            `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`
          ]['filledBottles'] = filledBottlesOrObject;
          this.showTag(this.rackInfo, filledBottlesOrObject, conditionCheck);
        } else {
          Global.crateData[
            `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`
          ]['filledBottles'] = filledBottlesOrObject.getData('filledBottles');
          this.showTag(
            this.rackInfo,
            filledBottlesOrObject.getData('filledBottles'),
            conditionCheck
          );
        }
      }

      this.updateSkipFrame();
      // this.calculateCustomCrate();
    }
  }
  updateSkipFrame() {
    let isEmptyRemains = false;

    Object.keys(Global.crateData).forEach((crateDataKey) => {
      let rack = this[crateDataKey.split('_')[0]];

      if (
        Global.crateData[crateDataKey]['status'] === 'empty' &&
        rack.visible
      ) {
        isEmptyRemains = true;
      }
    });
    Global.isEmptyRemains = isEmptyRemains;
    if (!isEmptyRemains && !Global.rackFullInfoShown) {
      Global.rackFullInfoShown = true;
      Global.emitter.emit('header:show_ready_info');
    }
    /* if(isEmptyRemains){
            Global.emitter.emit('header:update_skip_frame', 'skip');
            Global.emitter.emit('header:hide_ready_info');
        }else{
            if(!Global.defaultCrateExists){
                Global.emitter.emit('header:update_skip_frame', 'ready');
                Global.emitter.emit('header:show_ready_info');
            }
            
        } */
  }
  hideTag(rackInfo, items) {
    if (items == null) return false;

    if (items && items.length > 1) {
      this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info`].setAlpha(
        0
      );
      this[
        `${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info_txt`
      ].setAlpha(0);

      this[`${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info`].setAlpha(
        0
      );
      this[
        `${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info_txt`
      ].setAlpha(0);
    } else {
      this[
        `${rackInfo['rack']}_shelf${rackInfo['shelf']}_${rackInfo['side']}_info`
      ].setAlpha(0);
      this[
        `${rackInfo['rack']}_shelf${rackInfo['shelf']}_${rackInfo['side']}_info_txt`
      ].setAlpha(0);
    }
  }
  showTag(rackInfo, items, isBigCrate) {
    // return false;
    if (items == null) return false;
    let card1Str = '';
    let card2Str = '';
    let totalBottles = 0;
    // let
    const allEqual = (obj) => {
      let isEqual = true;
      let last = obj[0];
      for (let i = 1; i < obj.length; i++) {
        if (last != obj[i]) {
          isEqual = false;
        }
      }
      return isEqual;
    };
    let _totalBottles = 0;
    let _volume = '';
    let isAllEqual = allEqual(items);
    items.forEach((item, index) => {
      if (index > 0 && index < 2) {
        card1Str += '\n';
      }
      if (index > 2) {
        card2Str += '\n';
      }

      let key = null;
      let existsInSet =
        [...Global.jsonData, ...Global.customBottles].filter(
          (data) => data['bottle_key'] == item.split('_group')[0]
        ).length > 0;
      if (!existsInSet) {
        if (Global.customReq[item]) {
          key = Global.customReq[item];
        } else {
          key = item;
        }
      } else {
        key = [...Global.jsonData, ...Global.customBottles].filter(
          (data) => data['bottle_key'] == item.split('_group')[0]
        )[0]['name'];
      }
      if (!existsInSet) {
        _totalBottles = 24;
        _volume = '';
      } else {
        _totalBottles = [...Global.jsonData, ...Global.customBottles].filter(
          (data) => data['bottle_key'] == item.split('_group')[0]
        )[0]['total_bottles'];
        _volume = [...Global.jsonData, ...Global.customBottles].filter(
          (data) => data['bottle_key'] == item.split('_group')[0]
        )[0]['volume'];
      }

      // key= key['name'];

      /* if(key.length>10){
                key= `${key.substring(0, 10)}...`
            } */
      totalBottles += 6;
      if (index < 2) {
        card1Str += `${key}  ${_volume} (${!isAllEqual ? '6' : _totalBottles})`;
      } else {
        card2Str += `${key}  ${_volume} (${!isAllEqual ? '6' : _totalBottles})`;
      }
    });

    if (isBigCrate) {
      if (allEqual(items)) {
        card1Str = `${card1Str.split('(')[0]}(${_totalBottles})`;
        this[
          `${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info`
        ].setAlpha(1);
        this[
          `${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info_txt`
        ].setAlpha(1);
        this[
          `${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info_txt`
        ].setText(card1Str);
        this[
          `${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info`
        ].setAlpha(0);
        this[
          `${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info_txt`
        ].setAlpha(0);
      } else {
        let cardItems = [...card1Str.split('\n'), ...card2Str.split('\n')];
        let cardObj = {};
        cardItems.forEach((key) => {
          let key1 = key.split(' (')[0];
          let key2 = parseInt(key.split(' (')[1].split(')')[0]);
          if (cardObj[key1]) {
            cardObj[key1] += key2;
          } else {
            cardObj[key1] = key2;
          }
        });
        card1Str = '';
        card2Str = '';
        Object.keys(cardObj).forEach((key, index) => {
          if (index < 2) {
            card1Str += `${index % 2 != 0 ? '\n' : ''}${key} (${cardObj[key]})`;
          }
          if (index >= 2) {
            card2Str += `${index % 2 != 0 ? '\n' : ''}${key} (${cardObj[key]})`;
          }
        });
        this[
          `${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info`
        ].setAlpha(1);
        this[
          `${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info_txt`
        ].setAlpha(1);
        this[
          `${rackInfo['rack']}_shelf${rackInfo['shelf']}_left_info_txt`
        ].setText(card1Str);
        if (card2Str.length > 0) {
          this[
            `${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info`
          ].setAlpha(1);
          this[
            `${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info_txt`
          ].setAlpha(1);
          this[
            `${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info_txt`
          ].setText(card2Str);
        } else {
          this[
            `${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info`
          ].setAlpha(0);
          this[
            `${rackInfo['rack']}_shelf${rackInfo['shelf']}_right_info_txt`
          ].setAlpha(0);
        }
      }
    } else {
      this[
        `${rackInfo['rack']}_shelf${rackInfo['shelf']}_${rackInfo['side']}_info`
      ].setAlpha(1);
      this[
        `${rackInfo['rack']}_shelf${rackInfo['shelf']}_${rackInfo['side']}_info_txt`
      ].setAlpha(1);
      this[
        `${rackInfo['rack']}_shelf${rackInfo['shelf']}_${rackInfo['side']}_info_txt`
      ].setText(card1Str);
    }
  }
  rearrageOnShelf(gameObject) {
    this.highlight.setAlpha(0);

    this.lastCustomCrate = gameObject;
    this.lastCustomCrateInfo = this.rackInfo;
    this.lastcustomCrateIndex = `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`;

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
      if (child.getData('rackInfo')) {
        child.setData('rackInfo', this.rackInfo);
      }
      child.setDepth(child.getData('initDepth') + this.rackInfo['shelf'] * 8);
    });
    this.killAllTweens(gameObject);
    [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
      child.setData('readyToDrag', false);
      this.scene.tweens.add({
        targets: child,
        ease: 'Back.Out',
        x: this.highlight.x,
        y:
          child.getData('filledIndex') !== 0
            ? this.highlight.y +
              120 * this.scaleFact +
              (child.getData('filledIndex') - 2.5) *
                (!this.isBigCrate ? 70 : 70) *
                this.scaleFact
            : this.highlight.y + 120 * this.scaleFact,
        duration: 300,
        repeat: 0, // -1: infinity
        yoyo: false,
        onComplete:
          child === gameObject
            ? this.addCrateMask.bind(this, gameObject, true)
            : null,
      });
      /*    if(child.getData('filledIndex') !== 0){
                   child.setPosition(gameObject.x , gameObject.y + (child.getData('filledIndex') - 2.5) * 70 * this.scaleFact)
               }else{
                   child.setPosition(gameObject.x , gameObject.y);
               } */
    });
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
          child.setScale(child.getData('initScale') * this.scaleObj['value']);
        });
        this.shrinkFact = 1.5 - twn.progress * 0.5;
      }.bind(this),
      onComplete: function () {
        [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
          child.setData('readyToDrag', true);
        });
      }.bind(this),
    });
  }
  addCrateMask(gameObject, updateDepth) {
    this.crateMaskGr = this.scene.add.graphics();
    this.crateMaskGr.setPosition(
      this.highlight.x - this.highlight.width * this.crate.scaleX,
      this.highlight.y - this.highlight.height * this.highlight.scaleY * 2
    );
    this.crateMaskGr.fillStyle(0xff0000, 0.0);
    this.crateMaskGr.fillRect(
      0,
      0,
      this.highlight.width * this.highlight.scaleX * 3,
      this.highlight.height * this.highlight.scaleY * 2.5
    );
    this.crateMaskGr.setDepth(1200 + 100);
    this.add(this.crateMaskGr);
    gameObject.setData('maskGr', this.crateMaskGr);

    [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
      child.setMask(this.crateMaskGr.createGeometryMask());
      child.setData('initX', child.x);
      child.setData('initY', child.y);
      // updateDepth && child.setDepth(child.getData('initDepth') + this.rackInfo['shelf'] * 8);
    });
  }
  killAllTweens(gameObject) {
    [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
      this.scene.tweens.killTweensOf(gameObject);
    });
  }
  resetCrateOnRack(gameObject) {
    if (gameObject.getData && gameObject.getData('insideRack')) {
      // alert("S");
      let rackInfo = gameObject.getData('rackInfo');
      [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
        /* updateDepth && */ child.setDepth(
          child.getData('initDepth') + rackInfo['shelf'] * 8
        );
      });
      // this.scene.tweens.killAll();
      this.killAllTweens(gameObject);
      this.highlight.setPosition(
        gameObject.getData('initX'),
        gameObject.getData('initY') - 120 * this.scaleFact
      );
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
          onComplete:
            child === gameObject
              ? this.addCrateMask.bind(this, gameObject, true)
              : null,
        });
      });

      this.scene.tweens.add({
        targets: this.scaleObj,
        ease: 'Back.Out',
        value: 1,
        duration: Global.isMobile ? 150 : 150,
        repeat: 0, // -1: infinity
        yoyo: false,
        onUpdate: function (twn) {
          [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
            child.setScale(child.getData('initScale') * this.scaleObj['value']);
          });
          this.shrinkFact = 1.5 - twn.progress * 0.5;
        }.bind(this),
        onComplete: function () {
          [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
            child.setData('readyToDrag', true);
          });
        }.bind(this),
      });
    }
  }
  onDragStart(pointer, gameObject) {
    if (!Global.crateActivated || Global.popupActive) return false;

    this.dragStartKey = null;
    this.dragProgressKey = null;

    this.canCheckDrag = false;
    this.isBigCrate = gameObject.getData('isBigCrate'); //(crateFrame.indexOf('6') == -1);
    if (gameObject.getData('insideRack')) {
      if (!gameObject.getData('readyToDrag')) return false;

      this.matchedRack = null;

      this.matchShelfFound = false;

      let rackInfo = gameObject.getData('rackInfo');
      this.rackInfo = rackInfo;
      let isBigCrate = gameObject.getData('isBigCrate');

      gameObject.getData('maskGr') &&
        gameObject.getData('maskGr').destroy(true);
      if (isBigCrate) {
        Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`][
          'status'
        ] = 'empty';
        Global.crateData[`${rackInfo['rack']}_right_${rackInfo['shelf']}`][
          'status'
        ] = 'empty';

        if (
          Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`][
            'filledBottles'
          ]
        ) {
          this.hideTag(
            rackInfo,
            Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`][
              'filledBottles'
            ]
          );
          this.hideTag(
            rackInfo,
            Global.crateData[`${rackInfo['rack']}_right_${rackInfo['shelf']}`][
              'filledBottles'
            ]
          );
          if (
            Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`][
              'filledBottles'
            ]
          ) {
            gameObject.setData(
              'filledBottles',
              Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`][
                'filledBottles'
              ].concat(
                Global.crateData[
                  `${rackInfo['rack']}_right_${rackInfo['shelf']}`
                ]['filledBottles']
              )
            );
          } else {
          }
        }

        Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`][
          'filledBottles'
        ] = null;
        Global.crateData[`${rackInfo['rack']}_right_${rackInfo['shelf']}`][
          'filledBottles'
        ] = null;
      } else {
        Global.crateData[
          `${rackInfo['rack']}_${rackInfo['side']}_${rackInfo['shelf']}`
        ]['status'] = 'empty';
        this.hideTag(
          rackInfo,
          Global.crateData[
            `${rackInfo['rack']}_${rackInfo['side']}_${rackInfo['shelf']}`
          ]['filledBottles']
        );
        gameObject.setData(
          'filledBottles',
          Global.crateData[
            `${rackInfo['rack']}_${rackInfo['side']}_${rackInfo['shelf']}`
          ]['filledBottles']
        );

        Global.crateData[
          `${rackInfo['rack']}_${rackInfo['side']}_${rackInfo['shelf']}`
        ]['filledBottles'] = null;
      }

      // this.dragStartKey=`${rackInfo['rack']}_left_${rackInfo['shelf']}`;

      this.crateDragged = true;

      [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
        child.setData('initX', child.x);
        // child.setData('initDepth', child.depth)

        child.setDepth(
          child.getData('initDepth') + rackInfo['shelf'] * 8 + 1000
        );
        // child.setData('readyToDrag', false)
        child.setData('initY', child.y);
        child.clearMask(true);
      });
      if (gameObject.getData('maskGr')) {
        gameObject.getData('maskGr').destroy(true, true);
      }

      [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
        child.setData('initScale', child.scaleX);
      });
      this.scaleObj = {
        value: 1,
      };
      this.shrinkTwn && this.shrinkTwn.remove();
      gameObject.setData('twnBeforeDelete', true);
      this.shrinkTwn = this.scene.tweens.add({
        targets: this.scaleObj,
        ease: 'Back.Out',
        value: Global.isMobile ? `*=1.1` : `*=1.2`,
        duration: 350,
        repeat: 0, // -1: infinity
        yoyo: false,
        onStart: function () {
          this.crateSelectedToRemove = gameObject;
        }.bind(this),
        onUpdate: function (twn) {
          [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
            child.setScale(child.getData('initScale') * this.scaleObj['value']);
            if (child.getData('filledIndex') !== 0) {
              child.y =
                gameObject.y +
                (child.getData('filledIndex') - 2.5) *
                  (!isBigCrate ? 70 : 70) *
                  this.scaleFact *
                  this.shrinkFact;
            }
          });

          // this.shrinkScalFact= twn.progress;
          this.shrinkFact = 1 + twn.progress * 0.5;
        }.bind(this),
        onComplete: function (gameObject) {
          if ((Global.isMobile || true) && this.crateSelectedToRemove != null) {
            this.crateSelectedToRemove = gameObject;
            this.deleteCrateBtn.setAlpha(1);
            this.deleteCrateBtn.setDepth(gameObject.depth + 1);
            this.deleteCrateBtn.setPosition(
              gameObject.x,
              gameObject.y + 50 * this.scaleFact
            );
          }
          this.canCheckDrag = true;
        }.bind(this, gameObject),
      });
    }
    this.onBottleDrag(pointer, gameObject, gameObject.x, gameObject.y);
  }
  onBottleDrag(pointer, gameObject, dragX, dragY) {
    if (!Global.crateActivated || Global.popupActive) return false;

    if (gameObject.getData('insideRack')) {
      let isBigCrate = gameObject.getData('isBigCrate');
      if (!gameObject.getData('readyToDrag')) return false;
      [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
        child.x = dragX;
        if (child.getData('filledIndex') !== 0) {
          child.y =
            dragY +
            (child.getData('filledIndex') - 2.5) *
              (!isBigCrate ? 70 : 70) *
              this.scaleFact *
              this.shrinkFact;
        } else {
          child.y = dragY;
        }
      });
      if (this.canCheckDrag) {
        Global.emitter.emit(
          'rack:check_on_drag',
          gameObject.getBounds(),
          gameObject.frame.name
        );
        Global.emitter.emit(
          'bin:check_on_drag',
          gameObject.getBounds(),
          gameObject.frame.name,
          0.1
        );
      }
    }
  }
  onDragEnd(pointer, gameObject, dragX, dragY) {
    if (!Global.crateActivated || Global.popupActive) return false;

    // gameObject.setData('twnBeforeDelete', false);
    if (gameObject.getData('insideRack')) {
      if (!gameObject.getData('readyToDrag')) return false;
      this.crateDragged = false;

      Global.emitter.emit('rack:check_to_place', false, gameObject);
    }
  }
  addCrateOnShelf(
    filledBottles,
    optionalRack,
    optionalShelf,
    prefill,
    rackKey,
    side,
    shelfKey,
    isBig
  ) {
    let conditionCheck = this.isBigCrate;
    if (prefill) {
      conditionCheck = isBig;
      this.highlight.setPosition(
        this[rackKey].x +
          (conditionCheck
            ? 0
            : Global.crateData[`${rackKey}_${side}_${shelfKey}`]['position']
                .x) *
            this.scaleFact,
        this[rackKey].y +
          Global.crateData[`${rackKey}_${side}_${shelfKey}`]['position'].y *
            this.scaleFact
      );
    }
    this.highlight.setAlpha(0);

    this.crateChannel1 = null;
    this.crateChannel2 = null;

    let shelfFactor = this.rackInfo['shelf'] * 8;
    let createItems = [];

    if (filledBottles.length == 0) {
      this.highlight.setPosition(
        optionalRack.x +
          (conditionCheck
            ? 0
            : Global.crateData[
                `${this.rackInfo['rack']}_${this.rackInfo['side']}_${optionalShelf}`
              ]['position'].x) *
            this.scaleFact,
        optionalRack.y +
          Global.crateData[
            `${this.rackInfo['rack']}_${this.rackInfo['side']}_${optionalShelf}`
          ]['position'].y *
            this.scaleFact
      );
      if (conditionCheck) {
        for (let i = 1; i <= (parseInt(window.showEmpty) ? 3 : 4); i++) {
          Global.crateData[`rack1_left_${i}`]['status'] = 'empty';
          Global.crateData[`rack1_right_${i}`]['status'] = 'empty';
        }
      } else {
        if (parseInt(window.showEmpty)) {
          Global.crateData[`rack2_right_4`]['status'] = 'taken';
        }
      }
    }
    let bottleCnt = prefill ? (isBig ? 24 : 6) : Global.totalBottles;
    if (bottleCnt == 6) {
      this.crate = this.create(
        this.highlight.x,
        this.highlight.y + 120 * this.scaleFact,
        'items',
        filledBottles.length == 0
          ? `crate_${bottleCnt}_empty0000`
          : `crate_${bottleCnt}_back0000`
      ).setDepth(1200 + 1 + shelfFactor);
      this.crateFront = this.create(
        this.crate.x,
        this.crate.y,
        'items',
        `crate_${bottleCnt}_front0000`
      )
        .setVisible(filledBottles.length > 0)
        .setAlpha(filledBottles.length > 0)
        .setDepth(1200 + 3 + shelfFactor);
      if (filledBottles.length === 0) {
        Global.extraCrate = this.crate;
        this[`rack2_shelf4_right_info`].setAlpha(1);
        this[`rack2_shelf4_right_info_txt`] &&
          this[`rack2_shelf4_right_info_txt`].scene &&
          this[`rack2_shelf4_right_info_txt`].setAlpha(1);
        this[`rack2_shelf4_right_info_txt`] &&
          this[`rack2_shelf4_right_info_txt`].scene &&
          this[`rack2_shelf4_right_info_txt`].setText('Leeggoed');
      }
    } else {
      this.crate = this.create(
        this.highlight.x,
        this.highlight.y + 120 * this.scaleFact,
        'items',
        filledBottles.length == 0
          ? `crate_${bottleCnt}_empty0000`
          : `crate_${bottleCnt}_10000`
      ).setDepth(1200 + 1 + shelfFactor);

      this.crateChannel1 = this.create(
        this.crate.x,
        this.crate.y,
        'items',
        `crate_${bottleCnt}_30000`
      )
        .setDepth(1200 + 3 + shelfFactor)
        .setVisible(filledBottles.length > 0)
        .setAlpha(filledBottles.length > 0)
        .setData('filledIndex', 0)
        .setScale(this.scaleFact * 0.7);

      this.crateChannel2 = this.create(
        this.crate.x,
        this.crate.y,
        'items',
        `crate_${bottleCnt}_70000`
      )
        .setDepth(1200 + 7 + shelfFactor)
        .setVisible(filledBottles.length > 0)
        .setAlpha(filledBottles.length > 0)
        .setData('filledIndex', 0)
        .setScale(this.scaleFact * 0.7);

      this.crateFront = this.create(
        this.crate.x,
        this.crate.y,
        'items',
        `crate_${bottleCnt}_80000`
      )
        .setVisible(filledBottles.length > 0)
        .setAlpha(filledBottles.length > 0)
        .setDepth(1200 + 8 + shelfFactor);

      createItems.push(this.crateChannel1);
      createItems.push(this.crateChannel2);
    }

    if (filledBottles.length == 0) {
      setTimeout(
        function (crateFront, crate) {
          this.infoIcon && this.infoIcon.destroy();
          this.infoIcon = this.create(
            crateFront.x + crateFront.width * crateFront.scaleX * 0.4,
            crateFront.y - 250 * this.scaleFact,
            'items',
            'infoBtn0000'
          )
            .setScale(this.scaleFact)
            .setAlpha(0)
            .setVisible(crate.visible)
            .setInteractive({
              cursor: 'pointer',
            })
            .on('pointerdown', () => {
              Global.emitter.emit('crate_info2:show');
            })
            .setDepth(1200 + 8 + shelfFactor);

          this.infoIcon.setData('refItem', crateFront);
          this.scene.tweens.add({
            targets: this.infoIcon,
            ease: 'Linear.Out',
            alpha: 1,
            duration: 350,
            repeat: 0, // -1: infinity
            yoyo: false,
          });

          crateFront.setData('infoBtn', this.infoIcon);
        }.bind(this, this.crateFront, this.crate),
        500
      );
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
    this.crate.setData('isBigCrate', conditionCheck);
    this.crateFront.setData('rackInfo', this.rackInfo);
    this.crateFront.setData('isBigCrate', conditionCheck);

    if (filledBottles.length > 0 || true) {
      this.crateFront.setInteractive({
        draggable: !(Global.isMobile || true),
        cursor: 'pointer',
      });
      if (Global.isMobile || true) {
        this.crateFront.on(
          'pointerdown',
          this.onRackCrateClick.bind(
            this,
            this.crateFront,
            filledBottles.length > 0
          )
        );
      }

      this.crate.setInteractive({
        draggable: !(Global.isMobile || true),
        cursor: 'pointer',
      });
      if (Global.isMobile || true) {
        this.crate.on(
          'pointerdown',
          this.onRackCrateClick.bind(
            this,
            this.crateFront,
            filledBottles.length > 0
          )
        );
      }
    }

    for (let i = 1; i <= filledBottles.length; i++) {
      let existsInSet =
        [...Global.jsonData, ...Global.customBottles].filter(
          (data) =>
            data['bottle_key'] == filledBottles[i - 1].split('_group')[0]
        ).length > 0;

      let imgKey =
        !existsInSet || filledBottles[i - 1].indexOf('dummy') != -1
          ? 'dummy'
          : filledBottles[i - 1];

      this[`bottle_set${i}`] = this.create(
        this.crate
          .x /* - (Math.ceil(this.bottleSets/2)-i)*500*this.scaleFact */,
        this.crate.y +
          (i - 2.5) * (filledBottles.length == 6 ? 70 : 70) * this.scaleFact,
        `${imgKey}_group`
      )
        .setScale(this.scaleFact * 0.7)
        .setData('filledIndex', i)
        // .setData('')
        .setData('filled', false)
        .setDepth(1200 + (i == 1 ? 2 : i + 3) + shelfFactor);
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
      child.setData('initDepth', child.depth - shelfFactor);
      // child.setData('rack', this)
      child.setData('placeScale', child.scaleX);
      this.scene.tweens.add({
        targets: child,
        ease: 'Back.Out',
        scale: {
          from: 0,
          to: child.getData('placeScale'),
        },
        duration: 350,
        repeat: 0, // -1: infinity
        yoyo: false,
      });
    });

    // this.calculateCustomCrate();
  }
  resetSelectedSwapCrate() {
    if (this.crateSelectedToSwap == null) return false;
    Global.emitter.emit('rack:check_to_place', false, this.crateSelectedToSwap);
  }
  onRackCrateClick(crate, canHighlightEmpty, pointer) {
    if (
      Global.popupActive /* (Global.isMobile || true) && */ /* !pointer.target || */ ||
      (pointer.target && pointer.target.getContext == undefined)
    )
      return false;

    Global.crateClickTO = setTimeout(() => {
      const rackIndex = crate.getData('rackInfo')
        ? parseInt(crate.getData('rackInfo').rack.split('rack')[1])
        : 1;

      if (this.rackIndecsToHide.indexOf(rackIndex) != -1) return false;
      if (Global.isMobile || true) {
        this.deleteCrateBtn.setAlpha(0);
        this.crateSelectedToRemove = null;
      }

      if (this.crateSelectedToSwap == crate) {
        Global.emitter.emit(
          'rack:check_to_place',
          false,
          this.crateSelectedToSwap
        );
        this.crateSelectedToSwap = null;
        this.hideAllClickable();
        return false;
      }

      if (this.crateSelectedToSwap != null) {
        Global.emitter.emit(
          'rack:check_to_place',
          false,
          this.crateSelectedToSwap
        );
      }

      setTimeout(
        () => {
          this.isBigCrate = crate.getData('isBigCrate');
          Global.totalBottles = this.isBigCrate ? 24 : 6;
          canHighlightEmpty &&
            Global.emitter.emit('rack:highlight_empty_space', true);
          this.crateSelectedToSwap = crate;

          this.onDragStart(pointer, crate);
        },
        this.crateSelectedToSwap != null ? 150 : 0
      );
    }, 10);
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
    let rackInfo = this.checkForRackPlacement(
      boundsA2,
      boundsB,
      'rack2',
      this.dragCrateName
    );

    if (rackInfo['shelf'] == 0) {
      rackInfo = this.checkForRackPlacement(
        boundsA1,
        boundsB,
        'rack1',
        this.dragCrateName
      );
      if (rackInfo['shelf'] !== 0) {
        this.matchedRack = this.rack1;
      }
    } else {
      this.matchedRack = this.rack2;
    }
    if (this.dragStartKey == null) {
      this.dragStartKey = `${rackInfo['rack']}_left_${rackInfo['shelf']}`;
    }
    this.dragProgressKey = `${rackInfo['rack']}_left_${rackInfo['shelf']}`;

    this.isBigCrate = crateFrame.indexOf('6') == -1;
    if (this.matchedRack != null) {
      if (
        (!this.isBigCrate &&
          Global.crateData[
            `${rackInfo['rack']}_${rackInfo['side']}_${rackInfo['shelf']}`
          ]['status'] === 'empty') ||
        (this.isBigCrate &&
          Global.crateData[`${rackInfo['rack']}_left_${rackInfo['shelf']}`][
            'status'
          ] === 'empty' &&
          Global.crateData[`${rackInfo['rack']}_right_${rackInfo['shelf']}`][
            'status'
          ] === 'empty') /* && (
                    this.shrinkTwn.totalProgress>=1
                ) */
      ) {
        this.highlight.setAlpha(1);

        this.matchShelfFound = true;
        this.rackInfo = rackInfo;
        this.highlight.setFrame(
          `crate_${this.isBigCrate ? 24 : 6}_outline0000`
        );

        this.highlight.setPosition(
          this.matchedRack.x +
            (this.isBigCrate
              ? 0
              : Global.crateData[
                  `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`
                ]['position'].x) *
              this.scaleFact,
          this.matchedRack.y +
            Global.crateData[
              `${this.rackInfo['rack']}_${this.rackInfo['side']}_${this.rackInfo['shelf']}`
            ]['position'].y *
              this.scaleFact
        );
      } else {
        if (this.dragProgressKey === this.dragStartKey) {
        } else {
          this.isBigCrate = false;
        }
        this.matchShelfFound = false;
        this.matchedRack = null;
        this.highlight.setAlpha(0);
      }
    } else {
      // this.isBigCrate = false;
      this.matchShelfFound = false;
      this.matchedRack = null;
      this.highlight.setAlpha(0);
    }
  }
  checkForRackPlacement(boundsA, boundsB, rackKey, crateType) {
    let overlapCheck = Phaser.Geom.Intersects.GetRectangleIntersection(
      boundsA,
      boundsB
    );

    let rackInfo = {
      rack: rackKey,
      shelf: 0,
      side: null,
    };
    let rack = this[rackKey];
    if (overlapCheck.width > 0 && rack.visible) {
      let rack2Y = rack.y - rack.height * 0.5 * rack.scaleY;
      let crateY =
        (boundsB.y + boundsB.height - rack2Y) / (rack.height * rack.scaleY);

      let XPos = ((overlapCheck.x - rack.x) / rack.width) * rack.scaleX + 0.5;

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

        if (crateType.indexOf('6') !== -1) {
          if (boundsA.x >= boundsB.x) {
            rackInfo['side'] = 'left';
          } else {
            rackInfo['side'] = 'right';
          }
        } else {
          rackInfo['side'] = 'right';
        }
      }
    }

    return rackInfo;
  }
  onResize() {
    setScaleFactor.call(this, false);

    if (this.rackContainerMaskGr) {
      this.rackContainerMaskGr.clear();
      if (Global.lastOrientation !== 'portrait') {
        this.rackContainerMaskGr.fillStyle(0xffffff, 1);
        this.rackContainerMaskGr.fillRect(
          0,
          this.extraTop + 300 * this.scaleFact,
          this.c_w -
            this.extraLeftPer -
            this.extraTop / 2 -
            (950 + 1800 + 450) * this.scaleFact,
          this.c_h - 300 * this.scaleFact
        );
      }

      // this.rackContainerMaskGr.fillRect(
      //   Global.lastOrientation !== 'portrait'
      //     ? this.c_w -
      //         this.extraLeftPer -
      //         (Global.lastOrientation == 'portrait' ? 400 : 300) *
      //           this.scaleFact
      //     : this.c_w - this.extraLeftPer - 300 * this.scaleFact,
      //   this.extraTop +
      //     (Global.lastOrientation == 'portrait' ? 400 : 300) * this.scaleFact,
      //   Global.lastOrientation !== 'portrait'
      //     ? this.c_w -
      //         this.extraLeftPer -
      //         this.extraTop / 2 -
      //         (900 + 1800 + 450) * this.scaleFact
      //     : 300 * this.scaleFact,
      //   this.c_h -
      //     (Global.lastOrientation == 'portrait' ? 400 : 300) * this.scaleFact
      // );
    }
    this.arrowRight &&
      this.arrowRight.scene &&
      this.arrowRight
        .setScale(
          this.scaleFact *
            0.4 *
            (Global.lastOrientation == 'portrait' ? 1.75 : 1)
        )
        .setPosition(
          this.c_w -
            this.extraLeftPer -
            this.extraTop / 2 -
            1330 * this.scaleFact,
          this.c_h * 0.5 - 880 * this.scaleFact
        );

    this.arrowLeft &&
      this.arrowLeft.scene &&
      this.arrowLeft
        .setScale(
          -this.scaleFact *
            0.4 *
            (Global.lastOrientation == 'portrait' ? 1.75 : 1),
          this.scaleFact *
            0.4 *
            (Global.lastOrientation == 'portrait' ? 1.75 : 1)
        )
        .setPosition(
          this.c_w -
            this.extraLeftPer -
            this.extraTop / 2 -
            1830 * this.scaleFact,
          this.c_h * 0.5 - 880 * this.scaleFact
        );

    this.rackInfoTxt &&
      this.rackInfoTxt.scene &&
      this.rackInfoTxt
        .setFontSize(
          Global.isMobile ? 60 * this.scaleFact : 60 * this.scaleFact
        )
        .setPosition(
          this.c_w -
            this.extraLeftPer -
            this.extraTop / 2 -
            1580 * this.scaleFact,
          this.c_h * 0.5 - 880 * this.scaleFact
        );
    if (
      Global.lastOrientation == 'portrait' &&
      this.arrowRight &&
      this.arrowRight.scene
    ) {
      this.arrowRight.x = this.c_w * 0.5 + 450 * this.scaleFact;
      this.arrowLeft.x = this.c_w * 0.5 - 450 * this.scaleFact;

      this.arrowLeft.y = this.c_h * 0.5 - 820 * this.scaleFact;
      this.arrowRight.y = this.c_h * 0.5 - 820 * this.scaleFact;
      this.rackInfoTxt.setFontSize(100 * this.scaleFact);
      this.rackInfoTxt.setPosition(this.c_w * 0.5, this.arrowRight.y);
    }
    for (i = 1; i <= window.racks; i++) {
      this[`rack${i}`] &&
        this[`rack${i}`].scene &&
        this[`rack${i}`]
          .setPosition(
            Global.lastOrientation == 'portrait'
              ? this.c_w * 0.5 +
                  (550 -
                    1100 * (i - 1) -
                    1100 * (window.racks % 2) +
                    1100 * 2 * this.rackNavigateIndex) *
                    this.scaleFact
              : this.c_w -
                  this.extraLeftPer -
                  this.extraTop / 2 -
                  (900 +
                    1350 * (window.racks % 2) +
                    1350 * (i - 1) -
                    1350 * 2 * this.rackNavigateIndex) *
                    this.scaleFact,
            this.c_h * 0.5 +
              (Global.lastOrientation == 'portrait' ? 450 : 250) *
                this.scaleFact
          )
          .setScale(
            this.scaleFact * (Global.lastOrientation == 'portrait' ? 1.4 : 1.4)
          );
    }

    this.addBtn &&
      this.addBtn
        .setPosition(
          this.c_w -
            this.extraLeftPer -
            this.extraTop / 2 -
            (100 + 650 + 150) * this.scaleFact,
          this.c_h * 0.5 - 0 * this.scaleFact
        )
        .setScale(this.scaleFact * 1.3);

    this.highlight.setScale(this.scaleFact * 0.7);

    if (Global.isMobile || true) {
      Object.keys(Global.crateData).forEach((crateDataKey) => {
        let rack = this[crateDataKey.split('_')[0]];
        let posData = Global.crateData[crateDataKey]['position'];

        this[`highlight_${crateDataKey}`]
          .setPosition(
            rack.x + posData.x * this.scaleFact,
            rack.y + posData.y * this.scaleFact
          )
          .setScale(this.scaleFact * 0.7);
        if (crateDataKey.indexOf('right') != -1) {
          this[`highlight_${crateDataKey.replace('right', 'center')}`]
            .setPosition(rack.x, rack.y + posData.y * this.scaleFact)
            .setScale(this.scaleFact * 0.7);
        }
      });
    }
    for (let i = 1; i <= window.racks; i++) {
      for (let j = 1; j <= 4; j++) {
        this[`rack${i}_shelf${j}_left_info`] &&
          this[`rack${i}_shelf${j}_left_info`].scene &&
          this[`rack${i}_shelf${j}_left_info`]
            .setPosition(
              this[`rack${i}`].x -
                (Global.lastOrientation == 'portrait' ? 525 : 650) *
                  this.scaleFact,
              this[`rack${i}`].y - (900 - 450 * (j - 1)) * this.scaleFact
            )
            .setScale(this.scaleFact * 1.2);

        this[`rack${i}_shelf${j}_left_info_txt`] &&
          this[`rack${i}_shelf${j}_left_info_txt`].scene &&
          this[`rack${i}_shelf${j}_left_info_txt`]
            .setPosition(
              this[`rack${i}_shelf${j}_left_info`].x,
              this[`rack${i}_shelf${j}_left_info`].y
            )
            .setWordWrapWidth(
              this[`rack${i}_shelf${j}_left_info`].width *
                this[`rack${i}_shelf${j}_left_info`].scaleX *
                0.95
            )
            .setFontSize(34 * this.scaleFact);

        this[`rack${i}_shelf${j}_right_info`] &&
          this[`rack${i}_shelf${j}_right_info`].scene &&
          this[`rack${i}_shelf${j}_right_info`]
            .setPosition(
              this[`rack${i}`].x +
                (Global.lastOrientation == 'portrait' ? 525 : 650) *
                  this.scaleFact,
              this[`rack${i}`].y - (680 - 450 * (j - 1)) * this.scaleFact
            )
            .setScale(-this.scaleFact * 1.2, this.scaleFact * 1.2);

        this[`rack${i}_shelf${j}_right_info_txt`] &&
          this[`rack${i}_shelf${j}_right_info_txt`].scene &&
          this[`rack${i}_shelf${j}_right_info_txt`]
            .setPosition(
              this[`rack${i}_shelf${j}_right_info`].x,
              this[`rack${i}_shelf${j}_right_info`].y
            )
            .setWordWrapWidth(
              this[`rack${i}_shelf${j}_left_info`].width *
                this[`rack${i}_shelf${j}_left_info`].scaleX *
                0.95
            )
            .setFontSize(34 * this.scaleFact);
      }
    }

    this.children.entries.forEach((gameObject) => {
      if (gameObject.getData('crateItems')) {
        let matchedRack = gameObject.getData('rackInfo')['rack'];
        let side = gameObject.getData('rackInfo')['side'];
        let shelf = gameObject.getData('rackInfo')['shelf'];
        let isBigCrate = gameObject.getData('isBigCrate');

        gameObject
          .setPosition(
            this[matchedRack].x +
              (isBigCrate
                ? 0
                : Global.crateData[`${matchedRack}_${side}_${shelf}`][
                    'position'
                  ].x) *
                this.scaleFact,
            this[matchedRack].y +
              Global.crateData[`${matchedRack}_${side}_${shelf}`]['position']
                .y *
                this.scaleFact +
              120 * this.scaleFact
          )
          .setScale(this.scaleFact * 0.7);

        // return false;
        [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
          if (
            child.getData('filledIndex') &&
            child.getData('filledIndex') > 0
          ) {
            child
              .setPosition(
                gameObject.x,
                gameObject.y +
                  (child.getData('filledIndex') - 2.5) *
                    (!isBigCrate ? 70 : 70) *
                    this.scaleFact
              )
              .setScale(this.scaleFact * 0.7);
          } else {
            child
              .setPosition(gameObject.x, gameObject.y)
              .setScale(this.scaleFact * 0.7);
          }
          // child.setPosition(child.getData('initX'), child.getData('initY'))
        });
        gameObject.getData('maskGr') &&
          gameObject.getData('maskGr').destroy(true);
        this.crateMaskGr = this.scene.add.graphics();
        this.crateMaskGr.setPosition(
          gameObject.x - this.highlight.width * gameObject.scaleX,
          gameObject.y -
            120 * this.scaleFact -
            this.highlight.height * gameObject.scaleY * 2
        );
        this.crateMaskGr.fillStyle(0xff0000, 0.0);
        this.crateMaskGr.fillRect(
          0,
          0,
          this.highlight.width * this.highlight.scaleX * 3,
          this.highlight.height * this.highlight.scaleY * 2.5
        );
        this.crateMaskGr.setDepth(1200 + 100);
        this.add(this.crateMaskGr);
        gameObject.setData('maskGr', this.crateMaskGr);
        [gameObject, ...gameObject.getData('crateItems')].forEach((child) => {
          child.setMask(this.crateMaskGr.createGeometryMask());
          // child.setPosition(child.getData('initX'), child.getData('initY'))
        });
      }
    });
    this.infoIcon &&
      this.infoIcon.scene &&
      this.infoIcon
        .setScale(this.scaleFact)
        .setPosition(
          this.infoIcon.getData('refItem').x +
            this.infoIcon.getData('refItem').width *
              this.infoIcon.getData('refItem').scaleX *
              0.4,
          this.infoIcon.getData('refItem').y - 250 * this.scaleFact
        );
  }
}
