let fs = require('fs');
let diaryName = window.localStorage.getItem('diaryName');
let { diaryStoreLocation, seperator } = require('./Globals');
let date = new Date();
let filePath = diaryStoreLocation + seperator + diaryName + seperator + date.toDateString().replace(/ /g, "-");

let infoPanel = document.getElementById('info');
let editor = document.getElementById('editor');
let btnBack = document.getElementById('btnBack');
let btnSave = document.getElementById('btnSave');
let btnEdit = document.getElementById('btnEdit');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return {
     info: "Do not modify this file.",
     key: key.toString('hex'),
     iv: iv.toString('hex'),
     encryptedData: encrypted.toString('hex')
    };
}

function decrypt(text) {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(text.key, 'hex'), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}

btnBack.addEventListener('click', () => {
    window.location.href = "./home.html";
    window.localStorage.removeItem('readonly');
    window.localStorage.removeItem('entryPath');
});

btnSave.addEventListener('click', () => {
    infoPanel.style.display = "block";
    infoPanel.innerHTML = "Saving...";
    let data = JSON.stringify(encrypt(editor.value));
    fs.writeFile(filePath, data, (err) => {
        (err)?console.log('Error in saving file\n'+err):null
        setTimeout(() => {
            window.location.href = "./home.html";
        }, 500);
    });
});

btnEdit.addEventListener('click', () => {
    editor.readOnly = false;
    btnSave.style.display = "block";
    btnEdit.style.display = "none";
    infoPanel.style.display = "none";
});

if(window.localStorage.getItem('readonly') === 'true') {
    filePath = window.localStorage.getItem('entryPath');
    let file = new File(['file'], filePath);
    fs.readFile(window.localStorage.getItem('entryPath'), {encoding: 'utf-8'}, (err, data) => {
        editor.value = decrypt(JSON.parse(data));
        editor.readOnly = true;
        infoPanel.innerHTML = "Read-Only Mode"
        btnEdit.style.display = "block";
        btnSave.style.display = "none";
    })
}