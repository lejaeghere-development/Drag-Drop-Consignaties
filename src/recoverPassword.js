import { dorecoverPassword } from './objects/api';
import { Global } from './objects/global';
import './recoverPassword.scss';

let confirmPasswordField;
let passwordField;

let confirmPasswordError = false;
let passwordError = false;
let mismatchError= false;

let saveBtn;
let loginBtn;
let loginActive = false;

let isValid = false;

window.onload = function () {
    document.body.classList.add("active");
    
    Global.tempCode= getUrlParameter("recoveryCode");

    passwordField = document.querySelector("#password");
    confirmPasswordField = document.querySelector("#confirmPassword");

    saveBtn = document.querySelector("#save");
    loginBtn = document.querySelector("#loginBtn");

    saveBtn.addEventListener("click", recoverPassword);
    loginBtn.addEventListener("click", () => {
        location.href= './login.php'
    });
}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

async function recoverPassword() {
    if (loginActive || !checkIfValid()) return false;

    loginActive= true;
    let password= passwordField.value.trim();
    
    let loginData= await dorecoverPassword(Global.tempCode, password);
    console.log(loginData,'loginData');
    loginActive= false;
    if(loginData['message'] == 'Success'){
        document.querySelectorAll(".field").forEach(field => {
            field.remove();
        });
        document.querySelector("#save").remove();
        document.querySelector("#loginBtn").classList.add('active')
        document.querySelector("#recover_sec .info").classList.add('active')
        document.querySelector("#recover_sec .head").remove();
        location.href='./login.php';
    }else{
        if(loginData['message'] == 'Error'){
            Global.showInfo('Ongeldige gebruiker');
        }
    }
}

function checkIfValid() {
    isValid = true;
    confirmPasswordError = false;
    passwordError = false;
    mismatchError= false;

    if (passwordField.value.trim().length == 0) {
        isValid = false;
        passwordError = true;
    }
    

    if (confirmPasswordField.value.trim().length == 0) {
        isValid = false;
        confirmPasswordError = true;
    }

    if (passwordField.value.trim() !== confirmPasswordField.value.trim()) {
        isValid = false;
        mismatchError = true;
    }

    if(passwordError){
        Global.showInfo("ongeldig wachtwoord");
    }else if(confirmPasswordError){
        Global.showInfo('ongeldig wachtwoord');
    }else if(mismatchError){
        Global.showInfo('Wachtwoord komt niet overeen');
    }

    return isValid;
}