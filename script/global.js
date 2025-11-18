const menuImg = document.getElementById('menuImg');
const popUpMenu = document.getElementById('popUpMenu');

menuImg.addEventListener('click', () => {
    let menuStatus = window.getComputedStyle(popUpMenu).visibility;
    if (menuStatus == "hidden") {
        popUpMenu.style.visibility = "visible"
    } else {
        popUpMenu.style.visibility = "hidden"
    }
});

