//FONCTIONS
function domForEach(selector, callback) {
    document.querySelectorAll(selector).forEach(callback);
}

function domOn(selector, event, callback) {
    domForEach(selector, ele => ele.addEventListener(event, callback));
}

function isOdd(num) {
    if (num % 2 == true) {
    }
    return num % 2;
}

//MON CODE

//RECTANGLE CHANGEMENT DE COULEUR
domOn('.rectangle', 'click', evt => {
    const monRectangle = evt.target;
    const color = monRectangle.getAttribute('fill');

    if (color == "green") {
        monRectangle.setAttribute('fill', 'blue');

    } else {
        monRectangle.setAttribute('fill', 'green');

    }

})

//RAYON CHANGEMENT DE TAILLE

domOn('.donut', 'mouseover', evt => {
    const monDonut = evt.target;
    console.log(monDonut);
    const rayon = monDonut.getAttribute('r');
    monDonut.setAttribute('r', rayon * 1.2)




})