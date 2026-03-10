import { logout, updateHintStatus } from './api';
import EventEmitter from './event-emitter';
import { Global } from './global';
import { setScaleFactor } from './scale_factor';

export default class Header extends Phaser.GameObjects.Group {
  constructor(game) {
    super(game);
    this.skipInfoShown = false;

    Global.isToggleOn = true;
    this.skipVisible = true;
    this.tempBtnEnabled = false;
    // this.Obj=this;
    if (!Global.headerTriggered) {
      Global.headerTriggered = true;
      document
        .querySelector('#change_address_confirm #confirm')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          this.doChangeAddress();
        });
      document
        .querySelector('#change_address_confirm #cancel')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          this.cancelChangeAddress();
        });

      // document.querySelector("#skip_confirm #confirm").addEventListener("click", () => {
      //     this.skipGame();
      // });
      document
        .querySelector('#skip_confirm #cancel')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          this.cancelSkip();
        });

      document
        .querySelector('#logout_confirm #lg_confirm')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          this.doLogout();
        });
      document
        .querySelector('#logout_confirm #lg_cancel')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          this.hideLogout();
        });

      document
        .querySelector('#ready_info #confirm')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          this.skipGame();
        });
      document
        .querySelector('#ready_info #cancel')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          this.cancelReadyInfo();
        });

      document
        .querySelector('#mixed_options #option-12')
        .addEventListener('click', (v) => {
          Global.emitter.emit('repeat:hide');
          v.preventDefault();
          v.stopImmediatePropagation();
          this.toggleType(true, false, 12);
          Global.emitter.emit('mixed:update_set', false, true, 12);
        });
      document
        .querySelector('#mixed_options #option-24')
        .addEventListener('click', (v) => {
          Global.emitter.emit('repeat:hide');
          v.preventDefault();
          v.stopImmediatePropagation();
          this.toggleType(true, false, 24);
          Global.emitter.emit('mixed:update_set', false, true, 24);
        });
      document
        .querySelector('#mixed_options #option-fixed')
        .addEventListener('click', (v) => {
          Global.emitter.emit('repeat:hide');
          v.preventDefault();
          v.stopImmediatePropagation();
          this.toggleType(false, false, 24);
          Global.emitter.emit('mixed:update_set', false, true, 24);

          // Global.emitter.emit('toggle:update', false, 24);
        });
    }

    //
  }
  setUp() {
    setScaleFactor.call(this, false);
    this.emitter = EventEmitter.getObj();
    Global.emitter.on(
      'mixed:update_btn_label',
      this.updateMixedLabel.bind(this)
    );
    Global.emitter.on('header:update_crate', this.updateCrate.bind(this));
    Global.emitter.on('header:show_skip', this.showSkip.bind(this));
    Global.emitter.on('game:resize', this.onResize.bind(this));
    Global.emitter.on('crate:add_crate', this.onCrateAdd.bind(this));
    Global.emitter.on(
      'header:update_crate_status',
      this.updateCrateBtnStatus.bind(this)
    );
    Global.emitter.on(
      'header:update_skip_frame',
      this.updateSkipFrame.bind(this)
    );
    Global.emitter.on('header:show_ready_info', this.showReadyInfo.bind(this));
    Global.emitter.on('header:hide_ready_info', this.hideReadyInfo.bind(this));
    Global.emitter.on('toggle:update', this.forceUpdateToggle.bind(this));
    Global.emitter.on('game:show', this.showGame.bind(this));
    Global.emitter.on('popup_update', this.updateToggleState.bind(this, true));
    Global.emitter.on('trigger_skip', this.onSkipPress.bind(this));
    Global.emitter.on('trigger_confirm_logout', this.confirmLogout.bind(this));
    Global.emitter.on(
      'trigger_change_address',
      this.onChangeAddressPress.bind(this)
    );

    Global.emitter.on('update_hide_checked', this.updateHideChecked.bind(this));
    Global.emitter.on('skip_hint_close', this.onSkipHintClose.bind(this));
    Global.emitter.on('score:show', () => {
      this.tempBtnEnabled = true;
    });
    this.tempBtnEnabled = false;
    this.hideChecked = false;
    this.skipHintBGActive = false;
    Global.cratesCreated = 0;
    this.readyInfoShown = false;

    // this.doChangeAddress= this.doChangeAddress.bind(this)
    // this.cancelChangeAddress= this.cancelChangeAddress.bind(this)
    // this.skipGame= this.skipGame.bind(this)
    // this.cancelSkip= this.cancelSkip.bind(this)
    // this.doLogout= this.doLogout.bind(this)
    // this.hideLogout= this.hideLogout.bind(this)
    // this.cancelReadyInfo= this.cancelReadyInfo.bind(this)
  }

  init() {
    this.BG = this.scene.add.graphics();
    this.BG.fillStyle(0xffffff, 0);
    this.BG.fillRect(
      this.extraLeftPer,
      this.extraTop,
      (this.c_w - this.extraLeftPer) * 0.2,
      300 * this.scaleFact
    );
    this.BG.fillStyle(0xffffff, 0);
    this.BG.fillRect(
      (this.c_w - this.extraLeftPer) * 0.2,
      this.extraTop,
      (this.c_w - this.extraLeftPer) * 0.8,
      300 * this.scaleFact
    );
    this.add(this.BG);

    this.logo = this.create(
      this.extraLeftPer + (this.c_w - this.extraLeftPer) * 0.1,
      150 * this.scaleFact + this.extraTop,
      'items',
      'logo0000'
    )
      .setInteractive({
        cursor: 'pointer',
      })
      .on('pointerdown', () => {
        location.href = 'https://deliveryves.be/';
      })
      .setDepth(1100 + 1000)
      .setScale(this.scaleFact * 1.2);

    // var postFxPlugin = this.scene.plugins.get('rexdropshadowpipelineplugin');
    // var postFxPipeline = postFxPlugin
    //     .add(this.BG, {
    //         distance: 15*this.scaleFact,
    //         angle: -90,
    //         blur:5,
    //         shadowColor: 0xc4c4c4,//0xc4c4c4,
    //         alpha: 0.75
    //     });

    this.crateCreatedBG = this.create(
      this.extraLeftPer +
        (this.c_w - this.extraLeftPer) * 0.2 +
        200 * this.scaleFact,
      150 * this.scaleFact + this.extraTop,
      'items',
      'crate_filled_bg0000'
    ).setScale(this.scaleFact * 1.5);

    this.crateCreatedTxt = this.scene.make
      .text({
        x: this.crateCreatedBG.x - 40 * this.scaleFact,
        y: this.crateCreatedBG.y + 5 * this.scaleFact,
        text: `${Global.filledTotal}/${
          window.racks * 4 -
          (parseInt(window.showEmpty)
            ? 1
            : 0) /* window.rack1Visible ? '7' : '3.5' */
        }`,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        style: {
          font: Global.isMobile
            ? '' + String(45 * this.scaleFact) + 'px greycliff-bold'
            : '' + String(45 * this.scaleFact) + 'px greycliff-bold',
          fill: '#ffffff',
          align: 'center',
        },
      })
      .setDepth(1005 + 1000);

    this.add(this.crateCreatedTxt);

    this.crateCreatedHead = this.scene.make
      .text({
        x: this.crateCreatedBG.x + 150 * this.scaleFact,
        y: this.crateCreatedBG.y + 5 * this.scaleFact,
        text: `SCHAPPEN`,
        origin: {
          x: 0,
          y: 0.5,
        },
        style: {
          font: Global.isMobile
            ? '' + String(70 * this.scaleFact) + 'px greycliff-medium'
            : '' + String(70 * this.scaleFact) + 'px greycliff-medium',
          fill: '#ffffff',
          align: 'center',
        },
      })
      .setDepth(1005 + 1000);

    this.add(this.crateCreatedHead);

    if (window.isLoggedIn) {
      this.logoutBtn = this.create(
        this.c_w - this.extraLeftPer - 300 * this.scaleFact,
        150 * this.scaleFact + this.extraTop,
        'items',
        'logout0000'
      )
        .setScale(this.scaleFact * 0.75)
        .setInteractive({
          cursor: 'pointer',
        })
        .on('pointerdown', this.confirmLogout.bind(this))
        .on('pointerover', this.onHover.bind(this, 'logoutBtn', 'logout_10000'))
        .on('pointerout', this.onHover.bind(this, 'logoutBtn', 'logout0000'));
    }

    this.toggleSwitchLabel = this.scene.make
      .text({
        x: this.crateCreatedBG.x + 850 * this.scaleFact,
        y: this.crateCreatedBG.y + 5 * this.scaleFact,
        text: `MIXED KRAT`,
        origin: {
          x: 0,
          y: 0.5,
        },
        style: {
          font: Global.isMobile
            ? '' + String(55 * this.scaleFact) + 'px greycliff-bold'
            : '' + String(55 * this.scaleFact) + 'px greycliff-bold',
          fill: '#ffffff',
          align: 'center',
        },
      })
      .setAlpha(0)
      .setDepth(1005 + 1000);
    this.mixedBtn = this.create(
      this.crateCreatedBG.x + 1320 * this.scaleFact,
      this.crateCreatedBG.y - 40 * this.scaleFact,
      'items',
      'mixedBtn0000'
    )
      .setScale(this.scaleFact * 0.75)
      .setInteractive({
        cursor: 'pointer',
      })
      .on('pointerdown', () => {
        Global.emitter.emit('mixed:update_set');
      })
      // .on('pointerover', () => {
      //   Global.emitter.emit('toggle_info:show');
      // })
      // .on('pointerout', () => {
      //   Global.emitter.emit('toggle_info:hide');
      // })
      .setDepth(1005 + 1000);
    this.toggleInfoIcon = this.create(
      this.crateCreatedBG.x + 1320 * this.scaleFact,
      this.crateCreatedBG.y - 40 * this.scaleFact,
      'items',
      'infoBtn0000'
    )
      .setScale(this.scaleFact * 0.75)
      .setInteractive({
        cursor: 'pointer',
      })
      .on('pointerover', () => {
        Global.emitter.emit('toggle_info:show');
      })
      .on('pointerout', () => {
        Global.emitter.emit('toggle_info:hide');
      })
      .setDepth(1005 + 1000);

    // this.toggleSwitch = this.scene.add.rexToggleSwitch(
    //   this.crateCreatedBG.x + 1460 * this.scaleFact,
    //   150 * this.scaleFact + this.extraTop,
    //   200 * this.scaleFact,
    //   200 * this.scaleFact,
    //   0xfbde42
    // );
    // this.toggleSwitch.on(
    //   'valuechange',
    //   function (value) {
    //     Global.emitter.emit('repeat:hide');
    //     this.toggleType(value, false, false);
    //   }.bind(this)
    // );

    if (window.isLoggedIn) {
      console.log(Object.keys(window.address).length, 'adds');
      if (Object.keys(window.address).length <= 1) {
        document.querySelector('#changeAddress').classList.add('disabled');
      }
      this.changeAddress = this.create(
        this.c_w - this.extraLeftPer - 1400 * this.scaleFact,
        150 * this.scaleFact + this.extraTop,
        'items',
        'changeAddress0000'
      )
        .setScale(this.scaleFact * 0.75)
        .setVisible(Object.keys(window.address).length > 1)
        .setInteractive({
          cursor: 'pointer',
        })
        .on('pointerdown', this.onChangeAddressPress.bind(this))
        .on(
          'pointerover',
          this.onHover.bind(this, 'changeAddress', 'changeAddress_10000')
        )
        .on(
          'pointerout',
          this.onHover.bind(this, 'changeAddress', 'changeAddress0000')
        );
    }

    this.skipBtn = this.create(
      this.c_w -
        this.extraLeftPer -
        (window.isLoggedIn
          ? Object.keys(window.address).length > 1
            ? 1200 /* 1830 */
            : 1400
          : 800) *
          this.scaleFact,
      150 * this.scaleFact + this.extraTop,
      'items',
      'skip0000'
    )
      .setScale(this.scaleFact * 0.75)
      .setInteractive({
        cursor: 'pointer',
      })
      // .setVisible(false)
      .on('pointerdown', () => {
        if (Global.isEmptyRemains) {
          Global.emitter.emit('trigger_skip');
        } else {
          Global.emitter.emit('header:show_ready_info');
        }
        // this.onSkipPress.bind(this)
      })
      .on('pointerover', this.onHover.bind(this, 'skipBtn', 'skip_10000'))
      .on('pointerout', this.onHover.bind(this, 'skipBtn', 'skip0000'));

    this.skipHintBG = this.create(
      this.skipBtn.x - 330 * this.scaleFact,
      this.skipBtn.y + 340 * this.scaleFact,
      'items',
      'hintBG0000'
    )
      .setScale(this.scaleFact * 1)
      .setScale(0)
      .setInteractive({
        cursor: 'pointer',
      })
      .setDepth(1004 + 1000);

    this.menuTrigger = this.create(
      -300 * this.scaleFact,
      -300 * this.scaleFact,
      'items',
      'menu_trigger0000'
    )
      .setScale(this.scaleFact * 1)
      .setInteractive({
        cursor: 'pointer',
      })
      .on('pointerdown', () => {
        if (Global.popupActive) return false;
        Global.popupActive = true;
        document.querySelector('.mobile_menu').classList.add('active');
      })
      .setDepth(1004 + 1000);

    //

    this.skipHintTxt = this.scene.make
      .text({
        x: this.skipHintBG.x - 475 * this.scaleFact,
        y: this.skipHintBG.y - 50 * this.scaleFact,
        text: `Zorg ervoor dat u uw kratplaatsingen opslaat zodra u klaar bent.`,
        origin: {
          x: 0,
          y: 0.5,
        },
        style: {
          font: Global.isMobile
            ? '' + String(55 * this.scaleFact) + 'px greycliff-medium'
            : '' + String(55 * this.scaleFact) + 'px greycliff-medium',
          fill: '#055A38',
          align: 'left',
          wordWrap: { width: 1000 * this.scaleFact },
        },
      })
      .setScale(0)
      .setAlpha(0)
      .setDepth(1005 + 1000);

    this.hideCheck = this.create(
      this.skipHintBG.x - 475 * this.scaleFact,
      this.skipHintBG.y + 150 * this.scaleFact,
      'items',
      'hint_check0000'
    )
      .setScale(this.scaleFact * 0.8)
      .setAlpha(0)
      .setInteractive({
        cursor: 'pointer',
      })
      .on('pointerdown', this.updateHideChecked.bind(this))
      .setOrigin(0, 0.5)
      .setDepth(1005 + 1000);

    this.hideInfo = this.scene.make
      .text({
        x: this.hideCheck.x + 85 * this.scaleFact,
        y: this.hideCheck.y,
        text: `Toon dit nooit meer`,
        origin: {
          x: 0,
          y: 0.5,
        },
        style: {
          font: Global.isMobile
            ? '' + String(40 * this.scaleFact) + 'px greycliff-medium'
            : '' + String(40 * this.scaleFact) + 'px greycliff-medium',
          fill: '#055A38',
          align: 'left',
          wordWrap: { width: 1000 * this.scaleFact },
        },
      })
      .setScale(0)
      .setAlpha(0)
      .setDepth(1005 + 1000);

    this.hideBtn = this.create(
      this.skipHintBG.x + 475 * this.scaleFact,
      this.skipHintBG.y + 150 * this.scaleFact,
      'items',
      'hint_close0000'
    )
      .setScale(0)
      .setAlpha(0)
      .setOrigin(1, 0.5)
      .setInteractive({
        cursor: 'pointer',
      })
      .on('pointerdown', this.onSkipHintClose.bind(this))
      .setDepth(1005 + 1000);

    this.add(this.hideInfo);
    this.add(this.crateCreatedHead);

    this.onResize();

    //
    this.toggleType(false, true, 24);
  }
  updateMixedLabel(updateBtn, updateFrame) {
    if (updateBtn) {
      this.mixedBtn.setFrame(
        `mixed${Global.isToggleOn ? updateFrame : 'Btn'}0000`
      );
    }
    // else{
    //    this.mixedBtn.setFrame('mixedBtn0000');
    // }
  }
  onSkipHintClose() {
    window.hideHint = this.hideChecked;
    if (!window.isLoggedIn) {
      localStorage.setItem('hideHint', window.hideHint);
    } else {
      updateHintStatus(this.hideChecked);
    }

    this.hideSkipHint();
    if (document.querySelector('.mobile_skip_ui')) {
      document.querySelector('.mobile_skip_ui').classList.remove('active');
      document.querySelector('.mobile_menu_close').click();
    }
  }
  updateHideChecked() {
    this.hideChecked = !this.hideChecked;
    this.hideCheck &&
      this.hideCheck.setFrame(
        !this.hideChecked ? 'hint_check0000' : 'hint_check_active0000'
      );

    if (this.hideChecked) {
      document
        .querySelector('.mobile_skip_ui .mobile_skip_check :nth-child(2)')
        .classList.add('active');
    } else {
      document
        .querySelector('.mobile_skip_ui .mobile_skip_check :nth-child(2)')
        .classList.remove('active');
    }
  }
  updateToggleState(checkBeforeToggle, status) {
    if (
      !checkBeforeToggle ||
      (checkBeforeToggle && Global.canUseCustomToggle)
    ) {
      // this.toggleSwitch.setReadOnly(status);
      // this.toggleSwitch.setAlpha(status ? 0.1 : 1);
      if (status && !checkBeforeToggle) {
        // this.toggleSwitch.setValue(false);
      }
    }

    if (Global.canUseCustomToggle) {
      this.mixedBtn.setAlpha(1).setInteractive({
        cursor: 'pointer',
      });
    } else {
      this.mixedBtn.setAlpha(0.5).disableInteractive();
      this.toggleType(false, false, 24);
      Global.emitter.emit('mixed:update_set', false, true, 24);
    }
    if (status) {
      Global.emitter.emit('repeat:hide');
    }
  }
  forceUpdateToggle(toggleStatus, isTemp = false) {
    // return false;
    // alert('forceUpdateToggle' + ':' + toggleStatus + isTemp);
    if (!toggleStatus) {
      if (Global.isToggleOn) {
        /* this.scene.tweens.add({
                    targets: this.toggleBG2,
                    x: this.c_w-this.extraLeftPer - ((window.isLoggedIn?850:350)+160*(1))*this.scaleFact,
                    ease: 'Cubic.InOut',
                    duration: 250,
                    repeat: 0, // -1: infinity
                    yoyo: false,
        
                }); */
        Global.emitter.emit('crate:select', 24, 'fixed', true);
        Global.emitter.emit('bottle:remove');
      }
      /*  this.toggleBG
            .disableInteractive();

            this.toggleBG.setAlpha(0.5);
            this.toggleBG2.setAlpha(0.5); */
      if (isTemp) {
        this.toggleType(toggleStatus, false, 24);
        Global.emitter.emit('mixed:update_set', false, true, 24);
        // setTimeout(() => {
        //   Global.emitter.emit('repeat:hide');
        // }, 10);
        // console.log(isTemp, 'isTemp');
        // this.toggleSwitch.setValue(toggleStatus);
        return false;
      }
      this.updateToggleState(false, true);
      Global.isToggleOn = false;
    } else {
      this.updateToggleState(false, false);
    }
  }
  toggleType(value, isStart = false, type = -1) {
    // return false;
    if (Global.popupActive) return false;

    Global.isToggleOn = value; //!Global.isToggleOn;

    this.emitter.emit('hint:hide');
    if (!isStart) {
      Global.emitter.emit(
        'crate:select',
        type,
        Global.isToggleOn ? 'custom' : 'fixed',
        true
      );
      Global.emitter.emit('bottle:remove');
    }
    // this.scene.tweens.add({
    //     targets: this.toggleBG2,
    //     x: this.c_w-this.extraLeftPer - ((window.isLoggedIn?850:350)+160*(Global.isToggleOn?-1:1))*this.scaleFact,
    //     ease: 'Cubic.InOut',
    //     duration: quick?0:250,
    //     repeat: 0, // -1: infinity
    //     yoyo: false,

    // });
    // if(Global.isToggleOn){
    //     this.toggleRegularTxt.setColor('#ffffff')
    //     this.toggleCustomTxt.setColor('#055A38')
    // }else{
    //      this.toggleCustomTxt.setColor('#ffffff')
    //     this.toggleRegularTxt.setColor('#055A38')
    // }
  }
  hideSkipHint() {
    this.skipHintBGActive = false;
    if (Global.lastOrientation == 'portrait') {
      return false;
    }

    this.scene.tweens.add({
      targets: [this.skipHintBG, this.skipHintTxt],
      ease: 'Back.Out',
      scale: 0,
      duration: 350,
      delay: 250, // -1: infinity
      yoyo: false,
    });

    this.scene.tweens.add({
      targets: [this.skipHintTxt, this.hideCheck, this.hideInfo, this.hideBtn],
      ease: 'Linear.Out',
      alpha: 0,
      duration: 350,
      delay: 0,
      repeat: 0, // -1: infinity
      yoyo: false,
      onComplete: function () {
        this.skipHintTxt.setScale(0);
        this.hideCheck.setScale(0);
        this.hideInfo.setScale(0);
        this.hideBtn.setScale(0);
      }.bind(this),
    });
    this.hideSkipHintTO && clearTimeout(this.hideSkipHintTO);
  }
  showSkipHint() {
    if (this.skipInfoShown) return false;

    this.skipInfoShown = true;

    this.skipHintBGActive = true;

    if (Global.lastOrientation == 'portrait') {
      setTimeout(() => {
        Global.popupActive = true;
      }, 100);
      document.querySelector('.mobile_menu').classList.add('active');
      document.querySelector('.mobile_skip_ui').classList.add('active');

      return false;
    }
    this.scene.tweens.add({
      targets: [this.skipHintBG],
      ease: 'Back.Out',
      scale: this.scaleFact * 1.15,
      duration: 350,
      repeat: 0, // -1: infinity
      yoyo: false,
    });
    this.skipHintTxt.setScale(1);
    this.hideCheck.setScale(this.scaleFact * 0.8);
    this.hideInfo.setScale(1);
    this.hideBtn.setScale(this.scaleFact);

    this.scene.tweens.add({
      targets: [this.hideInfo],
      ease: 'Back.Out',
      scale: 1,
      duration: 350,
      repeat: 0, // -1: infinity
      yoyo: false,
    });
    this.skipHintTxt
      .setFontSize(55 * this.scaleFact)
      .setWordWrapWidth(1000 * this.scaleFact);

    this.scene.tweens.add({
      targets: [this.skipHintTxt, this.hideCheck, this.hideInfo, this.hideBtn],
      ease: 'Linear.Out',
      alpha: 1,
      duration: 350,
      delay: 300,
      repeat: 0, // -1: infinity
      yoyo: false,
    });
    // this.hideSkipHintTO= setTimeout(this.hideSkipHint.bind(this), 3000)
  }
  updateSkipFrame(btnStatus) {
    this.skipBtn
      .setFrame(btnStatus == 'skip' ? 'skip0000' : 'ready0000')
      .on(
        'pointerover',
        this.onHover.bind(
          this,
          'skipBtn',
          btnStatus == 'skip' ? 'skip_10000' : 'ready_10000'
        )
      )
      .on(
        'pointerout',
        this.onHover.bind(
          this,
          'skipBtn',
          btnStatus == 'skip' ? 'skip0000' : 'ready0000'
        )
      );
  }
  triggerCrate() {
    if (Global.popupActive) return false;
    Global.emitter.emit('bottle:remove');
    Global.emitter.emit('crate:remove');
    Global.emitter.emit('crate_selection:enable');
    Global.emitter.emit('repeat:hide');
  }
  updateCrateBtnStatus(status, isPrefill) {
    // alert(status);
    if (
      !this.skipInfoShown &&
      status == 'add' &&
      !isPrefill &&
      !window.hideHint
    ) {
      // this.showSkipHint();
    }
    if (status == 'add') {
      // this.addOrChangeCrate.setFrame('addCrate0000');
      // this.addOrChangeCrate
      // .on('pointerover', this.onHover.bind(this, 'addOrChangeCrate', 'addCrate_10000'))
      // .on('pointerout', this.onHover.bind(this, 'addOrChangeCrate', 'addCrate0000'))
    } else if (status == 'change') {
      // this.addOrChangeCrate.setFrame('changeCrate0000');
      // this.addOrChangeCrate
      // .on('pointerover', this.onHover.bind(this, 'addOrChangeCrate', 'changeCrate_10000'))
      // .on('pointerout', this.onHover.bind(this, 'addOrChangeCrate', 'changeCrate0000'))
    }
  }
  /*  showOrHideUI(status){
        this.setVisible(status)
    } */
  updateCrate(toAdd) {
    Global.cratesCreated += toAdd;

    setTimeout(() => {
      let filledData = {};
      let totalShelfFilled = 0;

      /* Object.keys(Global.crateData).forEach((key) => {
            if(
                Global.crateData[key]['status'] === 'taken' && 
                Global.crateData[key]['filledBottles'] != null 
            ){
                let rackInfo=key.split("_");
                console.log(filledData[`${rackInfo[0]}_${rackInfo[2]}`], '<<>>',`${rackInfo[0]}_${rackInfo[2]}`)
                if(!filledData[`${rackInfo[0]}_${rackInfo[2]}`]){
                    filledData[`${rackInfo[0]}_${rackInfo[2]}`]=1;
                    totalShelfFilled++;
                }
            }
        }); */

      Global.emitter.emit('rack:update_availability');
      for (let rackCnt = 1; rackCnt <= window.racks; rackCnt++) {
        for (let shelfCnt = 1; shelfCnt <= 4; shelfCnt++) {
          /* if(Global.crateData[`rack${rackCnt}_left_${shelfCnt}`] && Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'] && Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'].length>1){
                    totalShelfFilled++;
                }
                if(Global.crateData[`rack${rackCnt}_left_${shelfCnt}`] && Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'] && Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'].length==1){
                    totalShelfFilled+=0.5;
                }
                if(Global.crateData[`rack${rackCnt}_right_${shelfCnt}`] && Global.crateData[`rack${rackCnt}_right_${shelfCnt}`]['filledBottles'] &&  Global.crateData[`rack${rackCnt}_right_${shelfCnt}`]['filledBottles'].length==1){
                    totalShelfFilled+=0.5;
                } */

          if (
            (rackCnt != 1 || (rackCnt == 1 && shelfCnt != 4)) &&
            ((rackCnt == 1 && window.rack1Visible) || rackCnt != 1)
          ) {
            if (
              Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['status'] ==
                'taken' &&
              (Global.crateData[`rack${rackCnt}_right_${shelfCnt}`]['status'] ==
                'taken' ||
                (rackCnt == 2 && shelfCnt == 4))
            ) {
              // console.log(Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'],'ABC');
              // console.log(Global.crateData[`rack${rackCnt}_right_${shelfCnt}`]['filledBottles'],'DEF');
              /* if(
                            (rackCnt == 2 && shelfCnt ==4 && Global.crateData[`rack${rackCnt}_right_${shelfCnt}`]['filledBottles'] && Global.crateData[`rack${rackCnt}_right_${shelfCnt}`]['filledBottles'].length>1 && Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'] && Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'].length>1 && window.rack1Visible) ||
                            (rackCnt != 2 || shelfCnt !=4) ||
                            (rackCnt == 2 && shelfCnt ==4 && (Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'] && Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'].length==1 && !window.rack1Visible) ||
                            (rackCnt == 2 && shelfCnt ==4 && (Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'] && Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'].length==1 && Global.crateData[`rack${rackCnt}_right_${shelfCnt}`]['filledBottles'] && Global.crateData[`rack${rackCnt}_right_${shelfCnt}`]['filledBottles'].length==1 && window.rack1Visible))
                            ) 
                        ){
                            totalShelfFilled++;
                        } */
              /* if(!((rackCnt == 2 && shelfCnt ==4 && Global.crateData[`rack${rackCnt}_left_${shelfCnt}`]['filledBottles'].length>1) || !window.rack1Visible)){
                            totalShelfFilled++;
                        } */
            }
          }
        }
      }

      // this.crateCreatedTxt.setText(`${Global.cratesCreated}/7`)
      setTimeout(() => {
        // this.crateCreatedTxt.setText(`${totalShelfFilled}/${window.rack1Visible?'7':'4'}`);
        this.crateCreatedTxt.setText(
          `${Global.filledTotal}/${
            window.racks * 4 -
            (parseInt(window.showEmpty)
              ? 1
              : 0) /* window.rack1Visible ? '7' : '3.5' */
          }`
        );
      }, 100);
    }, 500);
  }
  onCrateAdd() {
    // this.addOrChangeCrate.setVisible(true)
  }
  showReadyInfo() {
    document.querySelector('#ready_info').classList.add('active');
    Global.emitter.emit('popup_update', true);
    this.readyInfoShown = true;
  }
  hideReadyInfo() {
    // this.readyInfoShown= false;
    document.querySelector('#ready_info').classList.remove('active');
    // Global.popupActive= false;
    Global.emitter.emit('popup_update', false);
  }
  onChangeAddressPress() {
    if (Global.popupActive && !this.tempBtnEnabled) return false;

    // Global.popupActive= true;
    Global.emitter.emit('popup_update', true);

    document.querySelector('#change_address_confirm').classList.add('active');
  }
  onSkipPress() {
    if (Global.popupActive) return false;

    if (this.skipBtn.frame.name.indexOf('skip') != -1) {
      document.querySelector('#skip_confirm').classList.add('active');
      // Global.popupActive= true;
      Global.emitter.emit('popup_update', true);
    } else {
      this.skipGame();
    }
  }
  skipGame() {
    // Global.popupActive= false;
    Global.emitter.emit('popup_update', true);

    this.skipBtn.setVisible(false);
    this.menuTrigger.setVisible(false);
    this.menuTrigger.setAlpha(0);
    this.skipVisible = false;
    // this.addOrChangeCrate.setVisible(false);
    document.querySelector('#skip_confirm').classList.remove('active');
    document.querySelector('#ready_info').classList.remove('active');
    document.querySelector('#ready_info').classList.remove('active');

    this.hideSkip();
    this.hideAddressSelection();
    this.hideToggle();
    this.hideSkipHint();

    Global.emitter.emit('game:skip');
  }
  hideToggle() {
    this.toggleSwitchLabel.setVisible(false);
    this.toggleInfoIcon.setVisible(false);
    // this.toggleSwitch.setVisible(false);

    this.mixedBtn.setVisible(false);
  }
  showToggle() {
    this.toggleSwitchLabel.setVisible(true);
    this.toggleInfoIcon.setVisible(true);
    // this.toggleSwitch.setVisible(true);

    this.mixedBtn.setVisible(true);
  }
  showAddressSelection() {
    this.changeAddress && this.changeAddress.setVisible(true);
  }
  hideAddressSelection() {
    this.changeAddress && this.changeAddress.setVisible(false);
  }
  showGame() {
    if (Global.lastOrientation !== 'portrait') {
      this.skipBtn.setVisible(true);
      this.showAddressSelection();
    } else {
      this.menuTrigger.setVisible(true);
      this.menuTrigger.setAlpha(1);
    }

    this.skipVisible = true;
    this.showSkip();

    this.showToggle();
    // this.addOrChangeCrate.setVisible(true);
  }
  cancelReadyInfo() {
    document.querySelector('#ready_info').classList.remove('active');
    // Global.popupActive= false;
    Global.emitter.emit('popup_update', false);
  }
  cancelSkip() {
    // alert("Cancel Skip")
    // Global.popupActive= false;
    Global.emitter.emit('popup_update', false);
    document.querySelector('#skip_confirm').classList.remove('active');
  }
  cancelChangeAddress() {
    // Global.popupActive= false;
    Global.emitter.emit('popup_update', false);
    document
      .querySelector('#change_address_confirm')
      .classList.remove('active');
  }
  doChangeAddress() {
    // Global.popupActive= false;
    Global.emitter.emit('popup_update', false);
    document
      .querySelector('#change_address_confirm')
      .classList.remove('active');
    Global.emitter.emit('address:pick_new');
  }
  confirmLogout() {
    if (Global.popupActive && !this.tempBtnEnabled) return false;

    // Global.popupActive= true;
    Global.emitter.emit('popup_update', true);
    document.querySelector('#logout_confirm').classList.add('active');
  }
  hideLogout() {
    // Global.popupActive= false;
    if (!this.tempBtnEnabled) {
      Global.emitter.emit('popup_update', false);
    }

    document.querySelector('#logout_confirm').classList.remove('active');
  }
  async doLogout() {
    this.hideLogout();
    await logout();
    location.href = './login.php';
  }
  onHover(key, frame) {
    this[key].setFrame(frame);
  }
  showSkip() {
    if (Global.lastOrientation !== 'portrait') {
      this.skipBtn.setVisible(true);
    }
    this.skipVisible = true;
    // this.skipIn
  }
  hideSkip() {
    this.skipBtn.setVisible(false);
    this.skipVisible = false;
  }
  onResize() {
    setScaleFactor.call(this, false);

    this.BG.clear();
    this.BG.fillStyle(0xffffff, 1);
    this.BG.fillRect(
      this.extraLeftPer,
      this.extraTop,
      this.c_w * (Global.lastOrientation == 'portrait' ? 0.35 : 0.2) -
        this.extraLeftPer / 2,
      (Global.lastOrientation == 'portrait' ? 400 : 300) * this.scaleFact
    );
    this.BG.fillStyle(0x55a383, 1);
    this.BG.fillRect(
      this.c_w * (Global.lastOrientation == 'portrait' ? 0.35 : 0.2) +
        this.extraLeftPer / 2,
      this.extraTop,
      this.c_w * (Global.lastOrientation == 'portrait' ? 0.65 : 0.8) -
        this.extraLeftPer,
      (Global.lastOrientation == 'portrait' ? 400 : 300) * this.scaleFact
    );
    this.add(this.BG);

    this.logo
      .setPosition(
        this.extraLeftPer * 0.75 +
          this.c_w * (Global.lastOrientation == 'portrait' ? 0.18 : 0.1),
        (Global.lastOrientation == 'portrait' ? 200 : 150) * this.scaleFact +
          this.extraTop
      )
      .setScale(
        this.scaleFact * (Global.lastOrientation == 'portrait' ? 1.5 : 1.2)
      );

    this.crateCreatedBG
      .setPosition(
        /* this.extraLeftPer + */ this.c_w *
          (Global.lastOrientation == 'portrait' ? 0.37 : 0.2) +
          this.extraLeftPer / 2 +
          200 * this.scaleFact,
        (Global.lastOrientation == 'portrait' ? 200 : 150) * this.scaleFact +
          this.extraTop
      )
      .setScale(
        this.scaleFact * (Global.lastOrientation == 'portrait' ? 2.25 : 1.5)
      );

    this.crateCreatedTxt
      .setPosition(
        this.crateCreatedBG.x -
          (Global.lastOrientation == 'portrait' ? 75 : 50) * this.scaleFact,
        this.crateCreatedBG.y + 5 * this.scaleFact
      )
      .setFontSize(
        (Global.lastOrientation == 'portrait' ? 65 : 45) * this.scaleFact
      );

    this.crateCreatedHead
      .setPosition(
        this.crateCreatedBG.x + 170 * this.scaleFact,
        this.crateCreatedBG.y + 5 * this.scaleFact
      )
      .setFontSize(70 * this.scaleFact);

    this.skipBtn
      .setPosition(
        this.c_w -
          this.extraLeftPer -
          (window.isLoggedIn
            ? Object.keys(window.address).length > 1
              ? 1200
              : 750
            : 300) *
            this.scaleFact,
        150 * this.scaleFact + this.extraTop
      )
      .setScale(this.scaleFact * 0.75);

    this.changeAddress &&
      this.changeAddress
        .setPosition(
          this.c_w - this.extraLeftPer - 750 * this.scaleFact,
          150 * this.scaleFact + this.extraTop
        )
        .setScale(this.scaleFact * 0.75);

    if (Global.lastOrientation == 'portrait') {
      this.skipBtn && this.skipBtn.setVisible(false);
      this.changeAddress && this.changeAddress.setVisible(false);
      this.logoutBtn && this.logoutBtn.setVisible(false);
      this.crateCreatedHead && this.crateCreatedHead.setVisible(false);
      this.menuTrigger &&
        this.menuTrigger
          .setVisible(true)
          .setScale(this.scaleFact * 0.9)
          .setPosition(
            this.c_w - this.extraLeftPer - 200 * this.scaleFact,
            200 * this.scaleFact + this.extraTop
          );
    } else {
      this.menuTrigger && this.menuTrigger.setVisible(false);
      this.crateCreatedHead && this.crateCreatedHead.setVisible(true);
      this.skipVisible && this.skipBtn && this.skipBtn.setVisible(true);
      this.changeAddress && this.changeAddress.setVisible(true);
      this.logoutBtn && this.logoutBtn.setVisible(true);
      this.crateCreatedHead && this.crateCreatedHead.setVisible(true);
      this.menuTrigger && this.menuTrigger.setVisible(false);
    }

    if (this.skipHintBGActive && Global.lastOrientation !== 'portrait') {
      this.skipHintTxt && this.skipHintTxt.setAlpha(1);
      this.hideCheck && this.hideCheck.setAlpha(1);
      this.hideInfo && this.hideInfo.setAlpha(1);
      this.hideBtn && this.hideBtn.setAlpha(1);

      this.skipHintTxt && this.skipHintTxt.setScale(1);
      this.hideCheck && this.hideCheck.setScale(1);
      this.hideInfo && this.hideInfo.setScale(1);
      this.hideBtn && this.hideBtn.setScale(1);

      this.skipHintBG && this.skipHintBG.setScale(this.scaleFact * 1.15);
    } else {
      this.skipHintTxt && this.skipHintTxt.setAlpha(0);
      this.hideCheck && this.hideCheck.setAlpha(0);
      this.hideInfo && this.hideInfo.setAlpha(0);
      this.hideBtn && this.hideBtn.setAlpha(0);

      this.skipHintTxt && this.skipHintTxt.setScale(0);
      this.hideCheck && this.hideCheck.setScale(0);
      this.hideInfo && this.hideInfo.setScale(0);
      this.hideBtn && this.hideBtn.setScale(0);

      this.skipHintBG && this.skipHintBG.setScale(0);
    }

    this.logoutBtn &&
      this.logoutBtn
        .setPosition(
          this.c_w - this.extraLeftPer - 300 * this.scaleFact,
          150 * this.scaleFact + this.extraTop
        )
        .setScale(this.scaleFact * 0.75);

    this.skipHintBG &&
      this.skipHintBG.setPosition(
        this.skipBtn.x - 330 * this.scaleFact,
        this.skipBtn.y + 340 * this.scaleFact
      );

    this.skipHintTxt &&
      this.skipHintTxt
        .setPosition(
          this.skipHintBG.x - 475 * this.scaleFact,
          this.skipHintBG.y - 50 * this.scaleFact
        )
        .setFontSize(55 * this.scaleFact)
        .setWordWrapWidth(1000 * this.scaleFact);

    this.toggleSwitchLabel &&
      this.toggleSwitchLabel
        .setPosition(
          Global.lastOrientation == 'portrait'
            ? this.c_w * 0.5 + this.extraLeftPer / 2 + 600 * this.scaleFact
            : this.crateCreatedBG.x + 650 * this.scaleFact,
          this.crateCreatedBG.y +
            (Global.lastOrientation == 'portrait' ? -75 : 5) * this.scaleFact
        )
        .setFontSize(55 * this.scaleFact);

    if (this.toggleSwitchLabel) {
      if (Global.lastOrientation == 'portrait') {
        this.toggleSwitchLabel.setText('MIXED\nKRAT');
      } else {
        this.toggleSwitchLabel.setText('MIXED KRAT');
      }
    }

    // this.toggleSwitch &&
    //   this.toggleSwitch
    //     .setPosition(
    //       Global.lastOrientation == 'portrait'
    //         ? this.toggleSwitchLabel.x +
    //             this.toggleSwitchLabel.width *
    //               this.toggleSwitchLabel.scaleX *
    //               0.5
    //         : this.crateCreatedBG.x + 1100 * this.scaleFact,
    //       (Global.lastOrientation == 'portrait' ? 280 : 150) * this.scaleFact +
    //         this.extraTop
    //     )
    //     .setDisplaySize(
    //       (Global.lastOrientation == 'portrait' ? 300 : 200) * this.scaleFact,
    //       (Global.lastOrientation == 'portrait' ? 300 : 200) * this.scaleFact
    //     );

    this.hideCheck &&
      this.hideCheck.setPosition(
        this.skipHintBG.x - 475 * this.scaleFact,
        this.skipHintBG.y + 150 * this.scaleFact
      );

    this.skipHintBGActive &&
      this.hideCheck &&
      this.hideCheck.setScale(this.scaleFact * 0.8);

    this.hideBtn &&
      this.hideBtn.setPosition(
        this.skipHintBG.x + 475 * this.scaleFact,
        this.skipHintBG.y + 150 * this.scaleFact
      );

    this.skipHintBGActive &&
      this.hideBtn &&
      this.hideBtn.setScale(this.scaleFact * 1);

    this.mixedBtn &&
      this.mixedBtn
        .setPosition(
          Global.lastOrientation == 'portrait'
            ? this.c_w * 0.39 + this.extraLeftPer / 2 + 740 * this.scaleFact
            : this.crateCreatedBG.x + 850 * this.scaleFact,
          this.crateCreatedBG.y +
            (Global.lastOrientation == 'portrait' ? 0 : 5) * this.scaleFact
        )
        .setScale(
          this.scaleFact * (Global.lastOrientation == 'portrait' ? 1.1 : 0.75)
        );

    const mixedLeftPos = (this.mixedBtn.x / this.c_w) * 100;

    document.querySelector('#mixed_options').style.left = `${mixedLeftPos}%`;

    //(Global.lastOrientation == 'portrait' ? 400 : 300) * this.scaleFact

    this.toggleInfoIcon &&
      this.toggleInfoIcon
        .setPosition(
          this.mixedBtn.x +
            this.mixedBtn.width * this.mixedBtn.scaleX * 0.5 +
            20 * this.scaleFact,
          this.mixedBtn.y - this.mixedBtn.height * this.mixedBtn.scaleX * 0.5
        )
        .setScale(
          this.scaleFact * (Global.lastOrientation == 'portrait' ? 1 : 0.6)
        );

    /* this.skipHintBGActive && */ this.hideInfo &&
      this.hideInfo
        .setPosition(this.hideCheck.x + 85 * this.scaleFact, this.hideCheck.y)
        .setFontSize(40 * this.scaleFact)
        .setWordWrapWidth(1000 * this.scaleFact);
  }
}
