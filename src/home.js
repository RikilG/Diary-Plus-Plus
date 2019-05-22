let fs = require('fs');

let seperator = require('./Globals').seperator;
let diaryPath = window.localStorage.getItem('diaryPath');
let diaryName = window.localStorage.getItem('diaryName');
let entries = document.getElementById('entries');

document.getElementById('btnBack').addEventListener('click', () => {
    window.location.href = "./index.html";
});

document.getElementById('btnNewEntry').addEventListener('click', () => {
    window.location.href = "./newNote.html";
});

document.getElementById('diaryTitle').innerHTML = diaryName;

fs.readdirSync(diaryPath).forEach(file => {
    let path = diaryPath + seperator + file;
    if(fs.lstatSync(path).isFile()) {
        let entry = document.createElement('div');
        entry.innerHTML = file;
        entry.style.cursor = "pointer";
        entry.addEventListener('click', (event) => {
            window.localStorage.setItem('readonly', 'true');
            window.localStorage.setItem('entryPath', diaryPath + seperator + event.target.innerHTML);
            window.location.href = './newNote.html';
        })
        entries.appendChild(entry);
    }
})