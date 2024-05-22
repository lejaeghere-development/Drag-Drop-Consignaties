import { registerCheck } from './objects/api';
import { Global } from './objects/global';
import './register.scss';
import {
    uuid
} from "uuidv4";

let nameField;
let emailField;
let mobileField;
let passwordField;

let nameError = false;
let emailError = false;
let mobileError = false;
let passwordError = false;


let registerBtn;
let loginBtn;
let registerActive = false;

let isValid = false;

window.onload = function () {
    document.body.classList.add("active");
    localStorage.setItem('uuid', uuid())

    nameField = document.querySelector("#username");
    emailField = document.querySelector("#email");
    mobileField = document.querySelector("#mobile");
    passwordField = document.querySelector("#password");

    registerBtn = document.querySelector("#registerBtn");
    loginBtn = document.querySelector("#loginBtn");
    loginBtn.addEventListener("click", () => {
        location.href= './login.php';
    });

    registerBtn.addEventListener("click", doRegister);
}


async function doRegister() {
    if (registerActive || !checkIfValid()) return false;

    registerActive= true;
    let username= nameField.value.trim();
    let email= emailField.value.trim();
    let mobile= mobileField.value.trim();
    let password= passwordField.value.trim();
    
    let registerData= await registerCheck(username, email, mobile, password);
    console.log(registerData['message'],'registerData');
    registerActive= false;
    if(registerData['message'] == 'Success'){
        location.href='./index.php';
    }else{
        if(registerData['message'] == 'dEmail'){
            Global.showInfo('Gebruiker bestaat met dezelfde e-mail-ID');
        }
        if(registerData['message'] == 'dUser'){
            Global.showInfo('Gebruiker bestaat met dezelfde gebruikersnaam');
        }
    }
}

function checkIfValid() {
    isValid = true;
    nameError = false;
    emailError = false;
    mobileError = false;
    passwordError = false;

    if (nameField.value.trim().length == 0) {
        isValid = false;
        nameError = true;
    }

    if (emailField.value.trim().length == 0) {
        isValid = false;
        emailError = true;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailField.value.trim()))) {
        isValid = false;
        emailError = true;
    }
    if ((mobileField.value.trim().length == 0 || isNaN(mobileField.value.trim()))) {
        isValid = false;
        mobileError = true;
    }
    if ((passwordField.value.trim().length ==0)) {
        isValid = false;
        passwordError = true;
    }

    if(nameError){
        Global.showInfo("Ongeldige naam");
    }else if(emailError){
        Global.showInfo('Ongeldig e-mail');
    }else if(mobileError){
        Global.showInfo('Ongeldig telefoonnummer');
    }else if(passwordError){
        Global.showInfo('ongeldig wachtwoord');
    }

    return isValid;
}