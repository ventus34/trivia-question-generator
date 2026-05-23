# Trivia Question Generator

An interactive Trivia question generator integrated with Large Language Models (LLMs) via APIs (OpenRouter, OpenAI, LM Studio, Ollama). The application is designed for tablet screens (e.g., iPad) and desktop computers, serving as an assistant for Trivia games.

## Key Features
- **LLM Integration**: Automatic model list retrieval and real-time generation of unique multiple-choice questions categorized by topic.
- **Game Assistant**:
  - Built-in timer with adjustable duration (+/- 10s).
  - Virtual dice for category selection.
  - Player management panel (collecting colored wedges/triangles, countdown of points to 0, or a points race).
- **Local Storage (Cache)**: Automatic tracking of asked questions (to prevent duplicates) and caching of generated topic blueprints in `localStorage`.
- **Multilingual Support**: Supports Polish 🇵🇱 and English 🇬🇧.

## Repository Structure
- `index.html` – the main HTML template of the application.
- `css/style.css` – CSS stylesheet.
- `js/app.js` – application logic in vanilla JavaScript.
- `LICENSE` – project license.

## How to Run Locally
1. Clone this repository.
2. Open `index.html` in any web browser.
