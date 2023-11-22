// Nasłuchujemy zdarzenie przewijania strony
window.addEventListener('scroll', function() {
    const logo = document.querySelector('.logo_big');
    if (window.scrollY > 5) { // Wartość, po której ma nastąpić animacja (przykładowo 50px)
        logo.style.top = '-150px'; // Gdy zaczynamy scrollować w dół, logo przesuwa się do góry
    } else {
        logo.style.top = '108px'; // Gdy wracamy do góry, logo wraca na pierwotne położenie
    }
});