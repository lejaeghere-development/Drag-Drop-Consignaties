import { loginCheck, processForgotPassword } from './objects/api';
import { Global } from './objects/global';
import './forgotPassword.scss';

let emailField;
let passwordField;

let emailError = false;
let passwordError = false;


let submit;
let loginActive = false;

let isValid = false;

window.onload = function () {
    document.body.classList.add("active");
    
    emailField = document.querySelector("#email");

    submit = document.querySelector("#submit");

    submit.addEventListener("click", checkForgotPassword);
}


async function checkForgotPassword() {
    if (loginActive || !checkIfValid()) return false;

    loginActive= true;
    let email= emailField.value.trim();
    
    let loginData= await processForgotPassword(email);
    console.log(loginData,'loginData');
    loginActive= false;
    if(loginData['message'] == 'Success'){
        document.querySelector(".field").remove();
        document.querySelector("#submit").remove();
        document.querySelector("#forgot_sec .info").classList.add('active')
        document.querySelector("#forgot_sec .head").remove();

        localStorage.setItem('uuid', loginData['uuid'])
        // location.href='./';
    }else{
        if(loginData['message'] == 'IEmail'){
            Global.showInfo('Ongeldig e-mail');
        }
    }
}

function checkIfValid() {
    isValid = true;
    emailError = false;
    passwordError = false;

    if (emailField.value.trim().length == 0) {
        isValid = false;
        emailError = true;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailField.value.trim()))) {
        isValid = false;
        emailError = true;
    }

    if(emailError){
        Global.showInfo("Ongeldig e-mail");
    }

    return isValid;
}