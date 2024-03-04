var Global = {
    isMobile: false,
    gameTry: 0,
    bgMusic: null,
    isMute: false,
    dpr:1,
    desktop_orientation: null,
    scoreTotal: 0,
    gameStarted:false,
    viewMode:"landscape",
    totalBottles: 0, 
    cratesCreated:0,
    bottleOnCrate:false,
    crateActivated:false,
    registered:false,
    crateData:null,
    points:100,
    crateType: null,
    extraDepth: 5000,
    canDispose:false,
    extraCrate:null,
    dataToSent:{
        "username": "",
        "email": "",
        "mobile": "",
        "score":"",
    },
    onResize:function(){
        clearTimeout(Global.rotateTO);
        Global.rotateTO=setTimeout(function(){
            window.scrollTo(0,0)
            if(Global.viewMode=="landscape"&&window.innerWidth<window.innerHeight*1.15){
                document.getElementById("rotate").classList.add("active");
            }
            else if(Global.viewMode=="portrait"&&window.innerWidth>window.innerHeight*1.2){
                document.getElementById("rotate").classList.add("active");
            }
            else{
                document.getElementById("rotate").classList.remove("active");
                if(Global.curr_state=="preloader"){
                    Global.curr_state_obj.proceedNext();
                }
            }
        }.bind(this),100)

    }
};
export { Global };