#  blogMe
### Opis
Frontowa części aplikacji blogMe. Aplikacja docelowo ma być portalem społecznościowym.

### Planowana funkcjonalność - podstawa
- [x] System rejestracji i logowania
- [x] Pobieranie postów innych użytkowników
- [x] Tworzenie własnych postów
- [x] Usuwanie postów
- [x] Ocenianie postów
- [x] Komentowanie postów
- [x] Ocenianie komentarzy
- [x] Odpowiadanie na komentarze
- [ ] Konfiguracja profilu - avatar, szczegóły itp.
- [ ] Warstwa wizualna aplikacji
- [ ] RWD

### Planowana funkcjonalność - rozbudowa aplikacji
- [ ] Posty i komentarze wieloliniowe
- [ ] Wstawienie obrazu statycznego (jpg, png) lub gifu jako post lub komentarz
- [ ] Wstawienie filmu z pliku (mp4, mov) lub np. z YouTube jako post lub komentarz
- [ ] Lista zablokowanych i obserwowanych użytkowników
- [ ] Chat - prywatne rozmowy pomiędzy 2 użytkownikami
- [ ] Chat - wieloosobowe grupy
- [ ] Oznaczanie postów hashtagami
- [ ] Wyszukiwarka postów na podstawie hashtagów
- [ ] Grupy

## Zrobione
##### 28 marca 2021r.
* Przejście z poprzedniej wersji aplikacji postawionej na Firebase.
* Utworzenie bazy danych w MongoDB.
* Postawienie serwera
* Utworzenie mechanizmu pobrania postów
* Utworzenie mechanizmu rejestracji i logowania

##### 10 kwietnia 2021r.
* Przebudowanie aplikacji z rozdzieleniem komentarzy do osobnej tabeli
* Dodanie możliwości minusowania postów
* Dodanie możliwości plusowania i minusowania komentarzy
* Dadanie mechanizmu odpowiadania na komentarze

##### 20 lipca 2021r
* Przeniesienie aplikacji na serwer produkcyjny blogme.pl

##### 21 lipca 2021r
* Pełne ostylowanie menu głównego
* Button hamburger do menu głównego na mobile

##### 22 lipca 2021r
* Dalsze prace przy menu głównym - dodanie wielopoziomowego menu na mobile
* Przebudowanie menu głównego, przypięcie go do górnej krawędzi ekranu
* Wykonanie ołówka jako wyświetlacz do ładowania postów
* Wstępna zmiana stylowania postów

##### 25 lipca 2021r
* Przebudowa menu i dopasowanie wyglądu menu drugiego poziomu do desktop

##### 27 lipca 2021r
* Dodano stronę logowania i rejestracji
* Stworzenie formularza logowania i rejestracji, podstawowe style i skrypty

##### 4 sierpnia 2021r
* Dalsze stylowanie formularzy (skończenie poza checkboxem)
* Mechanizm rejestracji

##### 5 sierpnia 2021r
* Mechanizm logowania
* Usunięcie błędu serwera związanego z SECRET_KEY

##### 8 sierpnia 2021r
* Usunięto błąd z przekierowaniem po zalogowaniu lub rejestracji
* Dodano całkowity mechanizm rejestracji i logowania łącznie z zapamiętaniem sesji

##### 9 sierpnia 2021r
* Wstępne ostylowanie postów
* Komponent dodawania posta
* Prototyp możliwości dodawania postów

##### 10 sierpnia 2021r
* Poprawienie działania JS - dodanie reloadingu strony przy logowaniu / rejestracji / wylogowaniu
* Dodawanie posta bez przeładowania strony
* Parsowanie HTML w postach

##### 12 sierpnia 2021r
* Dodanie ikonek plusowania i minusowania postów
* Dodanie linku do komentarzy tj. pojedynczego posta

##### 22 sierpnia 2021r
* Dodanie funkcjonalności plusowania i minusowania
* Dodanie ikonek FontAwesome
* Przycisk usunięcia postu z funkcjonalnością
* Osobna strona dla każdego posta

##### 29 sierpnia 2021r
* Poprawienie usuwania postów - confirm
* Dodanie wyświetlania komentarzy
* Pisanie nowych komentarzy i ocenianie
* Kolory dla własnych postów lub komentarzy oraz brak możliwości oceniania własnych postów lub komentarzy