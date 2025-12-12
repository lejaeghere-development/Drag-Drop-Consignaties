import axios from 'axios';

import { Global } from './global';
import { uuid } from 'uuidv4';

const BASE_URL = './';

let imageName = null;

async function createUser() {
  const res = await axios.post(
    `${BASE_URL}create.php`,
    {
      data: window.btoa(
        JSON.stringify({
          uuid: localStorage.getItem('uuid'),
          username: localStorage.getItem('username'),
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}

async function logout() {
  const res = await axios.get(`${BASE_URL}logout.php`);
}

async function updateInfo(email, showEmpty, racks) {
  const res = await axios.post(
    `${BASE_URL}update_info_status.php`,
    {
      data: window.btoa(
        JSON.stringify({
          email,
          showEmpty,
          racks,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function updateHintStatus(hideChecked) {
  const res = await axios.post(
    `${BASE_URL}update_hint_status.php`,
    {
      data: window.btoa(
        JSON.stringify({
          hideHint: hideChecked,
          email: window.email,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function fetchCustomInfo() {
  const res = await axios.get(
    `${BASE_URL}fetch_custom_info.php`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function saveCustomInfo(customData) {
  const res = await axios.post(
    `${BASE_URL}save_custom_info.php`,
    {
      data: window.btoa(
        JSON.stringify({
          customData,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function fetchAllUserAddress() {
  const res = await axios.get(
    `${BASE_URL}fetchAllUsers.php`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function getLatestConfig(email) {
  const res = await axios.get(
    `${BASE_URL}getLatestConfig.php`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}

async function updateData() {
  const res = await axios.post(
    `${BASE_URL}data.php`,
    {
      data: window.btoa(
        JSON.stringify({
          uuid: localStorage.getItem('uuid'),
          data: Global.dataToSent,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function registerCheck(name, email, mobile, password) {
  const res = await axios.post(
    `${BASE_URL}register_check.php`,
    {
      data: window.btoa(
        JSON.stringify({
          uuid: localStorage.getItem('uuid'),
          username: name,
          email: email,
          mobile: mobile,
          password: password,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function loginCheck(email, password) {
  const res = await axios.post(
    `${BASE_URL}login_check.php`,
    {
      data: window.btoa(
        JSON.stringify({
          email: email,
          password: password,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function sendEmail(
  name,
  email,
  mobile,
  comments,
  vat,
  address,
  redirectUrl
) {
  let drinks = {};
  let prevdrinks = {};
  const jsonDataPartial = Global.jsonData;
  Object.keys(Global.crateData).forEach((key) => {
    if (Global.crateData[key]['filledBottles']) {
      for (let i = 0; i < Global.crateData[key]['filledBottles'].length; i++) {
        const _name = jsonDataPartial.filter((item) => {
          return item.bottle_key == Global.crateData[key]['filledBottles'][i];
        })[0]['name'];
        const _volume = jsonDataPartial.filter((item) => {
          return item.bottle_key == Global.crateData[key]['filledBottles'][i];
        })[0]['volume'];
        if (Object.keys(drinks).indexOf(`${_name} - ${_volume}`) == -1) {
          drinks[`${_name} - ${_volume}`] = 0;
        }
        drinks[`${_name} - ${_volume}`] += 6;
      }
    }
  });
  Object.keys(Global.prevCrateData).forEach((key) => {
    if (Global.prevCrateData[key]['filledBottles']) {
      for (
        let i = 0;
        i < Global.prevCrateData[key]['filledBottles'].length;
        i++
      ) {
        const _name = jsonDataPartial.filter((item) => {
          return (
            item.bottle_key == Global.prevCrateData[key]['filledBottles'][i]
          );
        })[0]['name'];
        const _volume = jsonDataPartial.filter((item) => {
          return (
            item.bottle_key == Global.prevCrateData[key]['filledBottles'][i]
          );
        })[0]['volume'];
        if (Object.keys(prevdrinks).indexOf(`${_name} - ${_volume}`) == -1) {
          prevdrinks[`${_name} - ${_volume}`] = 0;
        }
        prevdrinks[`${_name} - ${_volume}`] += 6;
      }
    }
  });
  console.log(drinks, 'drinks');
  console.log(prevdrinks, 'prevdrinks');
  //Global.prevCrateData
  const res = await axios.post(
    `${BASE_URL}sendEmail.php`,
    {
      data: window.btoa(
        JSON.stringify({
          uid: localStorage.getItem('uuid'),
          name: name,
          imageName: imageName,
          email: email,
          mobile: mobile,
          vat: vat,
          address: address,
          comments: comments,
          redirectUrl: redirectUrl,
          drinks,
          prevdrinks,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function saveImage(base64_image) {
  imageName = uuid();
  const res = await axios.post(
    `${BASE_URL}saveImage.php`,
    {
      data: window.btoa(
        JSON.stringify({
          uid: localStorage.getItem('uuid'),
          imageName: imageName,
          base64_image: base64_image,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function processForgotPassword(email) {
  const res = await axios.post(
    `${BASE_URL}forgot_password.php`,
    {
      data: window.btoa(
        JSON.stringify({
          email: email,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}

async function dorecoverPassword(tempCode, password) {
  const res = await axios.post(
    `${BASE_URL}recover_password.php`,
    {
      data: window.btoa(
        JSON.stringify({
          tempCode: tempCode,
          password: password,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
async function getAddresBasedCombination() {
  const res = await axios.post(
    `${BASE_URL}getAddresBasedCombination.php`,
    {
      data: window.btoa(
        JSON.stringify({
          addressID: Global.addressID,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}

async function dochangePassword(password, newPassword) {
  const res = await axios.post(
    `${BASE_URL}change_password.php`,
    {
      data: window.btoa(
        JSON.stringify({
          password: password,
          newPassword: newPassword,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}

async function addNewEmail(email, uid) {
  const res = await axios.post(
    `${BASE_URL}update_address.php`,
    {
      data: window.btoa(
        JSON.stringify({
          operation: 'NEW_EMAIL',
          email,
          uid,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}
//
async function addAddress(email, title, housenumber, street, city, postalcode) {
  const res = await axios.post(
    `${BASE_URL}update_address.php`,
    {
      data: window.btoa(
        JSON.stringify({
          operation: 'ADD',
          email,
          title,
          housenumber,
          street,
          city,
          postalcode,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return JSON.parse(window.atob(res['data']));
}

async function deleteAddress(email, addressID) {
  const res = await axios.post(
    `${BASE_URL}update_address.php`,
    {
      data: window.btoa(
        JSON.stringify({
          operation: 'REMOVE',
          email: email,
          addressID: addressID,
        })
      ),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
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
  fetchAllUserAddress,
  deleteAddress,
  addAddress,
  addNewEmail,
  updateHintStatus,
  getLatestConfig,
  getAddresBasedCombination,
  updateInfo,
  fetchCustomInfo,
  saveCustomInfo,
  logout,
};
