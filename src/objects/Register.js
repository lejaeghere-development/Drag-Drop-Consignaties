import { sendEmail } from "./api";
import EventEmitter from "./event-emitter";
import {
    Global
} from "./global";
import {
    setScaleFactor
} from "./scale_factor";

export default class Register extends Phaser.GameObjects.Group {
    constructor(game) {
        super(game);

        document.querySelector(".user_submit").addEventListener("click", this.onSubmit.bind(this))
        let inputs = document.querySelectorAll(".user_form input");
        inputs.forEach((input) => {
            input.addEventListener("keyup", this.validateData.bind(this, false))
        });
        document.querySelector(".user_form .back").addEventListener("click", () => {
            document.querySelector(".form_bg").classList.remove("active");
            document.querySelector(".user_form").classList.remove("active")
            this.emitter.emit('game:show')
        })
    }
    setUp() {
        setScaleFactor.call(this, false);
        this.emitter = EventEmitter.getObj();
        this.emitter.on('game:skip', this.showRegister.bind(this));
        this.emitter.on('emitter:reset', () => {
            EventEmitter.kill();
        });
    }
    init() {

    }
    showRegister() {
        document.querySelector(".form_bg").classList.add("active");
        document.querySelector(".user_form").classList.add("active");

        document.querySelector(".user_form #name").classList.remove("error");
        document.querySelector(".user_form #email").classList.remove("error");
        document.querySelector(".user_form #mobile").classList.remove("error");
        document.querySelector(".user_form #comments").classList.remove("error");


        document.querySelector(".user_form #name").value = "";
        document.querySelector(".user_form #email").value = "";
        document.querySelector(".user_form #mobile").value = "";
        document.querySelector(".user_form #comments").value = "";
        

        this.registerActive = true;
        /* if(!Global.registered){
            document.querySelector(".user_form").classList.add("active")
            this.registerActive=true;
        }else{
            this.emitter.emit('score:show');
        } */

    }
    onSubmit() {
        this.validateData(true);

    }
    validateData(shouldValidate) {
        if (!this.registerActive) return false;

        let isValid = true;
        this.username = document.querySelector(".user_form #name").value.trim();
        this.email = document.querySelector(".user_form #email").value.trim();
        this.mobile = document.querySelector(".user_form #mobile").value.trim();
        this.comments = document.querySelector(".user_form #comments").value.trim();

        if (this.username.length == 0 && shouldValidate) {
            document.querySelector(".user_form #name").classList.add("error");
            isValid = false;
        } else if (this.username.length != 0) {
            document.querySelector(".user_form #name").classList.remove("error")
        }
        if (this.email.length == 0 && shouldValidate) {
            document.querySelector(".user_form #email").classList.add("error");
            isValid = false;
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) && shouldValidate) {
            document.querySelector(".user_form #email").classList.add("error");
            isValid = false;
        } else if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email))) {
            document.querySelector(".user_form #email").classList.remove("error")
        }


        if ((this.mobile.length == 0 || isNaN(this.mobile)) && shouldValidate) {
            document.querySelector(".user_form #mobile").classList.add("error");
            isValid = false;
        } else if ((this.mobile.length !== 0 && !isNaN(this.mobile))) {
            document.querySelector(".user_form #mobile").classList.remove("error")
        }

        if ((this.comments.length == 0) && shouldValidate) {
            document.querySelector(".user_form #comments").classList.add("error");
            isValid = false;
        } else if ((this.comments.length !== 0)) {
            document.querySelector(".user_form #comments").classList.remove("error")
        }

        if (isValid && shouldValidate) {
            // Global.clickAudio.play();
            this.onDataSent();
            /*  this.onEmailVerify(JSON.stringify({
                 'code':0
             })); */
        }
    }

    async onDataSent() {

        Global.dataToSent['username'] = this.username;
        Global.dataToSent['email'] = this.email;
        Global.dataToSent['mobile'] = this.mobile;
        Global.dataToSent['comments'] = this.comments;

       
        Global.registered = true;
        document.querySelector(".form_bg").classList.remove("active");
        document.querySelector(".user_form").classList.remove("active")

        this.emitter.emit('score:show');
        await sendEmail(this.username, this.email, this.mobile,this.comments, window.location.href);
    }

}
//