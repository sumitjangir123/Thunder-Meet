var obj = document.querySelectorAll(".zoom");

//animate the value
function animateValue(id, start, end, duration) {
    var range = end - start;
    var current = start;
    var increment = end > start ? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function () {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

//make it for every element those have class zoom
for (i of obj) {
    //animate it only when its value is greater than zero
    if (i.innerText > 0) {
        animateValue(i.getAttribute("id"), 0, i.innerText, 1000);
    }
}

var windowWidth = window.innerWidth;
if (windowWidth <= 400) {
    var i = document.getElementById('old');
    var d = document.getElementById('new');
    d.innerHTML += i.innerHTML;
}