import { Global } from "./global";
import { setScaleFactor } from "./scale_factor";

export class AppLoader extends Phaser.GameObjects.Group {
  constructor(scene) {
    super(scene);

    this.loaderLogoAdded = false;
  }
  init(_url, loaderFont) {
    setScaleFactor.call(this, false);

    document.body.style.backgroundColor = "#212121";
    this.loaderBG = this.scene.add.graphics();
    this.loaderBase = this.scene.add.graphics();
    this.loaderPath = this.scene.add.graphics();
    this.loaderCover = this.scene.add.graphics();

    this.loaderBase.fillStyle(0xffffff, 0.2);
    this.loaderCover.fillStyle(0xffffff, 1);
    this.loaderPath.fillStyle(0xffffff, 1);
    this.loaderBG.fillStyle(0xffffff, 1);

    this.add(this.loaderBG);
    this.add(this.loaderBase);
    this.add(this.loaderPath);
    this.add(this.loaderCover);

    this.loaderPath.setPosition(
      this.scene.game.canvas.width * 0.5,
      this.scene.game.canvas.height * 0.5 * 1.4 + 50
    );
    this.loaderBase.setPosition(
      this.scene.game.canvas.width * 0.5,
      this.scene.game.canvas.height * 0.5 * 1.4 + 50
    );
    this.loaderCover.setPosition(
      this.scene.game.canvas.width * 0.5,
      this.scene.game.canvas.height * 0.5 * 1.4 + 50
    );

    this.loaderBase.fillCircle(
      0,
      0,
      30 *
        2 *
        (Global.gameVersion == "Offline" && Global.deviceType == "screen"
          ? 0.5
          : 1)
    );
    this.loaderCover.fillCircle(
      0,
      0,
      20 *
        2 *
        (Global.gameVersion == "Offline" && Global.deviceType == "screen"
          ? 0.5
          : 1)
    );
    this.loaderPath.fillStyle(0xFBDE42, 1);
    this.loaderBG.fillRect(
      0,
      0,
      this.scene.game.canvas.width,
      this.scene.game.canvas.height
    );

    this.loaderPath.fillCircle(0, 0, 30 * 2); //, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(-100), true);

    for (var i = 0; i <= 50; i++) {
      this.loaderPath.fillStyle(0xffffff, 1 - (1 * i) / 50);
      this.loaderPath.beginPath();
      this.loaderPath.slice(
        0,
        0,
        30 *
          2 *
          (Global.gameVersion == "Offline" && Global.deviceType == "screen"
            ? 0.5
            : 1),
        Phaser.Math.DegToRad(-100 - 7 * i),
        Phaser.Math.DegToRad(-100 - 7 * (i + 1)),
        true,
        true
      );
      this.loaderPath.fillPath();
    }
    this.rotateLoader();
    this.loadLogo(_url);

    this.loadPer = this.scene.make
      .text({
        x: this.c_w * 0.5,
        y: this.c_h * 0.5 * 1.4 + 250 * this.scaleFact,
        text: "0%",
        origin: {
          x: 0.5,
          y: 0.5,
        },
        style: {
          font: Global.isMobile
            ? "" +
              String(((15 * this.scaleFact) / 0.5) * (Global.dpr || 1)) +
              `px ${loaderFont}`
            : "" +
              String(((15 * this.scaleFact) / 0.5) * (Global.dpr || 1)) +
              `px ${loaderFont}`,
          fill: "#777777",
          align: "center",
        },
      })
      .setDepth(100);

    this.add(this.loadPer);

    this.scene.load.on("progress", this.onLoadProgress.bind(this));
  }
  onLoadProgress(p) {
    if (isNaN(p)) return false;

    this.loadPer.setText(`${Math.floor(p * 100)}%`);
  }
  rotateLoader() {
    this.scene.tweens.add({
      targets: this.loaderPath,
      angle: 360,
      duration: 1100,
      ease: "Linear",
      easeParams: [3.5],
      delay: 0,
      loop: -1,
      onComplete: this.rotateLoader.bind(this),
    });
  }
  loadLogo(_url) {
    this.scene.load.image("loader-logo", _url);
    this.scene.load.on(
      "complete",
      this.checkLoaderLogoStat.bind(this, "loader-logo")
    );
    this.scene.load.start();
  }
  checkLoaderLogoStat(_key) {
    console.log("Load Complete Sub");
    if (this.scene.textures.get(_key).key == _key && !this.loaderLogoAdded) {
      console.log("Load Complete Sub2");
      this.loaderLogoAdded = true;
      this.addLoaderLogo(_key);
    }
  }
  addLoaderLogo(_key) {
    this.loaderLogo = this.scene.add.image(0, 0, _key);
    this.loaderLogo.setScale(1.4 * Global.dpr);
    this.loaderLogo.x = this.scene.game.canvas.width * 0.5;
    this.loaderLogo.y = this.scene.game.canvas.height * 0.55;
    this.add(this.loaderLogo);

    setTimeout(
      function () {
        this.scene.tweens.add({
          targets: this.loaderLogo,
          y: this.loaderLogo.y - this.loaderLogo.height * 0.25,
          duration: 500,
          alpha: 1,
          ease: "Cubic.Out",
          easeParams: [3.5],
          delay: 0,
        });
      }.bind(this),
      0
    );
  }
  dispose() {
    if (this.rotateTween) this.rotateTween._destroy();
    if (this.loaderLogo) this.loaderLogo.mask = null;
  }
}
