import { sendEmail } from './api';
import EventEmitter from './event-emitter';
import { Global } from './global';
import { setScaleFactor } from './scale_factor';

export default class Register extends Phaser.GameObjects.Group {
  constructor(game) {
    super(game);

    if (!Global.formInitiated) {
      Global.formInitiated = true;
      document.querySelector('.user_submit').addEventListener('click', () => {
        this.onSubmit();
      });
      let inputs = document.querySelectorAll('.user_form input');
      inputs.forEach((input) => {
        input.addEventListener('keyup', () => {
          this.validateData(false);
        });
      });
      document
        .querySelector('.user_form .back')
        .addEventListener('click', () => {
          document.querySelector('.form_bg').classList.remove('active');
          document.querySelector('.user_form').classList.remove('active');

          Global.emitter.emit('game:show');
          Global.emitter.emit('popup_update', false);
          // Global.emitter.emit(
          //   'crate:select',
          //   Global.totalBottles != 0 ? Global.totalBottles : 24,
          //   'fixed',
          //   true
          // );
        });
    }
  }
  setUp() {
    setScaleFactor.call(this, false);
    this.emitter = EventEmitter.getObj();

    Global.emitter.on('game:show_register', this.showRegister.bind(this));
    // Global.emitter.on('game:skip', this.showRegister.bind(this));
    Global.emitter = this.emitter;
    this.registerActive = true;
  }
  init() {}
  showRegister() {
    if (window.isLoggedIn) {
      document.querySelector('.user_form #name') != null &&
        document.querySelector('#name').remove();
      document.querySelector('.user_form #email') != null &&
        document.querySelector('#email').remove();
      document.querySelector('.user_form #mobile') != null &&
        document.querySelector('#mobile').remove();
      // document.querySelector(".user_form #comments")!=null && document.querySelector("#comments").remove();
      document.querySelector('.user_form #address') != null &&
        document.querySelector('#address').remove();
      document.querySelector('.user_form #vat') != null &&
        document.querySelector('#vat').remove();
    } else {
      // document.querySelector(".user_form #name")!=null && document.querySelector("#name").remove();
      // document.querySelector(".user_form #mobile")!=null && document.querySelector("#mobile").remove();
    }

    document.querySelector('.form_bg').classList.add('active');
    document.querySelector('.user_form').classList.add('active');

    document.querySelector('.user_form #name') &&
      document.querySelector('.user_form #name').classList.remove('error');
    document.querySelector('.user_form #email') &&
      document.querySelector('.user_form #email').classList.remove('error');
    document.querySelector('.user_form #mobile') &&
      document.querySelector('.user_form #mobile').classList.remove('error');
    document.querySelector('.user_form #comments') &&
      document.querySelector('.user_form #comments').classList.remove('error');
    document.querySelector('.user_form #vat') &&
      document.querySelector('.user_form #vat').classList.remove('error');
    document.querySelector('.user_form #address') &&
      document.querySelector('.user_form #address').classList.remove('error');

    document.querySelector('.user_form #name') &&
      (document.querySelector('.user_form #name').value = '');
    document.querySelector('.user_form #email') &&
      (document.querySelector('.user_form #email').value = '');
    document.querySelector('.user_form #mobile') &&
      (document.querySelector('.user_form #mobile').value = '');
    document.querySelector('.user_form #comments') &&
      (document.querySelector('.user_form #comments').value = '');
    document.querySelector('.user_form #address') &&
      (document.querySelector('.user_form #address').value = '');
    document.querySelector('.user_form #vat') &&
      (document.querySelector('.user_form #vat').value = '');

    this.registerActive = true;
    /* if(window.isLoggedIn){
            document.querySelector("#address").value=window.address;
            document.querySelector("#vat").value=window.vat;
           
            // document.querySelector("#comments").value=window.comments;
            // this.onSubmit();
        } */

    /* if(!Global.registered){
            document.querySelector(".user_form").classList.add("active")
            this.registerActive=true;
        }else{
            Global.emitter.emit('score:show');
        } */
  }
  onSubmit() {
    this.validateData(true);
  }
  validateData(shouldValidate) {
    if (!this.registerActive) return false;

    let isValid = true;
    this.username =
      document.querySelector('.user_form #name') != null
        ? document.querySelector('.user_form #name').value.trim()
        : window.username;
    this.email =
      document.querySelector('.user_form #email') != null
        ? document.querySelector('.user_form #email').value.trim()
        : window.email;
    this.mobile =
      document.querySelector('.user_form #mobile') != null
        ? document.querySelector('.user_form #mobile').value.trim()
        : window.mobile;
    this.comments =
      document.querySelector('.user_form #comments') != null
        ? document.querySelector('.user_form #comments').value.trim()
        : window.comments;
    this.address =
      document.querySelector('.user_form #address') != null
        ? document.querySelector('.user_form #address').value.trim()
        : window.addressSelected;
    this.vat =
      document.querySelector('.user_form #vat') != null
        ? document.querySelector('.user_form #vat').value.trim()
        : window.vat;

    if (
      this.username.length == 0 &&
      shouldValidate &&
      document.querySelector('.user_form #name') != null
    ) {
      document.querySelector('.user_form #name').classList.add('error');
      isValid = false;
    } else if (
      this.username.length != 0 &&
      document.querySelector('.user_form #name') != null
    ) {
      document.querySelector('.user_form #name').classList.remove('error');
    }
    if (
      this.email.length == 0 &&
      shouldValidate &&
      document.querySelector('.user_form #email') != null
    ) {
      document.querySelector('.user_form #email').classList.add('error');
      isValid = false;
    }
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) &&
      shouldValidate &&
      document.querySelector('.user_form #email') != null
    ) {
      document.querySelector('.user_form #email').classList.add('error');
      isValid = false;
    } else if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) &&
      document.querySelector('.user_form #email') != null
    ) {
      document.querySelector('.user_form #email').classList.remove('error');
    }

    if (
      (this.mobile.length == 0 || isNaN(this.mobile)) &&
      shouldValidate &&
      document.querySelector('.user_form #mobile') != null
    ) {
      document.querySelector('.user_form #mobile').classList.add('error');
      isValid = false;
    } else if (
      this.mobile.length !== 0 &&
      !isNaN(this.mobile) &&
      document.querySelector('.user_form #mobile') != null
    ) {
      document.querySelector('.user_form #mobile').classList.remove('error');
    }

    if (
      this.address.length == 0 &&
      shouldValidate &&
      document.querySelector('.user_form #address') != null
    ) {
      document.querySelector('.user_form #address').classList.add('error');
      isValid = false;
    } else if (
      this.comments.length !== 0 &&
      document.querySelector('.user_form #address') != null
    ) {
      document.querySelector('.user_form #address').classList.remove('error');
    }

    /* if ((this.comments.length == 0) && shouldValidate && document.querySelector(".user_form #comments")!=null) {
            document.querySelector(".user_form #comments").classList.add("error");
            isValid = false;
        } else if ((this.comments.length !== 0) && document.querySelector(".user_form #comments")!=null) {
            document.querySelector(".user_form #comments").classList.remove("error")
        } */

    if (isValid && shouldValidate) {
      // Global.clickAudio.play();
      this.onDataSent();
      /*  this.onEmailVerify(JSON.stringify({
                 'code':0
             })); */
    }
  }

  async onDataSent() {
    if (!window.isLoggedIn) {
      Global.dataToSent['username'] = this.username;
      Global.dataToSent['email'] = this.email;
      Global.dataToSent['mobile'] = this.mobile;
      Global.dataToSent['comments'] = this.comments;
    }

    let combination = {};
    Object.keys(Global.crateData).forEach((key) => {
      combination[key] = Global.crateData[key]['filledBottles'];
    });
    console.log(JSON.stringify(combination), 'JSON.stringify(combination)');
    // Global.dataToSent['comments'] = this.comments;
    Global.dataToSent['vat'] = this.vat;
    Global.dataToSent['address'] = this.address;
    Global.dataToSent['comments'] = this.comments;

    Global.dataToSent['combination'] = JSON.stringify(combination);
    Global.dataToSent['rack1Visible'] = window.rack1Visible ? 1 : 0;

    Global.registered = true;
    document.querySelector('.form_bg').classList.remove('active');
    document.querySelector('.user_form').classList.remove('active');

    Global.emitter.emit('score:show');
    Global.emitter.emit('popup_update', true);
    await sendEmail(
      this.username,
      this.email,
      this.mobile,
      this.comments,
      this.vat,
      this.address,
      window.location.href
    );
  }
}
//
