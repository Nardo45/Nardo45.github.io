const menuImg = document.getElementById('menuImg');
const popUpMenu = document.getElementById('popUpMenu');
// const time = new Date();
const search = document.getElementById('search');
const searchBar = document.getElementById('searchArea');
// let searchBarDisplay = false;
// searchBar.style.display = "none";

menuImg.addEventListener('click', () => {
    let menuStatus = window.getComputedStyle(popUpMenu).visibility;
    if (menuStatus == "hidden") {
        popUpMenu.style.visibility = "visible"
    } else {
        popUpMenu.style.visibility = "hidden"
    }
});
// document.getElementById('currentTime').innerText = time;

search.addEventListener('click', () => {  
    searchBar.classList.toggle('active');
})