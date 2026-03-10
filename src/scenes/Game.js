import { type } from 'jquery';
import Bin from '../objects/Bin';
import Bottles from '../objects/Bottles';
import Crates from '../objects/Crate';
import Crate from '../objects/Crate';
import Header from '../objects/Header';
import Intro from '../objects/Intro';
import Rack from '../objects/Rack';
import Register from '../objects/Register';
import Score from '../objects/Score';
import SearchBox from '../objects/SearchBox';
import { getAddresBasedCombination, saveImage } from '../objects/api';
import EventEmitter from '../objects/event-emitter';
import { Global } from '../objects/global';
import { setScaleFactor } from '../objects/scale_factor';
import Hint from '../objects/Hint';

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: 'Game',
    });

    document
      .querySelector('.mobile_menu_close')
      .addEventListener('click', (v) => {
        v.preventDefault();
        v.stopImmediatePropagation();
        Global.popupActive = false;
        document.querySelector('.mobile_menu').classList.remove('active');
      });
    if (!window.isLoggedIn) {
      document.querySelector('#logoutBtn') &&
        document.querySelector('#logoutBtn').remove();
      document.querySelector('#changeAddress') &&
        document.querySelector('#changeAddress').remove();
    }
    document
      .querySelector('#crate_info #cancel')
      .addEventListener('click', (v) => {
        v.preventDefault();
        v.stopImmediatePropagation();
        this.hideCrateInfo();
      });
    // document
    //   .querySelector('#toggle_info #toggle_cancel')
    //   .addEventListener('click', (v) => {
    //     v.preventDefault();
    //     v.stopImmediatePropagation();
    //     this.hideToggleInfo();
    //   });
    document
      .querySelector('#crate_info2 #cancel')
      .addEventListener('click', (v) => {
        v.preventDefault();
        v.stopImmediatePropagation();
        this.hideCrateInfo2();
      });
    document
      .querySelector('#confirm_address')
      .addEventListener('click', (v) => {
        v.preventDefault();
        v.stopImmediatePropagation();
        this.saveAddress();
      });
    document.querySelector('#skipBtn') &&
      document.querySelector('#skipBtn').addEventListener('click', (v) => {
        v.preventDefault();
        v.stopImmediatePropagation();
        Global.popupActive = false;
        if (Global.isEmptyRemains) {
          Global.emitter.emit('trigger_skip');
        } else {
          Global.emitter.emit('header:show_ready_info');
        }
        // Global.emitter.emit('trigger_skip');
        // Global.emitter.emit('header:show_ready_info');
        document.querySelector('.mobile_menu').classList.remove('active');
      });
    document.querySelector('#logoutBtn') &&
      document.querySelector('#logoutBtn').addEventListener('click', (v) => {
        v.preventDefault();
        v.stopImmediatePropagation();
        Global.popupActive = false;
        Global.emitter.emit('trigger_confirm_logout');
        document.querySelector('.mobile_menu').classList.remove('active');
      });
    document.querySelector('#changeAddress') &&
      document
        .querySelector('#changeAddress')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          Global.popupActive = false;
          Global.emitter.emit('trigger_change_address');
          document.querySelector('.mobile_menu').classList.remove('active');
        });

    document.querySelector('.mobile_skip_check') &&
      document
        .querySelector('.mobile_skip_check')
        .addEventListener('click', (v) => {
          v.preventDefault();
          v.stopImmediatePropagation();
          Global.emitter.emit('update_hide_checked');
        });
    document.querySelector('#hideBtn') &&
      document.querySelector('#hideBtn').addEventListener('click', (v) => {
        v.preventDefault();
        v.stopImmediatePropagation();
        Global.emitter.emit('skip_hint_close');
      });

    this.onResize = this.onResize.bind(this);
  }
  preload() {}
  init() {}
  create() {
    this.resizeTO = null;
    setScaleFactor.call(this, true);
    this.emitter = EventEmitter.getObj();
    Global.emitter.on('address:pick_new', this.replayGame.bind(this));
    Global.emitter.on('game:replay', this.replayGame.bind(this));
    Global.emitter.on('game:skip', this.calculateScore.bind(this));
    Global.emitter.on('crate_info:show', this.showCrateInfo.bind(this));
    Global.emitter.on('crate_info:hide', this.hideCrateInfo.bind(this));
    Global.emitter.on('toggle_info:show', this.showToggleInfo.bind(this));
    Global.emitter.on('toggle_info:hide', this.hideToggleInfo.bind(this));
    Global.emitter.on('crate_info2:show', this.showCrateInfo2.bind(this));
    Global.emitter.on('crate_info2:hide', this.hideCrateInfo2.bind(this));
    Global.emitter.on('popup_update', this.updatePopupStatus.bind(this));
    Global.emitter.on('repeat:show', this.showRepeat.bind(this));
    Global.emitter.on('repeat:hide', this.hideRepeat.bind(this));
    Global.emitter.on('mixed:update_set', this.updateMixedListView.bind(this));
    this.BGGr = this.add.graphics();
    this.BGGr.fillStyle(0xffffff, 1.0);
    this.BGGr.fillRect(0, 0, this.c_w, this.c_h);

    /*   this.BG= this.add.image(this.c_w*.5, this.extraTop + 300*this.scaleFact, 'BG')
        .setOrigin(0.5, 0)
        .setScale((this.c_w-this.extraLeftPer)*.00025); */

    this.header = new Header(this);
    this.header.setUp();
    this.header.init();

    // this.bin = new Bin(this);
    // this.bin.setUp();
    // this.bin.init();

    this.intro = new Intro(this);
    this.intro.setUp();
    this.intro.init();

    this.searchBox = new SearchBox(this);
    this.searchBox.setUp();
    this.searchBox.init();

    this.crates = new Crates(this);
    this.crates.setUp();
    this.crates.init();

    this.bottles = new Bottles(this);
    this.bottles.setUp();
    this.bottles.init();

    this.register = new Register(this);
    this.register.setUp();
    this.register.init();

    this.score = new Score(this);
    this.score.setUp();
    this.score.init();

    this.hint = new Hint(this);
    this.hint.setUp();
    this.hint.init();

    //
    //

    this.scale.on('resize', this.onResize);
    this.onResize();
    /* setTimeout(() => {
            Global.emitter.emit('game:skip');
        }, 1000) */

    // Global.emitter.emit('game:skip');

    /* setTimeout(() => {
            Global.emitter.emit('game:skip');
        }, 2000) */

    // Global.emitter.emit('game:skip');

    if (
      typeof window.address == 'string' /*  ||
      (typeof window.address == 'object' && window.address.length == 0) */
    ) {
      this.addRacks();
      window.address = '';
      Global.emitter.emit('crate_selection:enable');
      Global.emitter.emit('crate_selection:hide');
      this.setRackDefaultVal();
      this.resetRackDefaultVal();
      // setTimeout(() => {
      //     Global.emitter.emit('crate:add_crate');
      // }, 250);
    } else {
      if (Object.keys(window.address).length == 0) {
        this.addRacks();
        window.address = '';
        Global.emitter.emit('crate_selection:enable');
        Global.emitter.emit('crate_selection:hide');
        this.setRackDefaultVal();
        this.resetRackDefaultVal();

        // setTimeout(() => {
        //     Global.emitter.emit('crate:add_crate');
        // }, 250);
      } else {
        this.setRackDefaultVal();
        setTimeout(this.showAddressSelection.bind(this), 250);
      }
    }

    // Global.emitter.emit('score:show');
    // this.register.showRegister();

    // setTimeout(() => {
    //   // this.captureLongScreenshot();
    //   this.calculateScore();
    // }, 5000);
    // console.log(this, 'widthhhhhh!!!');

    this.repeatBtn = this.add
      .image(
        Global.lastOrientation == 'portrait'
          ? this.c_w * 0.5
          : this.extraLeftPer + this.extraTop / 4 + 890 * this.scaleFact,
        this.c_h - this.extraTop - 400 * this.scaleFact,
        'items',
        `repeatBtn0000`
      )
      .setInteractive({
        cursor: 'pointer',
      })
      .setDepth(1500)
      .setScale(this.scaleFact * 1.0)
      .setVisible(false)
      .on(
        'pointerover',
        this.onHover.bind(this, 'repeatBtn', 'repeatBtn_10000')
      )
      .on('pointerout', this.onHover.bind(this, 'repeatBtn', 'repeatBtn0000'))
      .on('pointerdown', this.onRepeat.bind(this));
  }
  addRacks() {
    this.rack = new Rack(this);
    this.rack.setUp();
    this.rack.init();
    this.onResize();
  }
  onRepeat(v) {
    if (Global.suggestionElement != null) {
      Global.emitter.emit(
        'item:repeat_set',
        Global.suggestionElement,
        Global.lastSetToRepeat
      );
    }
  }
  onHover(key, frame) {
    this[key].setFrame(frame);
  }
  async captureLongScreenshot() {
    const {
      startX = 0,
      startY = 0,
      captureWidth = 3000,
      captureHeight = this.c_h,
      format = 'image/jpeg',
      quality = 0.5,
    } = {};

    const parts = [];
    Global.emitter.emit('rack:reset');
    // return false;
    // Set startX/startY/endY based on orientation
    if (Global.lastOrientation === 'portrait') {
      this.startX = this.extraLeftPer;
      this.startY = this.c_h * 0.5 - 1000 * this.scaleFact;
      this.endY = this.c_h * 0.5 + 0 * this.scaleFact;
    } else {
      this.startX =
        this.c_w -
        this.extraLeftPer -
        this.extraTop -
        (1340 + 600 + 1300) * this.scaleFact;
      this.startY = this.extraTop + 300 * this.scaleFact;
      this.endY = this.c_h - this.extraTop - 300 * this.scaleFact;
    }
    await new Promise((resolve) =>
      this.time.delayedCall(window.racks * 100, resolve)
    );
    // Loop to take multiple horizontal snapshots (e.g., scrolling through racks)
    const snapCount = Math.ceil(window.racks / 2);
    for (let i = 0; i < snapCount; i++) {
      // Wait for animation or layout to settle
      await new Promise((resolve) => this.time.delayedCall(100, resolve));

      // Take snapshot of current view
      await new Promise((resolve, reject) => {
        this.game.renderer.snapshotArea(
          this.startX,
          this.startY,
          this.c_w - this.startX,
          this.endY,
          (image) => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            parts.push(canvas);
            resolve();
          },
          format,
          quality
        );
      });

      if (snapCount > 1) {
        Global.emitter.emit('rack:slide'); // Your own event to move the view
      }
    }

    // Merge all captured canvases side-by-side
    const totalWidth = parts.reduce((sum, canvas) => sum + canvas.width, 0);
    const canvasHeight = parts[0].height || 0;

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = totalWidth;
    finalCanvas.height = canvasHeight;
    const finalCtx = finalCanvas.getContext('2d');

    let offsetX = 0;
    for (const part of parts) {
      finalCtx.drawImage(part, offsetX, 0);
      offsetX += part.width;
    }

    const finalImage = finalCanvas.toDataURL(format, quality);

    return finalImage;
  }
  updateMixedListView(
    forceActionType = null,
    updateBtn = false,
    updateFrame = ''
  ) {
    const _isVisible = document
      .querySelector('#mixed_options')
      .classList.contains('active');
    if (_isVisible) {
      document.querySelector('#mixed_options').classList.remove('active');
    } else {
      document.querySelector('#mixed_options').classList.add('active');
    }

    if (forceActionType != null) {
      if (!forceActionType) {
        document.querySelector('#mixed_options').classList.remove('active');
      } else {
        document.querySelector('#mixed_options').classList.add('active');
      }
    }
    Global.lastCrateCategory = null;
    Global.emitter.emit('mixed:update_btn_label', updateBtn, updateFrame);
  }
  showRepeat() {
    this.repeatBtn && this.repeatBtn.setVisible(true);
  }
  hideRepeat() {
    this.repeatBtn && this.repeatBtn.setVisible(false);
  }
  getImageDataURL(image) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    return tempCanvas.toDataURL('image/png');
  }
  onResize() {
    this.resizeTO && clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(() => {
      const mediaQuery = '(max-width: 1024px) and (max-aspect-ratio: 13/10)';
      const mqList = window.matchMedia(mediaQuery);

      // Check if the media query matches

      if (mqList.matches) {
        if (Global.lastOrientation == 'landscape') {
          Global.lastOrientation = 'portrait';
          this.resizeCanvas();
        }
      } else {
        if (Global.lastOrientation == 'portrait') {
          Global.lastOrientation = 'landscape';
          this.resizeCanvas();
        }
      }

      setTimeout(() => {
        Global.emitter.emit('game:resize');
        setScaleFactor.call(this, true);

        this.repeatBtn &&
          this.repeatBtn
            .setPosition(
              Global.lastOrientation == 'portrait'
                ? this.c_w * 0.5
                : this.extraLeftPer +
                    900 * this.scaleFact +
                    this.extraTop * 0.6,
              this.c_h - this.extraTop - 400 * this.scaleFact
            )
            .setScale(
              this.scaleFact * (Global.lastOrientation == 'portrait' ? 1.5 : 1)
            );
      }, 0);
    }, 0);
  }
  resizeCanvas() {
    // Global.dpr= Math.min(window.devicePixelRatio, 1.75);

    let DEFAULT_WIDTH = 0;
    let DEFAULT_HEIGHT = 0;
    if (Global.lastOrientation == 'landscape') {
      Global.dpr = Math.min(window.devicePixelRatio, 1);
      DEFAULT_WIDTH = 2208 * Global.dpr;
      DEFAULT_HEIGHT = 1242 * Global.dpr;
      document.querySelector('.mobile_menu').classList.remove('active2');
      document.querySelector('.mobile_menu').classList.add('active3');
    } else {
      Global.dpr = 1; //Math.min(window.devicePixelRatio, 1.75);
      DEFAULT_WIDTH = 1242 * Global.dpr;
      DEFAULT_HEIGHT = 2208 * Global.dpr;
      document.querySelector('.mobile_menu').classList.add('active2');
      document.querySelector('.mobile_menu').classList.remove('active3');
    }

    this.game.scale.resize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    this.game.scale.setGameSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    // this.game.scale.refresh();
  }
  async saveAddress() {
    let _selectedOpt = document.querySelector(
      'input[name="address_select"]:checked'
    );
    if (!_selectedOpt) {
      document.querySelector('.address_error').classList.add('active');
    } else {
      document.querySelector('.address_error').classList.remove('active');
      let addressID = _selectedOpt.dataset.addressId;
      let _address = `${window.address[addressID]['housenumber']}, ${window.address[addressID]['street']},<br/>${window.address[addressID]['city']}, ${window.address[addressID]['postalcode']}`;
      window.addressSelected = _address;
      // if (window.racks <= window.address[addressID]['racks'])

      // Global.popupActive= false;
      Global.emitter.emit('popup_update', false);
      document.querySelector('.address_sec').classList.remove('active');
      // Global.emitter.emit('crate:add_crate');

      Global.addressID = addressID;
      const res = await getAddresBasedCombination();
      if (res['combination'] != null && res['combination'].length > 0) {
        window.userConfig = res['combination'];
      } else {
        window.userConfig = '';
      }
      if (window.userConfig.length > 0) {
        const decoder = document.createElement('textarea');
        decoder.innerHTML = window.userConfig;
        const decodedString = decoder.value;

        // 2. Parse the clean string into a JSON object
        const inventory = JSON.parse(decodedString);

        // 3. Extract the max index as before
        const keys = Object.keys(inventory);
        const maxRackIndex =
          keys.length > 0
            ? Math.max(
                ...keys.map((key) => {
                  const match = key.match(/rack(\d+)/);
                  return match ? parseInt(match[1], 10) : 0;
                })
              )
            : 0;
        // if (maxRackIndex <= window.address[addressID]['racks']) {
        //   window.racks = window.address[addressID]['racks'];
        // } else {
        //   window.racks = maxRackIndex;
        // }
      }

      window.racks = window.address[addressID]['racks'];

      // window.rack1Visible = parseInt(res['rack1Visible']);
      this.addRacks();
      window.vat = res['vat'];

      Global.dataToSent['addressID'] = addressID;
      Global.emitter.emit('crate_selection:enable');
      Global.emitter.emit('crate_selection:hide');
      this.resetRackDefaultVal();
      setTimeout(() => {
        Global.prevCrateData = JSON.parse(JSON.stringify(Global.crateData));
      }, 700);
    }
  }
  setRackDefaultVal() {
    Global.rackFullInfoShown = true;
  }
  resetRackDefaultVal() {
    setTimeout(() => {
      Global.rackFullInfoShown = false;
    }, 1000);
  }
  showAddressSelection() {
    // Global.popupActive= true;
    Global.emitter.emit('popup_update', true);
    document.querySelector('.address_sec').classList.add('active');

    document.querySelector('.address_sec .content').innerHTML = '';
    Object.keys(window.address).forEach((addressID) => {
      let _address = `${window.address[addressID]['housenumber']}, ${window.address[addressID]['street']}, ${window.address[addressID]['city']}, ${window.address[addressID]['postalcode']}`;
      let _title = window.address[addressID]['title'];
      document.querySelector('.address_sec .content').innerHTML +=
        `<div class="address"> <div class="radio"><input type="radio" name="address_select" id="address_select" data-address-id='${addressID}'></div> <div class="head"> <div class="icon"><img src="./assets/location.png" alt=""></div> <div class="txt">${_title}</div> </div> <div class="info"> ${_address} </div> </div>`;
    });

    document
      .querySelectorAll('.address_sec .content .address')
      .forEach((address) => {
        address.addEventListener(
          'click',
          function (address) {
            address.querySelector('#address_select').click();
          }.bind(this, address)
        );
      });
    if (
      document.querySelectorAll('.address_sec .content .address').length == 1
    ) {
      document
        .querySelector('.address_sec .content .address:nth-child(1)')
        .click();
      document.querySelector('#confirm_address').click();
    }
    //address_sec
  }
  updatePopupStatus(popupActive) {
    Global.popupActive = popupActive;
  }
  showCrateInfo() {
    if (Global.popupActive) return false;

    // Global.popupActive= true;
    Global.emitter.emit('popup_update', true);
    document.querySelector('#crate_info').classList.add('active');
  }
  showCrateInfo2() {
    if (Global.popupActive) return false;

    // Global.popupActive= true;
    Global.emitter.emit('popup_update', true);
    document.querySelector('#crate_info2').classList.add('active');
  }
  hideCrateInfo() {
    // Global.popupActive= false;
    Global.emitter.emit('popup_update', false);
    document.querySelector('#crate_info').classList.remove('active');
  }
  showToggleInfo() {
    if (Global.popupActive) return false;
    Global.emitter.emit('popup_update', true);
    document.querySelector('#toggle_info').classList.add('active');
  }
  hideToggleInfo() {
    Global.emitter.emit('popup_update', false);
    document.querySelector('#toggle_info').classList.remove('active');
  }
  hideCrateInfo2() {
    // Global.popupActive= false;
    Global.emitter.emit('popup_update', false);
    document.querySelector('#crate_info2').classList.remove('active');
  }
  base64ToBlob(base64, mimeType = 'image/jpeg') {
    // 1. Remove the header if it exists (e.g., "data:image/png;base64,")
    const byteString = atob(base64.split(',')[1]);

    // 2. Create an ArrayBuffer to hold the binary data
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    // 3. Convert characters to their 8-bit unsigned integer values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // 4. Return the new Blob
    return new Blob([ab], { type: mimeType });
  }
  calculateScore() {
    let combination = {};
    Object.keys(Global.crateData).forEach((key) => {
      combination[key] = Global.crateData[key]['filledBottles'];
    });

    document.querySelector('.final_loader').classList.add('active');
    setTimeout(async () => {
      Global.scoreTotal = 0;
      Object.keys(Global.crateData).forEach((key) => {
        if (Global.crateData[key]['filledBottles']) {
          Global.scoreTotal +=
            Global.crateData[key]['filledBottles'].length * 60;
        }
      });
      let resizedBase64 = await this.captureLongScreenshot();

      resizedBase64 = this.base64ToBlob(resizedBase64);

      await saveImage(resizedBase64);

      Global.emitter.emit('game:show_register');
      document.querySelector('.final_loader').classList.remove('active');
      // await saveImage(resizedBase64);
      // if (Global.lastOrientation == 'portrait') {
      //   this.startX = this.extraLeftPer; //(this.c_w - this.extraLeftPer - this.extraTop - (1340 + 2200) * this.scaleFact);
      //   this.startY = this.c_h * 0.5 - 1000 * this.scaleFact;
      //   this.endY = this.c_h * 0.5 + 0 * this.scaleFact;
      // } else {
      //   this.startX =
      //     this.c_w -
      //     this.extraLeftPer -
      //     this.extraTop -
      //     (1340 + 600 + 1300) * this.scaleFact;
      //   this.startY = this.extraTop + 300 * this.scaleFact;
      //   this.endY = this.c_h - this.extraTop - 300 * this.scaleFact;
      // }
      // Capture a screenshot of the specified area
      // this.renderer.snapshotArea(
      //   this.startX,
      //   this.startY,
      //   this.c_w - this.startX,
      //   this.endY,
      //   async (image) => {
      //     try {
      //       let snapKey = `snap${++Global.snapCnt}`;

      //       // Create a new canvas texture and draw the image onto it
      //       const snap = this.textures.createCanvas(
      //         snapKey,
      //         image.width,
      //         image.height
      //       );

      //       snap.draw(0, 0, image);

      //       // Convert canvas to base64 image
      //       const base64 = snap.canvas.toDataURL('image/jpeg');

      //       // Create a new image element to load the base64 data
      //       let img = new Image();
      //       img.onload = async function () {
      //         // Create a new canvas for resizing
      //         let canvas = document.createElement('canvas');
      //         canvas.width = image.width;
      //         canvas.height = image.height;
      //         let ctx = canvas.getContext('2d');

      //         // Draw the loaded image onto the new canvas
      //         ctx.drawImage(img, 0, 0, image.width, image.height);

      //         // Convert the resized canvas to base64 data URL
      //         let resizedBase64 = canvas.toDataURL('image/jpeg'); // Change to 'image/png' for PNG format

      //         // console.log(resizedBase64);
      //         // Save the image
      //         await saveImage(resizedBase64);
      //       };

      //       // Handle image loading errors
      //       img.onerror = function (error) {
      //         console.error('Error loading image:', error);
      //       };

      //       // Set the source of the image to the base64 data URL
      //       img.src = base64;
      //     } catch (error) {
      //       console.error('Error processing screenshot:', error);
      //     }
      //   },
      //   'image/jpeg',
      //   0.5
      // );
    }, 250);
  }

  replayGame() {
    // window.address='';
    Global.isIntroFirst = true;

    Global.emitter.emit('emitter:reset');
    EventEmitter.kill();

    this.scale.off('resize', this.onResize);

    setTimeout(() => {
      // this.scene.start("Game");
      location.reload();
    }, 200);
  }
  onCrateSelected() {}
}
