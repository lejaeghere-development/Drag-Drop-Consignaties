import './customCrate.scss';
import { fetchCustomInfo, logout, saveCustomInfo } from './objects/api';
import { Global } from './objects/global';

const jsonData = require('../bottle-data/bottles.json');
Global.jsonData = jsonData;
Global.jsonData.forEach((data) => {
  data['bottle_img'] = data['bottle_key'];
});

let crateEditEnabled = false;
window.onload = async function () {
  const serverData = await fetchCustomInfo();
  console.log(serverData, 'serverData');
  Global.jsonData.forEach((data) => {
    if (data.crate_category === 24) {
      const serverBottle = serverData.find(
        (item) => item.bottle_key === data.bottle_key
      );
      const isDisabled =
        serverBottle && serverBottle.enabled == '0' ? true : false;

      document.querySelector('.bottles').innerHTML += `
      <div class="bottle" id="${data.bottle_key}">
                   <img src="./assets/bottles/singles/${
                     data.bottle_img
                   }.png" alt="" class="bottle_icon"/>
                   <div class="name">${data.name}</div>
                   <input type="checkbox" name="" id=${
                     data.bottle_key
                   } class="show_bottle" ${!isDisabled ? 'checked' : ''}/>
           </div>
     `;
    }
  });

  document.body.classList.add('active');
  document.querySelector('#logout').addEventListener('click', confirmLogout);
  document.querySelector('#lg_confirm').addEventListener('click', doLogout);
  document.querySelector('#lg_cancel').addEventListener('click', cancelLogout);
  document
    .querySelector('#edit_update_info')
    .addEventListener('click', enableOrDisableInfoEdit);
};

async function doLogout() {
  await logout();
  location.href = './login.php';
}
async function enableOrDisableInfoEdit() {
  crateEditEnabled = !crateEditEnabled;
  document.querySelector('#edit_update_info').innerHTML = crateEditEnabled
    ? 'UPDATE'
    : 'EDIT';

  document.querySelectorAll('.bottle').forEach((bottle) => {
    if (crateEditEnabled) {
      bottle.querySelector('input').classList.add('active');
    } else {
      bottle.querySelector('input').classList.remove('active');
    }
  });

  if (!crateEditEnabled) {
    const dataToSave = {};
    document.querySelectorAll('.bottle').forEach((bottle) => {
      dataToSave[bottle.id] = bottle.querySelector('input').checked ? 1 : 0;
    });
    await saveCustomInfo(dataToSave);
  }
}
function confirmLogout() {
  document.querySelector('#logout_confirm').classList.add('active');
}
function cancelLogout() {
  document.querySelector('#logout_confirm').classList.remove('active');
}
