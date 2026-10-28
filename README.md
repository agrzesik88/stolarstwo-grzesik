# Stolarstwo Grzesik – strona www

Statyczna strona firmowa (czysty HTML + CSS + JS, bez frameworków i bez zależności
zewnętrznych), hostowana na GitHub Pages.

- Podgląd: https://agrzesik88.github.io/stolarstwo-grzesik/
- Kontakt: ul. Myśliwca 15, 47-330 Zdzieszowice, tel. +48 77 484 42 26

## Struktura

```
index.html                 – strona główna
o-nas.html                 – o nas / historia
schody.html, stolarka-okienna.html, meble-na-wymiar.html, drzwi.html,
kuchnie.html, prace-wykonczeniowe.html, renowacje.html – podstrony realizacji
kontakt.html               – kontakt + formularz
praca.html                 – oferta pracy
polityka-prywatnosci.html  – polityka prywatności
styles.css / script.js     – style i skrypt (bez zależności)
assets/images/             – grafiki (WebP)
assets/favicon.svg         – faviconka
robots.txt, sitemap.xml    – pliki dla wyszukiwarek
```

## Formularz kontaktowy

Formularze na stronie głównej i w kontakcie wysyłają wiadomości przez
[FormSubmit](https://formsubmit.co) na adres `aeddy88@gmail.com`
(adres podany w atrybucie `action` formularza w `index.html` i `kontakt.html`).

**Pierwsze wysłanie wymaga aktywacji** – FormSubmit wysyła na ten adres e-mail z linkiem
potwierdzającym, który trzeba kliknąć raz, żeby zacząć otrzymywać zgłoszenia.
Wysyłka działa przez AJAX (`script.js` → `formsubmit.co/ajax/...`), a bez włączonego
JavaScriptu formularz działa jako zwykły POST.

Aby zmienić adres odbiorcy, wystarczy podmienić go w `action` obu formularzy.

## Wdrożenie

Wystarczy `git push` do gałęzi `master` – GitHub Pages publikuje stronę automatycznie.

Przy przeniesieniu na własną domenę zaktualizuj bazowy adres w:
`<link rel="canonical">`, `og:url`, `og:image` we wszystkich plikach HTML oraz `Sitemap`
w `robots.txt` i lokalizacje w `sitemap.xml`.
