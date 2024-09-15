import './addressBook.scss';
import { addAddress, addNewEmail, deleteAddress, fetchAllUserAddress, logout } from './objects/api';
import { Global } from './objects/global';
import { uuid } from "uuidv4";


let userAddressData=null;
let activeEmail= null;
let lastEmailEle=null;
let emailFilterKey="";
let deleteAddressID=null;
let emailCreateTO=null

let add_title=null;
let add_housenumber=null;
let add_street=null;
let add_city=null;
let add_postalcode=null;


window.onload = async function () {
    document.body.classList.add("active");

    
    userAddressData= await fetchAllUserAddress();
    userAddressData= userAddressData['address_info']
    console.log(userAddressData);

    
    fillEmails();
    
    document.querySelector("#add_address").addEventListener("click", showAddressSection);
    document.querySelector("#cancel_address").addEventListener("click", hideAddressSection);
    document.querySelector("#save_address").addEventListener("click", onSaveAddress);
    document.querySelector("#search_eamil").addEventListener("keyup", updateEmailFilter)
   

    document.querySelector("#delete_confirm #dt_confirm").addEventListener("click", onAddressDelete);
    document.querySelector("#delete_confirm #dt_cancel").addEventListener("click", hideDeleteConfirm);

    document.querySelector("#newEmailSubmit").addEventListener("click", addNewEmailAddress)
    
    document.querySelector("#logout").addEventListener("click", confirmLogout)
    document.querySelector("#lg_confirm").addEventListener("click", doLogout)
    document.querySelector("#lg_cancel").addEventListener("click", cancelLogout)
   
};
function confirmLogout(){
    document.querySelector("#logout_confirm").classList.add("active")
}
function cancelLogout(){
    document.querySelector("#logout_confirm").classList.remove("active")
}
async function doLogout(){
    await logout();
    location.href='./login.php';
}
async function addNewEmailAddress(){
    
    let newEmail= document.querySelector("#new_email").value.trim();
    hideEmailInfo();
    emailCreateTO && clearTimeout(emailCreateTO);
    if(newEmail.length==0 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newEmail))) {
        document.querySelector(".new_email .info").classList.add("active");
        document.querySelector(".new_email .info").classList.add("error")
        document.querySelector(".new_email .info").innerHTML="Ongeldig e-mailadres";
        return false
    };

    let uid= uuid();
    let res= await addNewEmail(newEmail, uid);
    if(res['response']['code'] == 409){
        document.querySelector(".new_email .info").classList.add("active")
        document.querySelector(".new_email .info").classList.add("error")
        document.querySelector(".new_email .info").innerHTML=res['response']['message'];
    }else if(res['response']['code'] == 200){
        userAddressData[newEmail]= {};
        document.querySelector("#new_email").value="";
        document.querySelector(".new_email .info").classList.add("success")
        document.querySelector(".new_email .info").classList.add("active")
        document.querySelector(".new_email .info").innerHTML="Succesvol aangemaakt";
        document.querySelector('.app-container>.left .emails').innerHTML += `<div class="email"> <div class="icon"><img src="./assets/user.png" alt="" sizes="" srcset=""></div> <div class="txt">${newEmail}</div> </div>`;
        setTimeout(()=>{
            let emailEle=document.querySelector('.app-container>.left .emails .email:last-child');
            emailEle.addEventListener("click", showAddressInfo.bind(this, emailEle, emailEle.querySelector(".txt").innerHTML))
        }, 100);
        emailCreateTO= setTimeout(hideEmailInfo.bind(this), 1000)
    }
    console.log(res['response']);
}
function hideEmailInfo(){
    document.querySelector(".new_email .info").classList.remove("active");
    document.querySelector(".new_email .info").classList.remove("error");
    document.querySelector(".new_email .info").classList.remove("success");
}
function updateEmailFilter(){
    if(Global.popupActive) return false;

    emailFilterKey= document.querySelector("#search_eamil").value.trim();
    fillEmails();
}
function fillEmails(){
    let totalEmails=0;
    document.querySelector('.app-container>.left .emails').innerHTML='';
    Object.keys(userAddressData).forEach((email) => {
        if(emailFilterKey.length== 0 || email.indexOf(emailFilterKey) !=-1){
            document.querySelector('.app-container>.left .emails').innerHTML += `<div class="email"> <div class="icon"><img src="./assets/user.png" alt="" sizes="" srcset=""></div> <div class="txt">${email}</div> </div>`;
            totalEmails++;
        }
    });
    document.querySelectorAll('.app-container>.left .emails .email').forEach((emailEle) => {
        emailEle.addEventListener("click", showAddressInfo.bind(this, emailEle, emailEle.querySelector(".txt").innerHTML))
    });
    if(totalEmails>0){
        let emailEle= document.querySelector('.app-container>.left .emails .email:nth-child(1)')
        showAddressInfo(emailEle, emailEle.querySelector(".txt").innerHTML);
    }else{
        hideRightSection();
    }

}

