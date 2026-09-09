# Project Contract

## Cel projektu

Statyczna, kolorowa strona dla uczniów klas 2–4 służąca do ćwiczenia mnożenia przez liczby 2–10 i śledzenia postępów bez konta oraz serwera.

## Aktualny zakres

- wybór jednej, kilku lub wszystkich tabliczek 2–10,
- trening 10 albo 20 pytań,
- równy podział na działania i zadania tekstowe,
- odpowiedź z klawiatury i zatwierdzanie Enterem,
- druga próba po błędzie,
- natychmiastowe pokazanie prawidłowego wyniku po drugim błędzie i oczekiwanie na przycisk `OK`,
- końcowa lista błędnych zadań zawierająca wyłącznie poprawne odpowiedzi,
- procent poprawnych zadań,
- średni czas obu typów pytań,
- historia do 100 treningów w `localStorage`,
- wykres trzech serii z dwiema osiami wartości,
- działanie z lokalnego `index.html` bez bibliotek zewnętrznych.

## Stabilne zachowania — nie zmieniać bez zgody

- zakres ćwiczeń wynosi 2–10,
- użytkownik może wybrać konkretne liczby albo wszystkie,
- sesja zawiera dokładnie 10 albo 20 pytań,
- połowa pytań jest zwykła, a połowa tekstowa,
- po pierwszym błędzie dostępna jest druga próba,
- zadanie zalicza się jako poprawne wyłącznie po poprawnej pierwszej odpowiedzi,
- poprawna odpowiedź za drugim razem jest liczona jako błędne zadanie i trafia do sekcji `Warto powtórzyć`,
- po drugim błędzie natychmiast pokazuje się prawidłową odpowiedź,
- po drugim błędzie przejście dalej jest możliwe dopiero po zatwierdzeniu przyciskiem `OK`,
- podsumowanie wymienia wszystkie zadania z błędną pierwszą próbą i pokazuje wyłącznie poprawne odpowiedzi, bez błędnych wpisów użytkownika,
- średni czas każdego typu pytań obejmuje wyłącznie zadania poprawne za pierwszym razem,
- jeśli nie ma poprawnej pierwszej odpowiedzi danego typu, jego średni czas ma wartość pustą i jest wyświetlany jako `–`,
- historia zawiera najwyżej 100 najnowszych treningów,
- aplikacja pozostaje statyczna i działa bez usług sieciowych,
- wykres pokazuje procenty na lewej osi i sekundy na prawej.

## Pliki stabilne — nie zmieniać bez zgody

- `index.html` — struktura ekranów i wymagane elementy interfejsu,
- `logic.js` — generator i reguły statystyk,
- `app.js` — przebieg treningu, zapis i wykres,
- `styles.css` — zatwierdzony kolorowy charakter wersji 1.

## Fragmenty/funkcje stabilne — nie zmieniać bez zgody

- `generateTasks()` — liczba i proporcje typów pytań,
- `summarizeResults()` — sposób liczenia skuteczności i czasu,
- `addHistoryEntry()` — limit 100 wpisów,
- klucz `multiplicationTrainer.history.v1` — format historii wersji 1.

## Pliki, które można zmieniać przy typowych poprawkach

- `README.md`,
- testy, jeżeli rozszerzają pokrycie bez zmiany kontraktu,
- teksty zadań w `TEXT_TEMPLATES`, jeżeli nadal są proste i jednoznaczne.

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
- [ ] trening 10-zadaniowy zawiera po 5 pytań obu typów,
- [ ] trening 20-zadaniowy działa również dla jednej tabliczki,
- [ ] druga błędna odpowiedź pokazuje wynik i przycisk `OK`,
- [ ] bez zatwierdzenia `OK` następne pytanie nie jest wyświetlane,
- [ ] Enter użyty do zatwierdzenia drugiej odpowiedzi nie aktywuje automatycznie przycisku `OK`,
- [ ] odpowiedź poprawna dopiero za drugim razem obniża procent poprawnych zadań,
- [ ] odpowiedź poprawna dopiero za drugim razem trafia do listy `Warto powtórzyć`,
- [ ] czasy zadań z błędną pierwszą próbą nie wpływają na średnie,
- [ ] brak poprawnej pierwszej odpowiedzi danego typu daje średni czas `–`,
- [ ] podsumowanie pokazuje błędne zadania i tylko ich poprawne odpowiedzi,
- [ ] podsumowanie nie pokazuje listy powtórkowej, jeśli wszystkie zadania były poprawne,
- [ ] podsumowanie pokazuje procent i oba czasy,
- [ ] zapisany zostaje najwyżej setny najnowszy trening,
- [ ] wykres ma trzy serie oraz dwie poprawnie opisane skale,
- [ ] konsola przeglądarki nie zawiera błędów,
- [ ] interfejs pozostaje czytelny na komputerze i telefonie.

## Otwarte problemy

- Brak synchronizacji historii między urządzeniami — celowo, ponieważ strona jest statyczna.
- Dane z `localStorage` znikną po wyczyszczeniu danych witryny.
- Przy jednym treningu wykres pokazuje punkty; linie stają się widoczne od drugiego treningu.
