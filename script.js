// Nasłuchujemy zdarzenie przewijania strony
window.addEventListener('scroll', function() {
        const logoBig = document.querySelector('.logo_big');
        const logoMini = document.querySelector('.logo_mini');
    if (window.scrollY > 5) { // Wartość, po której ma nastąpić animacja (przykładowo 50px)
        logoBig.style.top = '-200px'; // Gdy zaczynamy scrollować w dół, logo przesuwa się do góry
        logoMini.style.top = '32px'; // Pokazanie logo_mini
        logoMini.style.left = '40%'; // Pokazanie logo_mini
    } else {
        logoBig.style.top = '108px'; // Gdy wracamy do góry, logo wraca na pierwotne położenie
        logoMini.style.top = '-180px'; // Schowanie logo_mini
    }
});