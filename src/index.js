let fs = require('fs');
let async = require('async');

let { seperator } = require('./Globals');
let directory = require('./Globals').diaryStoreLocation;

document.querySelector('#btnLoadDiary').addEventListener('click', () => {
    //load selected diary
    let name = document.getElementById('tfDiaryName').value;
    if(name === "null") {
        document.getElementById('error').innerHTML = "Please select a diary or create a new one";
        return;
    }
    else {
        let path = directory + seperator + name;
        let myStorage = window.localStorage;
        myStorage.setItem('diaryPath', path);
        myStorage.setItem('diaryName', name);
        window.location.href = './home.html';
    }
});

document.getElementById('btnCreateDiary').addEventListener('click', () => {
    window.location.href = "./newDiary.html";
})

checkDir = (callback) => {
    try {
        //query if diary entries location exists
        if(!fs.existsSync(directory)) {
            //if it does not exist, then create one.
            fs.mkdirSync(directory);
            console.log("folder created!!: "+directory);
        }
        else {
            console.log("using existing folder: "+directory);
        }
    }
    catch(err) {
        console.log(err);
    }
    callback(null);
}

loadAllDiaries = (callback) => {
    let diaries;
    fs.readdirSync(directory).forEach(file => {
        let path = directory + seperator + file;
        if(fs.lstatSync(path).isDirectory()) {
            let element = document.createElement('option');
            element.value = file;
            element.innerHTML = file;
            document.getElementById('tfDiaryName').appendChild(element);
        }
    });
    console.log('Loaded diaries from target folder');
    callback(null);
}

async.waterfall([
    checkDir,
    loadAllDiaries
]);