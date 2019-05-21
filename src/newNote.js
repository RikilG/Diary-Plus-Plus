let fs = require('fs');

document.getElementById('btnBack').addEventListener('click', () => {
    window.location.href = "./home.html";
})

document.getElementById('btnSave').addEventListener('click', () => saveFile());

saveFile = () => {
    fs.writeFile("filename", document.getElementById('editor').value, (err) => (err)?console.log('Error in saving file\n'+err):null)
}