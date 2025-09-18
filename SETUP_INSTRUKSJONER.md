# 🌊 Rollo Tomasi Light - Oppsettsinstruksjoner

## ✅ Status: KLAR TIL BRUK!

Rollo Light er nå satt opp og kjører på **http://localhost:8080**

## 🚀 Hvordan starte serveren

### Alternativ 1: Bruk start_server.py (anbefalt)
```bash
cd "/Volumes/Syntax 01 (MacOS)/1 Prosjekter/humor/rollo-tomasi/rollo-irritert-generator/rollo-light"
python3 start_server.py
```

### Alternativ 2: Bruk app.py direkte
```bash
cd "/Volumes/Syntax 01 (MacOS)/1 Prosjekter/humor/rollo-tomasi/rollo-irritert-generator/rollo-light"
python3 app.py
```

## 🔑 Viktig: OpenAI API-nøkkel

For at AI-funksjonene skal fungere, må du legge til din OpenAI API-nøkkel:

1. Opprett en `.env` fil i rollo-light mappen
2. Legg til følgende innhold:
```
OPENAI_API_KEY=din_openai_api_nøkkel_her
PORT=8080
```

## 🎯 Funksjoner som fungerer

### ✅ Fungerer uten API-nøkkel:
- Hovedsiden (index.html)
- Seil Thomas hjem spillet
- Bölger av Mot Tetris
- Grunnleggende navigasjon

### 🔑 Krever OpenAI API-nøkkel:
- **Frustrasjonsutløp** - AI roast & terapi
- **Nautilator** - Oversettelse til seilemetaforer
- **Motivasjonsplakater** - AI-genererte absurde motivasjonssetninger

## 📁 Mappestruktur

```
rollo-light/
├── app.py                 # Hovedapplikasjon
├── start_server.py        # Server starter
├── requirements.txt       # Python avhengigheter
├── context.json          # AI-kontekst for personene
├── templates/            # HTML-templates
│   ├── index.html        # Hovedside ✅
│   ├── frustrasjon.html  # Frustrasjonsutløp ✅
│   ├── nautilator.html   # Seilemetafor-oversetter ✅
│   ├── motivasjon.html   # Motivasjonsplakater ✅
│   ├── seil-hjem.html    # Thomas-spill ✅
│   └── tetris.html       # Tetris-spill ✅
└── static/               # Statiske filer (CSS, JS, bilder)
    ├── style.css         # Hovedstil ✅
    ├── tetris.js         # Tetris-spillogikk ✅
    └── assets/           # Bilder og fonter ✅
```

## 🌊 Design og tema

- **Maritim stil** - Blå farger, bølgemønstre, nautiske ikoner
- **Glass morphism** - Gjennomsiktige kort med blur-effekter
- **Responsiv** - Fungerer på desktop og mobil
- **Animasjoner** - Subtile hover-effekter og bölgeanimasjoner

## 🎮 Spill

### Seil Thomas hjem
- Flappy Bird-style spill med Thomas som må navigere gjennom skjær
- Samle power-ups fra teamet (Red Bull, Magnus' bøttehatt, etc.)
- Skyt piler på Simen og Magnus for ekstra poeng

### Bölger av Mot Tetris
- Tetris med GGR 2026-tema
- Hver blokk representerer episoder fra pilot-prosjektet
- Maritime farger og musikk

## 🔧 Feilsøking

### Server starter ikke:
- Sjekk at du er i riktig mappe
- Sjekk at Python 3 er installert: `python3 --version`
- Installer avhengigheter: `pip3 install -r requirements.txt`

### AI-funksjoner fungerer ikke:
- Sjekk at `.env` filen eksisterer og inneholder gyldig OpenAI API-nøkkel
- Sjekk konsollen for feilmeldinger

### Port 8080 er opptatt:
- Endre PORT i `.env` til en annen port (f.eks. 8081)
- Eller stopp andre tjenester som bruker port 8080

## 📊 Forskjeller fra hovedversjonen

**Fjernet for enklere vedlikehold:**
- Butikk/store funksjonalitet
- Komplekse spill (escape, kast simen, darts, rage clicker)
- Site-wide chat
- Video-bakgrunner
- Klagebrev og ide-generatorer

**Beholdt og forbedret:**
- Alle AI-funksjoner (roast, terapi, nautilator, motivasjon)
- Maritime tema og design
- Tetris og Seil Thomas spill
- Responsiv design

---

**🎉 Rollo Tomasi Light er klar til bruk! Åpne http://localhost:8080 i nettleseren din.**
