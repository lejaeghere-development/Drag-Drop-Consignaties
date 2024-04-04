import axios from "axios";

import {
    Global
} from "./global";

const BASE_URL='./';//'https://www.apexexp.in/Games/Deliveryves/';



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

async function sendEmail(name, email, mobile, comments, redirectUrl){
    const res = await axios.post(`${BASE_URL}sendEmail.php`, {
        data: window.btoa(JSON.stringify({
            'uid': localStorage.getItem('uuid'),
            'name': name,
            'email': email,
            'mobile': mobile,
            'email': email,
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
    const res = await axios.post(`${BASE_URL}saveImage.php`, {
        data: window.btoa(JSON.stringify({
            'uid': localStorage.getItem('uuid'),
            'base64_image': base64_image
        }))
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return JSON.parse(window.atob(res['data']));
}



export {
    createUser,
    updateData,
    sendEmail,
    saveImage
}
