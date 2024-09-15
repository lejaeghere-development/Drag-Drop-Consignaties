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





Global.isMobile = isMobile;
if(!isMobile){
    Global.viewMode= "landscape"
}

let isFirefox = navigator.userAgent.indexOf("Firefox") != -1;
let DEFAULT_WIDTH = 1242*Global.dpr;
let DEFAULT_HEIGHT = 2208*Global.dpr;


const config = {
    fullscreenTarget: document.getElementById("game-sec"),
    type: isFirefox && !isIOS ? Phaser.AUTO : Phaser.CANVAS,
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
    if(!window.isLoggedIn){
        localStorage.setItem('uuid', uuid())
    }
    startGame();
    return false;   
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
    window.addressSelected='';
    const mediaQuery = '(max-width: 1024px) and (max-aspect-ratio: 13/10)';
    const mqList = window.matchMedia(mediaQuery);
    console.log(mqList,'mqList')
    if(mqList.matches){
        Global.dpr= 1;//Math.min(window.devicePixelRatio, 1.75);
        Global.lastOrientation = 'portrait';
        DEFAULT_WIDTH = 1242*Global.dpr;
        DEFAULT_HEIGHT = 2208*Global.dpr;
    }else{
        Global.dpr= Math.min(window.devicePixelRatio, 1.75);
        Global.lastOrientation = 'landscape';
        DEFAULT_WIDTH = 2208*Global.dpr;
        DEFAULT_HEIGHT = 1242*Global.dpr;
    }
    config.scale.width=DEFAULT_WIDTH;
    config.scale.height=DEFAULT_HEIGHT;
    
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
