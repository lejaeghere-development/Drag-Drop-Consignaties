import {
  Global
} from "./global";

function setScaleFactor(isRoot) {
  let dimenson = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  let c_w, c_h;
  if (isRoot) {
    c_w = this.game.canvas.width;
    c_h = this.game.canvas.height;
    this.c_w = this.game.canvas.width;
    this.c_h = this.game.canvas.height;
  } else {
    c_w = this.scene.game.canvas.width;
    c_h = this.scene.game.canvas.height;
    this.c_w = this.scene.game.canvas.width;
    this.c_h = this.scene.game.canvas.height;
  }
  this.extraTop =
    (Math.abs(
        parseFloat(document.getElementsByTagName("canvas")[0].style.marginTop)
      ) /
      dimenson.width) *
    c_w +
    (Global.isIphone ? 130 : 0);
  this.extraLeftPer =
    (Math.abs(
        parseFloat(document.getElementsByTagName("canvas")[0].style.marginLeft)
      ) /
      dimenson.height) *
    c_h;
  this.scaleFact =
    (window.innerHeight / (window.innerWidth + this.extraLeftPer * 2.25)) * 0.85 * Global.dpr; //window.innerWidth
  this.moveSteps = 0;

  if (!Global.isMobile && Global.desktop_orientation == "portrait") {
    this.extraLeftPer = 0;
    this.extraTop = 0;
    this.scaleFact = 1.4;
  }
}

export {
  setScaleFactor
};