# Project Contract

## Cel projektu

Statyczna, kolorowa strona dla uczniów klas 2–4 służąca do ćwiczenia mnożenia przez liczby 2–10 i śledzenia postępów bez konta oraz serwera.

## Aktualny zakres

- wybór jednej, kilku lub wszystkich tabliczek 2–10,
- trening 10 albo 20 pytań,
- wyłącznie zwykłe działania matematyczne,
- odpowiedź z klawiatury i zatwierdzanie Enterem,
- druga próba po błędzie,
- natychmiastowe pokazanie prawidłowego wyniku po drugim błędzie i oczekiwanie na przycisk `OK`,
- końcowa lista błędnych zadań zawierająca wyłącznie poprawne odpowiedzi,
- procent poprawnych zadań,
- jeden średni czas rozwiązywania zadań,
- historia do 100 treningów w `localStorage`,
- wykres dwóch serii z dwiema osiami wartości,
- działanie z lokalnego `index.html` bez bibliotek zewnętrznych.

## Stabilne zachowania — nie zmieniać bez zgody

- zakres ćwiczeń wynosi 2–10,
- użytkownik może wybrać konkretne liczby albo wszystkie,
- sesja zawiera dokładnie 10 albo 20 pytań,
- wszystkie pytania są zwykłymi działaniami,
- po pierwszym błędzie dostępna jest druga próba,
- zadanie zalicza się jako poprawne wyłącznie po poprawnej pierwszej odpowiedzi,
- poprawna odpowiedź za drugim razem jest liczona jako błędne zadanie i trafia do sekcji `Warto powtórzyć`,
- po drugim błędzie natychmiast pokazuje się prawidłową odpowiedź,
- po drugim błędzie przejście dalej jest możliwe dopiero po zatwierdzeniu przyciskiem `OK`,
- podsumowanie wymienia wszystkie zadania z błędną pierwszą próbą i pokazuje wyłącznie poprawne odpowiedzi, bez błędnych wpisów użytkownika,
- średni czas obejmuje wyłącznie zadania poprawne za pierwszym razem,
- jeśli nie ma żadnej poprawnej pierwszej odpowiedzi, średni czas ma wartość pustą i jest wyświetlany jako `–`,
- historia zawiera najwyżej 100 najnowszych treningów,
- aplikacja pozostaje statyczna i działa bez usług sieciowych,
- wykres pokazuje procenty na lewej osi i sekundy na prawej,
- zaznaczone kafelki, logo, główne przyciski, kafelki wyników i pozostałe akcenty używają ciemnej turkusowo-niebieskiej palety; wyjątkiem są serie wykresu,
- seria skuteczności na wykresie jest niebieska, a seria średniego czasu czerwona; kolory legendy odpowiadają seriom,
- niezaznaczone kafelki pozostają białe,
- numery kroków `1` i `2` są zielone,
- napisy `10 zadań` i `20 zadań` są wycentrowane w swoich kafelkach.

## Pliki stabilne — nie zmieniać bez zgody

- `index.html` — struktura ekranów i wymagane elementy interfejsu,
- `logic.js` — generator i reguły statystyk,
- `app.js` — przebieg treningu, zapis i wykres,
- `styles.css` — zatwierdzona turkusowo-niebieska paleta z zielonymi numerami kroków.

## Fragmenty/funkcje stabilne — nie zmieniać bez zgody

- `generateTasks()` — liczba i proporcje typów pytań,
- `summarizeResults()` — sposób liczenia skuteczności i czasu,
- `addHistoryEntry()` — limit 100 wpisów,
- klucz `multiplicationTrainer.history.v1` — format historii wersji 1.

## Pliki, które można zmieniać przy typowych poprawkach

- `README.md`,
- testy, jeżeli rozszerzają pokrycie bez zmiany kontraktu.

## Procedura zmiany

Przed każdą zmianą AI ma napisać:

1. jaki problem naprawia,
2. jakie pliki chce zmienić,
3. czy któryś z nich jest na liście stabilnej,
4. czego nie będzie ruszać,
5. jakie testy uruchomi.

Jeżeli zmiana wymaga edycji pliku stabilnego, AI musi najpierw uzyskać zgodę.

## Testy regresyjne

Po każdej zmianie sprawdzić:

- [ ] `node --test tests/*.test.js` przechodzi bez błędów,
- [ ] trening 10-zadaniowy zawiera wyłącznie zwykłe działania,
- [ ] trening 20-zadaniowy zawiera wyłącznie zwykłe działania i działa również dla jednej tabliczki,
- [ ] druga błędna odpowiedź pokazuje wynik i przycisk `OK`,
- [ ] bez zatwierdzenia `OK` następne pytanie nie jest wyświetlane,
- [ ] Enter użyty do zatwierdzenia drugiej odpowiedzi nie aktywuje automatycznie przycisku `OK`,
- [ ] odpowiedź poprawna dopiero za drugim razem obniża procent poprawnych zadań,
- [ ] odpowiedź poprawna dopiero za drugim razem trafia do listy `Warto powtórzyć`,
- [ ] czasy zadań z błędną pierwszą próbą nie wpływają na średnie,
- [ ] brak poprawnej pierwszej odpowiedzi daje średni czas `–`,
- [ ] podsumowanie pokazuje błędne zadania i tylko ich poprawne odpowiedzi,
- [ ] podsumowanie nie pokazuje listy powtórkowej, jeśli wszystkie zadania były poprawne,
- [ ] podsumowanie pokazuje procent i jeden średni czas,
- [ ] zapisany zostaje najwyżej setny najnowszy trening,
- [ ] wykres ma dwie serie oraz dwie poprawnie opisane skale,
- [ ] seria skuteczności i jej legenda są niebieskie, a seria średniego czasu i jej legenda czerwone,
- [ ] zaznaczone kafelki i główne akcenty mają turkusowo-niebieską paletę, a niezaznaczone kafelki są białe,
- [ ] numery kroków `1` i `2` są zielone,
- [ ] napisy `10 zadań` i `20 zadań` są wycentrowane,
- [ ] konsola przeglądarki nie zawiera błędów,
- [ ] interfejs pozostaje czytelny na komputerze i telefonie.

## Otwarte problemy

- Brak synchronizacji historii między urządzeniami — celowo, ponieważ strona jest statyczna.
- Dane z `localStorage` znikną po wyczyszczeniu danych witryny.
- Przy jednym treningu wykres pokazuje punkty; linie stają się widoczne od drugiego treningu.
