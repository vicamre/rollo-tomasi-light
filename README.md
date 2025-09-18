# 🌊 Rollo Tomasi Light

En forenklet versjon av Rollo Tomasi-plattformen med fokus på de viktigste funksjonene.

## 🎯 Inkluderte funksjoner

### 🛠️ Verktøy
- **Frustrasjonsutløp** - Roast & terapi med Rollo Sekretær
- **Nautilator** - Oversett til seilemetaforer
- **Motivasjonsplakater** - Absurde, kvasi-motiverende setninger

### 🎮 Spill
- **Seil Thomas hjem** - Naviger gjennom fjordene
- **Bölger av Mot Tetris** - Maritime Tetris med GGR 2026-tema

## 🚀 Hvordan starte

1. **Installer avhengigheter:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Legg til .env-fil:**
   ```
   OPENAI_API_KEY=din_api_nøkkel_her
   ```

3. **Start serveren:**
   ```bash
   python app.py
   ```

4. **Åpne i nettleser:**
   ```
   http://localhost:8001
   ```

## 📁 Mappestruktur

```
rollo-light/
├── app.py                 # Forenklet Flask-app
├── context.json          # Kontekst for AI
├── requirements.txt      # Python-avhengigheter
├── templates/           # HTML-templates
│   ├── index.html       # Hovedside
│   ├── frustrasjon.html # Frustrasjonsutløp
│   ├── nautilator.html  # Seilemetafor-oversetter
│   ├── motivasjon.html  # Motivasjonsplakater
│   ├── seil-hjem.html   # Thomas-spill
│   └── tetris.html      # Tetris-spill
└── static/              # Statiske filer
    ├── style.css        # Hovedstil
    ├── tetris.js        # Tetris-spillogikk
    └── assets/          # Bilder og fonter
```

## 🎨 Designfilosofi

- **Minimalistisk** - Kun det viktigste
- **Maritim** - Bölger, blått og nautiske tema
- **Responsiv** - Fungerer på alle enheter
- **Rask** - Optimalisert for hastighet

## ⚡ Forskjeller fra hovedversjonen

**Fjernet:**
- Butikk/store
- Escape-spill
- Kast Simen-spill
- Darts-spill
- Rage clicker
- Klagebrev-generator
- Ide-generator
- Unnskyldning-generator
- Orakel
- Site-wide chat
- Video-bakgrunner
- Komplekse animasjoner

**Beholdt:**
- Alle AI-funksjoner
- Maritime tema
- Responsive design
- Tetris og Seil Thomas-spill
- Nautilator og motivasjon

## 🔧 Teknisk

- **Port:** 8001 (vs 8000 for hovedversjon)
- **Framework:** Flask
- **AI:** OpenAI GPT-4o
- **Frontend:** Vanilla JS + CSS
- **Styling:** Custom CSS med maritime tema

## 📊 Ytelse

- **Raskere oppstart** - Færre filer å laste
- **Mindre minnebruk** - Kun essensielle assets
- **Enklere navigasjon** - Alt på ett sted
- **Fokusert opplevelse** - Ingen distraksjoner

---

*Light-versjonen av Rollo Tomasi - alt du trenger, ingenting du ikke trenger! 🌊*
