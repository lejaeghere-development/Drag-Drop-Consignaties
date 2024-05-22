var Global = {
    isMobile: false,
    gameTry: 0,
    bgMusic: null,
    isMute: false,
    dpr:1,
    desktop_orientation: null,
    scoreTotal: 0,
    gameStarted:false,
    selectedBottleType:null,
    viewMode:"landscape",
    totalBottles: 0, 
    formInitiated:false,
    cratesCreated:0,
    bottleOnCrate:false,
    crateActivated:false,
    registered:false,
    crateData:null,
    points:100,
    crateType: null,
    extraDepth: 5000,
    snapCnt:0,
    canDispose:false,
    extraCrate:null,
    errorTO:null,
    rackInfoToSave:[],
    defaultCrateExists:false,
    crateCanBeDragged:false,
    dataToSent:{
        "username": "",
        "email": "",
        "mobile": "",
        "score":"",
    },
    showInfo:function(errorTxt){
        Global.errorTO && clearTimeout(Global.errorTO);
        document.querySelector(".error").classList.add("active");
        document.querySelector(".error").innerHTML= errorTxt;
        Global.errorTO= setTimeout(() => {
            document.querySelector(".error").classList.remove("active");
        }, 2000)
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