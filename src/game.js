import "phaser";

import Loader from "./scenes/Loader";
import PreLoader from "./scenes/Preloader";
import Game from "./scenes/Game";

import { isMobile, isMobileOnly } from "mobile-device-detect";
import "./style.scss";
import { Global } from "./objects/global";
var isIOS = getMobileOperatingSystem() == "iOS";

import { createUser, sendEmail } from "./objects/api";
import { uuid } from "uuidv4";
Global.dpr= Math.min(window.devicePixelRatio, 1.75);
let DEFAULT_WIDTH = 2208*Global.dpr;
let DEFAULT_HEIGHT = 1242*Global.dpr;

2
Global.isMobile = isMobile;
if(!isMobile){
    Global.viewMode= "landscape"
}

let isFirefox = navigator.userAgent.indexOf("Firefox") != -1;



const config = {
    fullscreenTarget: document.getElementById("game-sec"),
    type: isFirefox && !isIOS ? Phaser.AUTO : Phaser.AUTO,
    transparent: true,
    antialias:true,
    scale: {
        parent: "game-sec",
        mode: Global.isMobile || Global.desktop_orientation == "landscape" ?
            Phaser.Scale.ENVELOP :
            Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    dom: {
        createContainer: false,
    },
    scene: [
        PreLoader, 
        Loader, 
        Game
    ]
};

window.addEventListener("load", async () => {
    if(window.userConfig.length>0){
        let userConfig= JSON.parse(window.userConfig.replace(/&quot;/g, '"'));
        if(Object.keys(userConfig).length>0){
            Global.defaultCrateExists=true;
        }
    }

    localStorage.setItem('uuid', uuid());

    // await sendEmail('saif', 'saifulkanneth@gmail.com', '123', 'hello', window.location.href)
    // let response= await createUser();

    startGame();
});

function startGame() {
    Global.debug= getUrlParameter("debug") || false;
    const game = new Phaser.Game(config);
}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
    return "unknown";
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
