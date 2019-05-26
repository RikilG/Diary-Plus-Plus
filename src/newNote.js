let fs = require('fs');
let prefs = require('./Prefs.json');
let diaryName = window.localStorage.getItem('diaryName');
let { diaryStoreLocation, seperator } = require('./Globals');
let date = new Date();
let filePath = diaryStoreLocation + seperator + diaryName + seperator + date.toDateString().replace(/ /g, "-");

let infoPanel = document.getElementById('info');
let editor = document.getElementById('editor');
let editorTitle = document.getElementById('editorTitle');
let btnBack = document.getElementById('btnBack');
let btnSave = document.getElementById('btnSave');
let btnEdit = document.getElementById('btnEdit');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

encrypt = (text) => {
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return {
     info: "Do not modify this file.",
     isEncrypted: true,
     title: editorTitle.value,
     key: key.toString('hex'),
     iv: iv.toString('hex'),
     encryptedData: encrypted.toString('hex')
    };
}

nonEncrypt = (text) => {
    return {
        isEncrypted: false,
        title: editorTitle.value,
        data: text
    }
}

decrypt = (text) => {
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
    let data;
    if( prefs.encryption === true )
        data = JSON.stringify(encrypt(editor.value));
    else 
        data = JSON.stringify(nonEncrypt(editor.value));
    fs.writeFile(filePath, data, (err) => {
        (err)?console.log('Error in saving file\n'+err):null
        setTimeout(() => {
            window.location.href = "./home.html";
        }, 500);
    });
});

btnEdit.addEventListener('click', () => {
    editor.readOnly = false;
    editorTitle.readOnly = false;
    btnSave.style.display = "block";
    btnEdit.style.display = "none";
    infoPanel.innerHTML = "Edit Mode";
});

if(window.localStorage.getItem('readonly') === 'true') {
    filePath = window.localStorage.getItem('entryPath');
    fs.readFile(window.localStorage.getItem('entryPath'), {encoding: 'utf-8'}, (err, data) => {
        if(err) console.log(err);
        let fileData = JSON.parse(data);
        if (fileData.isEncrypted === true)
            editor.value = decrypt(fileData);
        else
            editor.value = fileData.data;
        editorTitle.value = fileData.title;
        editor.readOnly = true;
        editorTitle.readOnly = true;
        infoPanel.innerHTML = "Read-Only Mode"
        btnEdit.style.display = "block";
        btnSave.style.display = "none";
    })
}