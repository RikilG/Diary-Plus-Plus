let os = require('os');

let diaryStoreLocation;
let seperator;

if(os.platform()==='win32') {
    diaryStoreLocation = os.homedir()+'\\Diary++';
    seperator = '\\';
}
else {
    diaryStoreLocation = os.homedir()+'/Diary++';
    seperator = '/';
}

exports.diaryStoreLocation = diaryStoreLocation;
exports.seperator = seperator;

// console.log(os.homedir());
// console.log(os.platform());