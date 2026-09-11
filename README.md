# Tabliczka mnożenia

Kolorowa statyczna strona do ćwiczenia tabliczki mnożenia dla klas 2–4.

## Funkcje

- wybór tabliczek od 2 do 10 lub wszystkich naraz,
- trening 10- albo 20-zadaniowy,
- wyłącznie zwykłe działania matematyczne,
- dwie próby odpowiedzi; po drugim błędzie pokazanie wyniku i oczekiwanie na zatwierdzenie przyciskiem **OK**,
- końcowa lista błędnie wykonanych zadań zawierająca wyłącznie ich poprawne odpowiedzi,
- procent poprawnie rozwiązanych zadań,
- jeden średni czas rozwiązywania zadań,
- historia maksymalnie 100 ostatnich treningów w `localStorage`,
- wykres historii: skuteczność oraz średni czas,
- responsywny interfejs działający bez serwera i bez zależności zewnętrznych.

## Uruchomienie

Najprościej otworzyć plik `index.html` w przeglądarce.

Opcjonalnie można uruchomić lokalny serwer:

```bash
python3 -m http.server 8765
```

Następnie otworzyć:

```text
http://127.0.0.1:8765/
```

## Testy

Wymagany jest Node.js 18 lub nowszy:

```bash
npm test
```

albo bezpośrednio:

```bash
node --test tests/*.test.js
```

## Zasady statystyk

- Zadanie jest liczone jako poprawne tylko wtedy, gdy właściwa odpowiedź zostanie podana za pierwszym razem.
- Odpowiedź poprawna dopiero za drugim razem jest liczona jako błędne zadanie i trafia do sekcji **„Warto powtórzyć”**.
- Po drugiej błędnej próbie zadanie jest liczone jako niepoprawne, poprawna odpowiedź pojawia się natychmiast, a przejście dalej następuje dopiero po zatwierdzeniu przyciskiem **OK**.
- Podsumowanie wymienia wszystkie zadania, w których pierwsza próba była błędna, i pokazuje tylko ich poprawne odpowiedzi; błędne wpisy użytkownika nie są wyświetlane.
- Średni czas jest liczony wyłącznie z zadań rozwiązanych poprawnie za pierwszym razem. Zadania z błędną pierwszą próbą są całkowicie pomijane w średniej.
- Jeśli nie ma żadnego zadania poprawnego za pierwszym razem, średni czas jest wyświetlany jako `–`.
- Każdy trening składa się wyłącznie ze zwykłych działań.
- Wykres używa dwóch skal: procentów po lewej i sekund po prawej.

## Publikacja

Repozytorium GitHub:

```text
https://github.com/andromeda-benek/tabliczka-mnozenia
```

Publiczna strona:

```text
https://andromeda-benek.github.io/tabliczka-mnozenia/
```

GitHub Pages publikuje zawartość katalogu głównego gałęzi `main`. Plik `.nojekyll` wyłącza przetwarzanie Jekyll i powoduje bezpośrednie serwowanie statycznych plików.

## Dane

Historia pozostaje wyłącznie w pamięci danej przeglądarki. Strona niczego nie wysyła przez internet. Wyczyszczenie danych witryny w przeglądarce usuwa historię.
