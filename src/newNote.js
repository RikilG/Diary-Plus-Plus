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

btnBack.addEventListener('click', () => {
    window.location.href = "./home.html";
    window.localStorage.removeItem('readonly');
    window.localStorage.removeItem('entryPath');
});

btnSave.addEventListener('click', () => {
    infoPanel.style.display = "block";
    infoPanel.innerHTML = "Saving...";
    fs.writeFile(filePath, editor.value, (err) => {
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
        editor.value = data;
        editor.readOnly = true;
        infoPanel.innerHTML = "Read-Only Mode"
        btnEdit.style.display = "block";
        btnSave.style.display = "none";
    })
}