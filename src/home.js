let diaryPath = window.localStorage.getItem('diaryPath');
let diaryName = window.localStorage.getItem('diaryName');
console.log(diaryName);
console.log(diaryPath);

document.getElementById('btnBack').addEventListener('click', () => {
    window.location.href = "./index.html";
});

document.getElementById('btnNewEntry').addEventListener('click', () => {
    window.location.href = "./newNote.html";
});