let fs = require('fs');
let async = require('async');

let { seperator } = require('./Globals');
let directory = require('./Globals').diaryStoreLocation;

document.getElementById('btnCreateDiary').addEventListener('click', () => {
    window.location.href = "./newDiary.html";
})

loadDiary = (diaryPath, diaryName) => {
    let root = document.getElementById('mainbar');
    root.innerHTML = "";
    let title = document.createElement('div');
    title.className = "diaryTitle";
    title.innerHTML = diaryName;
    root.appendChild(title);
    let entries = document.createElement('div');
    root.appendChild(entries);

    fs.readdirSync(diaryPath).forEach(file => {
        let path = diaryPath + seperator + file;
        if(fs.lstatSync(path).isFile()) {
            let entry = document.createElement('div');
            entry.innerHTML = file;
            entry.className = "diaryEntry"
            entry.addEventListener('click', (event) => {
                let entryPath = diaryPath + seperator + event.target.innerHTML;
                window.localStorage.setItem('readonly', 'true');
                window.localStorage.setItem('entryPath', entryPath);
                window.location.href = './newNote.html';
            })
            entries.appendChild(entry);
        }
    })

    let newNote = document.createElement('div');
    newNote.innerHTML = "New Entry";
    newNote.className = "button2";
    newNote.style.marginTop = "auto";
    newNote.addEventListener('click', async () => {
        let fileName = await new Date();
        fileName = fileName.toDateString().replace(/ /g, "-");
        if(fs.existsSync(diaryPath + seperator + fileName)) {
            window.localStorage.setItem('readonly', 'true');
            window.localStorage.setItem('entryPath', diaryPath + seperator + fileName);
        }
        else {
            window.localStorage.setItem('readonly', 'false');
        }
        window.location.href = "./newNote.html";
    })
    root.appendChild(newNote);
}

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
    // first get diaries div in sidebar to work with
    let diaries = document.getElementById("diaries");

    fs.readdirSync(directory).forEach(file => {
        let path = directory + seperator + file;
        if(fs.lstatSync(path).isDirectory()) {
            //create div for each diary found
            let element = document.createElement('div');
            element.value = file;
            element.innerHTML = file;
            element.className = "diary";
            element.addEventListener('click', () => {
                let path = directory + seperator + file;
                let myStorage = window.localStorage;
                myStorage.setItem('diaryPath', path);
                myStorage.setItem('diaryName', file);
                // window.location.href = './home.html';
                loadDiary(path, file);
            })
            diaries.appendChild(element);
        }
    });
    console.log('Loaded diaries from target folder');
    callback(null);
}

async.waterfall([
    checkDir,
    loadAllDiaries
]);