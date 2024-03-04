import axios from "axios";

import {
    Global
} from "./global";

const BASE_URL='https://www.apexexp.in/Games/Deliveryves/';



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

async function sendEmail(email){
    const res = await axios.post(`${BASE_URL}sendEmail.php`, {
        data: window.btoa(JSON.stringify({
            'uid': localStorage.getItem('uuid'),
            'email': email
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
