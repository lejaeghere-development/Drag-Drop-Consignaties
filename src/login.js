import { loginCheck } from './objects/api';
import { Global } from './objects/global';
import './login.scss';

let emailField;
let passwordField;

let emailError = false;
let passwordError = false;


let registerBtn;
let loginBtn;
let loginActive = false;

let isValid = false;

window.onload = function () {
    document.body.classList.add("active");
    emailField = document.querySelector("#email");
    passwordField = document.querySelector("#password");

    registerBtn = document.querySelector("#registerBtn");
    loginBtn = document.querySelector("#loginBtn");

    loginBtn.addEventListener("click", doLogin);
    registerBtn.addEventListener("click", () => {
        location.href= './register.php';
    });
    document.querySelector("#forgot_password").addEventListener("click", () => {
        location.href= './forgotPassword.php';
    })
}


async function doLogin() {
    if (loginActive || !checkIfValid()) return false;

    loginActive= true;
    let email= emailField.value.trim();
    let password= passwordField.value.trim();
    
    let loginData= await loginCheck(email,password);
    console.log(loginData,'loginData');
    loginActive= false;
    if(loginData['message'] == 'Success'){
        // localStorage.setItem('uuid', loginData['uuid'])
        location.href='./index.php';
    }else{
        if(loginData['message'] == 'IPassword'){
            Global.showInfo('ongeldig wachtwoord');
        }
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

    if ((passwordField.value.trim().length ==0)) {
        isValid = false;
        passwordError = true;
    }

    if(emailError){
        Global.showInfo("Ongeldig e-mail");
    }else if(passwordError){
        Global.showInfo('ongeldig wachtwoord');
    }

    return isValid;
}