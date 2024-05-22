import axios from "axios";

import {
    Global
} from "./global";
import { uuid } from "uuidv4";

const BASE_URL='./';//'https://www.apexexp.in/Games/Deliveryves/';

let imageName=null;

async function createUser(){
    const res = await axios.post(`${BASE_URL}create.php`, {
        data: window.btoa(JSON.stringify({
            'uuid': localStorage.getItem('uuid'),
            'username': localStorage.getItem('username')
        }))
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return JSON.parse(window.atob(res['data']));
}

async function logout() {
    const res = await axios.get(`${BASE_URL}logout.php`);
}

async function updateData(){
    console.log(Global.dataToSent,'Global.dataToSent',localStorage.getItem('uuid'));
    const res = await axios.post(`${BASE_URL}data.php`, {
        data: window.btoa(JSON.stringify({
            'uuid': localStorage.getItem('uuid'),
            'data': Global.dataToSent
        }))
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return JSON.parse(window.atob(res['data']));
}
async function registerCheck(name, email, mobile, password){
    const res = await axios.post(`${BASE_URL}register_check.php`, {
        data: window.btoa(JSON.stringify({
            'uuid': localStorage.getItem('uuid'),
            'username': name,
            'email': email,
            'mobile': mobile,
            'password': password
        }))
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return JSON.parse(window.atob(res['data']));
}
async function loginCheck(email, password){
    const res = await axios.post(`${BASE_URL}login_check.php`, {
        data: window.btoa(JSON.stringify({
            'email': email,
            'password': password
        }))
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return JSON.parse(window.atob(res['data']));
}
async function sendEmail(name, email, mobile, comments, vat, address, redirectUrl){
    console.log(name, email, mobile, comments, redirectUrl,'name, email, mobile, comments, redirectUrl')
    const res = await axios.post(`${BASE_URL}sendEmail.php`, {
        data: window.btoa(JSON.stringify({
            'uid': localStorage.getItem('uuid'),
            'name': name,
            'imageName':imageName,
            'email': email,
            'mobile': mobile,
            'vat': vat,
            'address': address,
            'comments': comments,
            'redirectUrl': redirectUrl
        }))
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return JSON.parse(window.atob(res['data']));
}
async function saveImage(base64_image){
    imageName=uuid();
    const res = await axios.post(`${BASE_URL}saveImage.php`, {
        data: window.btoa(JSON.stringify({
            'uid': localStorage.getItem('uuid'),
            'imageName':imageName,
            'base64_image': base64_image
        }))
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return JSON.parse(window.atob(res['data']));
}
async function processForgotPassword(email){
    const res = await axios.post(`${BASE_URL}forgot_password.php`, {
        data: window.btoa(JSON.stringify({
            'email': email
        }))
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return JSON.parse(window.atob(res['data']));
}

async function dorecoverPassword(tempCode, password){
    const res = await axios.post(`${BASE_URL}recover_password.php`, {
        data: window.btoa(JSON.stringify({
            'tempCode': tempCode,
            'password': password
        }))
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return JSON.parse(window.atob(res['data']));
}
async function dochangePassword(password, newPassword){
    const res = await axios.post(`${BASE_URL}change_password.php`, {
        data: window.btoa(JSON.stringify({
            'password': password, 
            'newPassword': newPassword
        }))
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return JSON.parse(window.atob(res['data']));
}


export {
    registerCheck,
    loginCheck,
    createUser,
    updateData,
    sendEmail,
    saveImage,
    processForgotPassword,
    dorecoverPassword,
    dochangePassword,
    logout
}
