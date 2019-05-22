let directory = require('./Globals').diaryStoreLocation;
let seperator = require('./Globals').seperator;
let fs = require('fs');

document.getElementById('btnCreateDiary').addEventListener('click', () => {
    let diaryName = document.getElementById('tfDiaryName').value;
    let path = directory + seperator + diaryName;
    if(fs.existsSync(path)) {
        document.getElementById('error').innerHTML = "Diary with same name already present";
        return;
    }
    fs.mkdirSync(path);
    document.getElementById('error').innerHTML = "Diary created successfully...\nRedirecting...";
    setTimeout(() => window.location.href = "./index.html", 600);
});

document.getElementById('btnBack').addEventListener('click', () => {
    window.location.href = "./index.html";
});