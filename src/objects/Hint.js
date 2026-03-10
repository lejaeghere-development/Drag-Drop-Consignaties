import EventEmitter from './event-emitter';
import { Global } from './global';
import { setScaleFactor } from './scale_factor';

export default class Hint extends Phaser.GameObjects.Group {
  constructor(game) {
    super(game);
  }
  setUp() {
    setScaleFactor.call(this, false);
    this.emitter = EventEmitter.getObj();
    this.emitter.on('hint:show', this.showHint.bind(this));
    this.emitter.on('hint:hide', this.hideHint.bind(this));
  }
  init() {
    this.hintBG = this.scene.add.graphics();
    this.add(this.hintBG);
    this.hintBG.setDepth(2001);
    this.hintBG.fillStyle(0x000000, 0.75);
    this.hintBG.setVisible(false);
    this.hintBG.fillRect(0, 0, this.c_w, this.c_h);

    this.dragTitle = this.scene.make
      .text({
        x:
          Global.lastOrientation == 'portrait'
            ? this.c_w * 0.5
            : this.extraLeftPer +
              this.extraTop / 4 +
              700 * 1.4 * this.scaleFact,
        y:
          this.c_h * 0.5 -
          (Global.lastOrientation == 'portrait' ? 850 * this.scaleFact : 0),
        text: `Drag the bottle inside the crate`,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        style: {
          font:
            Global.lastOrientation == 'portrait'
              ? '' + String(120 * this.scaleFact) + 'px greycliff-bold'
              : '' + String(65 * this.scaleFact) + 'px greycliff-bold',
          fill: '#ffffff',
          align: 'center',
        },
      })
      .setVisible(false)
      .setDepth(2201);

    this.hand = this.create(
      this.extraLeftPer +
        this.extraTop / 2 +
        (Global.lastOrientation == 'portrait' ? 2200 : 1600) * this.scaleFact,
      this.c_h - this.extraTop - 200 * this.scaleFact,
      'hint',
      'finger10000'
    )
      .setScale(this.scaleFact)
      .setVisible(false)
      .setDepth(6000);
  }
  showHint(data) {
    this.hintTwn1 && this.hintTwn1.remove();
    this.hintTwn2 && this.hintTwn2.remove();

    if (data.type == 'bottle') {
      this.hintBG.setVisible(true);
      this.dragTitle.setVisible(true);
      this.dragTitle.setText('Drag the bottle inside the crate');
      this.hintBG.setDepth(2001);
      this.hand.setVisible(true).setPosition(data.start.x, data.start.y);
      this.hintTwn1 = this.scene.tweens.add({
        targets: this.hand,
        x: data.end.x,
        y: data.end.y,
        ease: Phaser.Math.Easing.Cubic.InOut,
        duration: 1500,
        repeatDelay: 500,
        yoyo: true,
        repeat: -1,
      });
    } else {
      const visibleData = data.items.filter(
        (item) => data.rackIndecsToHide.indexOf(item.getData('rackIndex')) == -1
      );
      if (visibleData.length == 0) return;

      this.hintBG.setVisible(true);
      this.dragTitle.setVisible(true);
      this.hand
        .setVisible(true)
        .setPosition(visibleData[0].x, visibleData[0].y + 40 * this.scaleFact);
      // this.hintTwn1 = this.scene.tweens.add({
      //   targets: this.hand,
      //   y: data.items[0].y,
      //   ease: Phaser.Math.Easing.Cubic.InOut,
      //   duration: 500,
      //   repeatDelay: 500,
      //   repeat: -1,
      // });
      this.hintTwn1 = this.scene.tweens.add({
        targets: this.hand,
        y: visibleData[0].y,
        scale: this.scaleFact * 0.9,
        ease: Phaser.Math.Easing.Back.InOut,
        duration: 500,
        onStart: function () {
          setTimeout(() => {
            this.hand.setFrame('finger20000');
          }, 100);
        }.bind(this),
        repeatDelay: 500,
        yoyo: true,
        repeat: -1,
      });

      this.hintTwn1.on('yoyo', () => {
        this.hand.setFrame('finger10000');
      });

      this.hintTwn1.on('repeat', () => {
        setTimeout(() => {
          this.hand.setFrame('finger20000');
        }, 100);
      });

      this.dragTitle.setText('Click on empty slots to place the crate.');
    }
  }
  hideHint() {
    this.hintTwn && this.hintTwn.remove();
    this.hintBG.setVisible(false);
    this.dragTitle.setVisible(false);
    this.hand.setVisible(false);
  }
}