function showAddressInfo(emailEle, email){

    if(Global.popupActive) return false;

    hideAddressSection();
    activeEmail= email;
    lastEmailEle= emailEle;

    document.querySelector('.app-container>.right .adresses').classList.add('active');
    document.querySelectorAll('.app-container>.left .emails .email').forEach((emailEle) => {
        emailEle.classList.remove("active");
    });
    emailEle.classList.add("active")
    document.querySelector('.app-container>.right .adresses .content').innerHTML='';
    Object.keys(userAddressData[email]).forEach((addressID) => {
        let _address= `${userAddressData[email][addressID]['housenumber']}, ${userAddressData[email][addressID]['street']},<br/>${userAddressData[email][addressID]['city']}, ${userAddressData[email][addressID]['postalcode']}`;
        let _title = userAddressData[email][addressID]['title'];
        document.querySelector('.app-container>.right .adresses .content').innerHTML += `<div class="address"> <div class="deleteBtn" data-address-id='${addressID}'><img src="./assets/bin.png" alt="" srcset=""></div> <div class="head"> <div class="icon"><img src="./assets/location.png" alt=""></div> <div class="txt">${_title}</div> </div> <div class="info">${_address}</div> </div>`
        
    })
    Object.keys(userAddressData[email]).forEach((addressID) => {
        document.querySelector(`.app-container>.right .adresses .content [data-address-id='${addressID}']`).addEventListener("click", showDeleteConfirm.bind(this, addressID))
    });
}
function showDeleteConfirm(addressID){
    if(Global.popupActive) return false;

    document.querySelector("#delete_confirm").classList.add("active");
    deleteAddressID= addressID;
    Global.popupActive= true;
}
function hideDeleteConfirm(addressID){
    if(!Global.popupActive) return false;

    document.querySelector("#delete_confirm").classList.remove("active");
    deleteAddressID= null;
    Global.popupActive= false;
}
async function onAddressDelete(){
    // alert(addressID);
    let res= await deleteAddress(activeEmail, deleteAddressID);

    delete userAddressData[activeEmail][deleteAddressID];
    hideDeleteConfirm();
    showAddressInfo(lastEmailEle, lastEmailEle.querySelector(".txt").innerHTML)

   
}

function showAddressSection(){
    if(Global.popupActive) return false;

    document.querySelector('.app-container .right .adresses').classList.remove('active');
    document.querySelector('.app-container .right .address_addition').classList.add('active');

    document.querySelector("#title").value= "";
    document.querySelector("#housenumber").value= "";
    document.querySelector("#street").value= "";
    document.querySelector("#city").value= "";
    document.querySelector("#postalcode").value= "";
}
function hideRightSection(){
    document.querySelector('.app-container .right .adresses').classList.remove('active');
    document.querySelector('.app-container .right .address_addition').classList.remove('active');
}
function hideAddressSection(){
    if(Global.popupActive) return false;

    document.querySelector('.app-container .right .adresses').classList.add('active');
    document.querySelector('.app-container .right .address_addition').classList.remove('active');
}
async function onSaveAddress(){
    if(Global.popupActive) return false;

    let validationStatus= validateAddress();

    if(!validationStatus) return false;

    let addressInfo= await addAddress(activeEmail, add_title, add_housenumber, add_street, add_city, add_postalcode);
    userAddressData[activeEmail][addressInfo['addressID']]={
        'title': add_title,
        'housenumber': add_housenumber,
        'street': add_street,
        'city': add_city,
        'postalcode': add_postalcode
    }
    showAddressInfo(lastEmailEle, lastEmailEle.querySelector(".txt").innerHTML)
}

function validateAddress(){

    document.querySelector(".error_info").innerHTML='';

    add_title= document.querySelector("#title").value.trim();
    add_housenumber= document.querySelector("#housenumber").value.trim();
    add_street= document.querySelector("#street").value.trim();
    add_city= document.querySelector("#city").value.trim();
    add_postalcode= document.querySelector("#postalcode").value.trim();
       
    if(add_title.length==0){
        document.querySelector(".error_info").innerHTML='Ongeldige titel';
        return false;
    }
    if(add_housenumber.length==0){
        document.querySelector(".error_info").innerHTML='Ongeldig huisnummer';
        return false;
    }
    if(add_street.length==0){
        document.querySelector(".error_info").innerHTML='Ongeldige straat';
        return false;
    }
    if(add_city.length==0){
        document.querySelector(".error_info").innerHTML='Ongeldige stad';
        return false;
    }
    if(add_postalcode.length==0){
        document.querySelector(".error_info").innerHTML='Ongeldige postcode';
        return false;
    }

    return true;
}