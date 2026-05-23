# Trivia Question Generator

Interaktywny generator pytań do gry Trivia, zintegrowany z modelami językowymi (LLM) za pomocą API (OpenRouter, OpenAI, LM Studio, Ollama). Aplikacja jest przeznaczona dla ekranów tabletów (np. iPad) i komputerów jako pomocnik w rozgrywkach Trivia.

## Główne Funkcje
- **Integracja LLM**: Automatyczne pobieranie modeli i generowanie unikalnych pytań zamkniętych w czasie rzeczywistym z podziałem na kategorie tematyczne.
- **Asystent Gry**:
  - Wbudowany timer z możliwością regulacji czasu (+/- 10s).
  - Wirtualna kostka do losowania kategorii.
  - Panel zarządzania graczami (zbieranie kolorowych klinów/trójkątów, odliczanie punktów do 0 lub wyścig punktowy).
- **Lokalna Pamięć (Cache)**: Automatyczne zapamiętywanie zadanych pytań (wykluczenie powtórzeń) oraz buforowanie (cache) wygenerowanych tematów (blueprints) w `localStorage`.
- **Wielojęzyczność**: Wsparcie dla języka polskiego 🇵🇱 oraz angielskiego 🇬🇧.

## Struktura Repozytorium
- `index.html` – główny szablon HTML aplikacji.
- `css/style.css` – arkusz stylów CSS.
- `js/app.js` – logika aplikacji w czystym JavaScript.
- `LICENSE` – licencja projektu.

## Jak Uruchomić Lokalnie
1. Sklonuj to repozytorium.
2. Otwórz plik `index.html` w dowolnej przeglądarce internetowej.

## Hostowanie na GitHub Pages
Projekt jest w pełni statyczny i gotowy do bezpośredniego hostowania na GitHub Pages:
1. Wejdź w ustawienia swojego repozytorium na GitHub (**Settings**).
2. Przejdź do zakładki **Pages** w sekcji po lewej stronie.
3. W sekcji **Build and deployment** wybierz źródło: `Deploy from a branch`.
4. Wybierz gałąź (np. `main` lub `master`) oraz katalog `/ (root)`.
5. Kliknij **Save**. Po kilku minutach Twoja gra będzie dostępna pod adresem `https://<twój-login>.github.io/<nazwa-repozytorium>/`.
