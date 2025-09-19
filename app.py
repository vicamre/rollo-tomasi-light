import os
import json
import time
import random
import requests
from flask import Flask, render_template, request, jsonify, redirect, url_for
from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from io import BytesIO

# -----------------------------
# Konfig / sti-oppsett
# -----------------------------
load_dotenv()

# Hoved API-nøkkel for tekst-generering
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("Mangler OPENAI_API_KEY i .env-filen")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")
ASSETS_DIR = os.path.join(STATIC_DIR, "assets")
FONTS_DIR = os.path.join(ASSETS_DIR, "fonts")
QUOTES_DIR = os.path.join(STATIC_DIR, "quotes")

os.makedirs(QUOTES_DIR, exist_ok=True)

app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=STATIC_DIR)

# OpenAI-klient
text_client = OpenAI(api_key=OPENAI_API_KEY)

CONTEXT_PATH = os.path.join(BASE_DIR, "context.json")

# -----------------------------
# Hjelpefunksjoner
# -----------------------------
def load_context():
    with open(CONTEXT_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def text_wrap(text, font, max_width, draw=None):
    """Bryt tekst i linjer som passer gitt bredde."""
    if draw is None:
        draw = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    words = text.split()
    lines, line = [], ""
    for w in words:
        test = (line + " " + w).strip()
        wpx = draw.textlength(test, font=font)
        if wpx <= max_width:
            line = test
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines

def find_font(size=50):
    """Prøv prosjektfont, ellers system default."""
    candidates = [
        os.path.join(FONTS_DIR, "Bombshell-Script.otf"),
        os.path.join(FONTS_DIR, "NeueMachina-Ultrabold.otf"),
        os.path.join(FONTS_DIR, "Brooklyn-Bold.otf"),
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size=size)
            except Exception:
                pass
    return ImageFont.load_default()

def build_roast_system_prompt(context, target_key):
    targets = context.get("targets", {})
    target_desc = targets.get((target_key or "").lower(), "")
    
    persona = (
        "Du er en spydig men hyggelig kollega som forstår brukeren og alltid er på deres side. "
        "Du er litt sarkastisk og morsom, men fundamentalt snill og støttende. Du bekrefter "
        "brukerens frustrasjon med humor og kjærlighet - ikke ondskap. Hold det kort (1–3 setninger), "
        "vær spydig men artig. Dette gjøres med kjærlighet, ikke for å være slem."
    )
    
    if target_key and target_key.lower() == "victoria":
        persona += (
            " Når det gjelder Victoria (klippegeniet): Hun er SÅ flink at det er litt irriterende "
            "på en morsom måte. Folk blir 'sure' på henne fordi hun gjør alle andre til skamme - "
            "men med et smil, fordi hun faktisk er utrolig imponerende."
        )
    elif target_key and any(kanal in target_key.lower() for kanal in ['nrk', 'tv2', 'discovery', 'kanal']):
        persona += (
            " Når det gjelder TV-kanaler som gir avslag: De er IDIOTER med null smak! "
            "Fuck dem og deres dårlige dømmekraft. Brukerens sinne er helt rettferdig - "
            "de fortjener å få høre sannheten!"
        )
    elif target_key and 'verden' in target_key.lower():
        persona += (
            " Når det gjelder verden: Den ER totalt fucka! Alt er kaos, folk har null "
            "seiling-forståelse, TV-kanalene vet ikke hva god TV er, og alle burde "
            "spille mer golf i stedet for å være idioter. Brukerens sinne er helt rettferdig!"
        )
    elif target_desc:
        persona += f" Bruk denne konteksten: {target_desc}"
    
    return persona

def build_therapy_system_prompt(context, target_key):
    base = (
        "Du er Rollo Terapi - en absurd, uetisk men morsom AI-terapeut for et bohemsk produksjonsselskap. "
        "Du gir tørre, blaserte råd med underliggende omsorg. Du foreslår ofte absurde løsninger som "
        "seiling, golf, eller mikrodosering av MDMA. VIKTIG: Brukeren snakker OM personer/ting de er "
        "irriterte på - ikke som disse personene. Hvis de er irriterte på 'Thomas', så ER de ikke Thomas. "
        "Løsninger varierer etter situasjon - se spesialtilfeller nedenfor. Svar kort (1-4 setninger)."
    )
    
    targets = context.get("targets", {})
    general = context.get("general", {})
    
    base += f" Firmakontekst: {general.get('description', '')}"
    
    if target_key and target_key.lower() == "victoria":
        base += " Victoria (klippegeniet) er utrolig flink - så flink at det kan være litt overveldende for andre. Helt forståelig å føle seg litt i skyggen av henne. Løsninger: kaffe, seiling."
    elif target_key and any(kanal in target_key.lower() for kanal in ['nrk', 'tv2', 'discovery', 'kanal']):
        base += " TV-kanaler som gir avslag fortjener sinne! LØSNINGER: Ta molly og glem dem, dra på sjøen og seil bort frustrasjonen, eller skriv en skikkelig sint mail og fortell dem sannheten!"
    elif target_key and 'verden' in target_key.lower():
        base += " Verden ER totalt fucka! Folk har null seiling-forståelse, TV-kanalene er idioter som ikke vet hva god TV er. LØSNINGER: Dra på seiltur ASAP og kom deg unna kaoset, spill golf for å få ut frustrasjonen, eller ta MDMA og se det absurde i alt sammen. Eventuelt mikrodosering for perspektiv."
    elif target_key:
        tdesc = targets.get(target_key.lower(), "")
        if tdesc:
            base += f" Om {target_key}: {tdesc}. Løsninger: seiling, kaffe, eller litt avstand."
    
    return base

# -----------------------------
# Ruter – hovedsider
# -----------------------------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/frustrasjon")
def frustrasjon_utlop():
    """Hovedverktøyet - roast & terapi"""
    return render_template("frustrasjon.html")

@app.route("/nautilator")
def nautilator_page():
    return render_template("nautilator.html")

@app.route("/seil-thomas-hjem")
def seil_thomas_hjem():
    return render_template("seil-hjem.html")

@app.route("/seil-thomas-hjem-mobile")
def seil_thomas_hjem_mobile():
    """Seil Thomas til Dagslysfesten - Mobiloptimalisert versjon"""
    return render_template("seil-hjem-mobile.html")

@app.route("/tetris")
def tetris():
    return render_template("tetris.html")


@app.route("/ide-generator")
def ide_generator():
    return render_template("ide_generator.html")

@app.route("/musikk")
def musikk_page():
    return render_template("musikk.html")

@app.route("/rollo-visdom")
def rollo_visdom():
    """Rollo Tomasi læringslogg - 2 år med visdom"""
    return render_template("rollo_visdom.html")

@app.route("/magnus-hat-collector")
def magnus_hat_collector():
    """Magnus Hat Collector - spill hvor Magnus samler bøttehatter"""
    return render_template("magnus_hat_collector.html")

@app.route("/hvem-sa-det")
def hvem_sa_det():
    """Hvem Sa Det Quiz - gjett om Thomas eller Magnus sa det"""
    return render_template("hvem_sa_det.html")

@app.route("/simen-klikk-spill")
def simen_klikk_spill():
    """Simen skyter fakturaer - klikk på de fargerike sirkelene"""
    return render_template("simen_faktura_kast.html")

@app.route("/spill")
def spill_oversikt():
    """Spill-oversikt - alle spill samlet"""
    return render_template("spill_oversikt.html")

# -----------------------------
# API Endepunkter
# -----------------------------

# Roast & Therapy
@app.route("/get-roast")
def get_roast():
    target = request.args.get("target", "").strip().lower()
    if not target:
        return jsonify({"error": "Velg et mål først."}), 400

    context = load_context()
    system = build_roast_system_prompt(context, target)
    user_prompt = f"Brukeren er irritert på '{target}'. Skriv en kort, spydig men hyggelig kommentar som støtter brukeren og bekrefter at deres irritasjon er forståelig. Vær morsom og kjærlig, ikke slem. Maks 3 setninger."

    try:
        roast_comp = text_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=140,
            temperature=0.8,
        )
        roast = roast_comp.choices[0].message.content.strip()
    except Exception as e:
        roast = f"(Kunne ikke generere kommentar: {e})"

    therapy_sys = build_therapy_system_prompt(context, target)
    try:
        tcomp = text_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": therapy_sys},
                {"role": "user", "content": f"Brukeren er irritert på '{target}' (brukeren ER IKKE {target}). Gi en kort, støttende åpningslinje for terapi."},
            ],
            max_tokens=80,
            temperature=0.7,
        )
        initial = tcomp.choices[0].message.content.strip()
    except Exception:
        initial = "Hva tenker du om situasjonen? Jeg kan hjelpe."

    return jsonify({"roast": roast, "initialTherapyMessage": initial})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    history = data.get("history", [])
    target = (data.get("target") or "").lower()
    context = load_context()
    system = build_therapy_system_prompt(context, target)

    messages = [{"role": "system", "content": system}] + history
    try:
        comp = text_client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=220,
            temperature=0.7,
        )
        reply = comp.choices[0].message.content.strip()
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/nautilator", methods=["POST"])
def api_nautilator():
    data = request.get_json(force=True)
    tekst = data.get("tekst", "")
    
    if not tekst:
        return jsonify({"error": "Skriv inn tekst å oversette"}), 400
    
    try:
        prompt = f"Oversett til seilemetaforer: '{tekst}'"
        
        comp = text_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Du oversetter norsk til seilemetaforer og nautiske uttrykk. Gi BARE oversettelsen, ingen forklaring eller ekstra tekst. Eksempel: Input 'Jeg er forsinket' → Output 'Jeg seiler i motvind'"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.8,
        )
        oversatt = comp.choices[0].message.content.strip()
    except Exception as e:
        oversatt = f"Navigerer gjennom tekniske farvann... ({e})"
    
    return jsonify({"oversatt": oversatt})

@app.route("/api/openai-text", methods=["POST"])
def api_openai_text():
    data = request.get_json(force=True)
    prompt = data.get("prompt", "")
    
    if not prompt:
        return jsonify({"error": "Mangler prompt"}), 400
    
    try:
        comp = text_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.8,
        )
        return jsonify({"choices": [{"message": {"content": comp.choices[0].message.content}}]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/openai-image", methods=["POST"])
def api_openai_image():
    data = request.get_json(force=True)
    prompt = data.get("prompt", "")
    
    if not prompt:
        return jsonify({"error": "Mangler prompt"}), 400
    
    try:
        response = text_client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024",
            quality="standard"
        )
        return jsonify({"data": [{"url": response.data[0].url}]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_quote_image(background_url, quote_text):
    """Combine background image with quote text overlay"""
    
    try:
        print(f"Downloading background image from: {background_url}")
        # Download background image
        response = requests.get(background_url, timeout=30)
        response.raise_for_status()  # Raise exception for bad status codes
        
        print(f"Downloaded image, size: {len(response.content)} bytes")
        background = Image.open(BytesIO(response.content))
        
        # Resize to larger size
        background = background.resize((1200, 1200), Image.Resampling.LANCZOS)
        
        # Apply blur to background for better text readability
        background = background.filter(ImageFilter.GaussianBlur(radius=3))
        
        # Create drawing context
        draw = ImageDraw.Draw(background)
        
        # Try to load Times New Roman Bold Italic, fallback to default
        font_size = 120  # Much larger text
        font = None
        
        print("Trying to load Times New Roman Bold Italic...")
        # Try Times New Roman variations
        times_fonts = [
            "Times New Roman Bold Italic",
            "TimesNewRomanPS-BoldItalicMT", 
            "Times-BoldItalic",
            "/System/Library/Fonts/Times.ttc",
            "/Library/Fonts/Times New Roman Bold Italic.ttf"
        ]
        
        for font_name in times_fonts:
            try:
                print(f"Trying font: {font_name}")
                if font_name.startswith('/'):
                    # File path
                    if os.path.exists(font_name):
                        font = ImageFont.truetype(font_name, font_size)
                        print(f"Successfully loaded font: {font_name}")
                        break
                else:
                    # Font name
                    font = ImageFont.truetype(font_name, font_size)
                    print(f"Successfully loaded font: {font_name}")
                    break
            except Exception as e:
                print(f"Failed to load font {font_name}: {e}")
                continue
        
        # Fallback to default font if none worked
        if font is None:
            print("Using default font")
            try:
                font = ImageFont.load_default(size=font_size)
            except:
                font = ImageFont.load_default()
        
        # Wrap text to fit image width (larger image now)
        max_width = 1000  # Leave margins for larger text on 1200px image
        wrapped_lines = text_wrap(quote_text, font, max_width, draw)
        
        # Calculate total text height
        line_height = font_size + 30
        total_height = len(wrapped_lines) * line_height
        
        # Position text in center of larger image
        start_y = (1200 - total_height) // 2
        
        # Draw text with black shadow only (no background box)
        for i, line in enumerate(wrapped_lines):
            bbox = draw.textbbox((0, 0), line, font=font)
            text_width = bbox[2] - bbox[0]
            x = (1200 - text_width) // 2
            y = start_y + i * line_height
            
            # Draw multiple black shadows for better visibility
            shadow_offsets = [(6, 6), (4, 4), (2, 2)]
            for offset_x, offset_y in shadow_offsets:
                draw.text((x + offset_x, y + offset_y), line, font=font, fill=(0, 0, 0, 255))
            
            # Draw main white text
            draw.text((x, y), line, font=font, fill=(255, 255, 255, 255))
        
        # Save to quotes directory
        timestamp = int(time.time())
        filename = f"quote_{timestamp}.png"
        filepath = os.path.join(QUOTES_DIR, filename)
        
        print(f"Saving image to: {filepath}")
        background.save(filepath, "PNG", quality=95)
        print(f"Successfully saved image: {filename}")
        
        return filename
        
    except Exception as e:
        print(f"Error creating quote image: {e}")
        import traceback
        traceback.print_exc()
        return None

@app.route("/generate-image")
def generate_image():
    situation = request.args.get("target", "generelt sur")
    context = load_context()
    
    # Build context-aware prompt based on situation
    targets = context.get("targets", {})
    general = context.get("general", {})
    
    context_info = f"Firmakontekst: {general.get('description', '')}"
    
    # Add relevant person info if situation mentions them
    if "magnus" in situation.lower():
        context_info += f" Magnus: {targets.get('magnus', '')}"
    elif "simen" in situation.lower():
        context_info += f" Simen: {targets.get('simen', '')}"
    elif "thomas" in situation.lower():
        context_info += f" Thomas: {targets.get('thomas', '')}"
    elif "victoria" in situation.lower() or "klippegeni" in situation.lower():
        context_info += f" Victoria: {targets.get('victoria', '')}"
    
    # Generate motivational quote first
    try:
        # Build situation-specific context
        situation_context = ""
        if "kanal" in situation.lower():
            situation_context = "TV-kanaler som avviser prosjekter. Temaer: seiling som trøst, dop som løsning, å være over 50 og erfaren."
        elif "magnus" in situation.lower():
            situation_context = "Magnus med bøttehatt som krangler. Temaer: golf, seiling, å være over 50."
        elif "simen" in situation.lower():
            situation_context = "Simen som er gøyal og sier syke ting. Temaer: fakturaer, seiling, havet."
        elif "thomas" in situation.lower():
            situation_context = "Thomas som elsker seiling over alt. Temaer: 6 år rundt jorda, St. Hanshaugen, familie."
        elif "klippegeni" in situation.lower():
            situation_context = "Victoria, 24 år gammelt klippegeni. Temaer: AI, å være så heldig å ha henne, ungdom vs erfaring."
        elif "kaffe" in situation.lower():
            situation_context = "Kaffekrisen på kontoret. Temaer: seiling, dop som alternativ, Homansbyen."
        else:
            situation_context = "Generell kontorfrustrasjon. Temaer: seiling, havet, å være over 50, dop, klippegeniet."

        prompt = (
            f"Lag en absurd, kvasi-motiverende setning for situasjonen: '{situation}'. "
            f"Kontekst: {context_info} "
            f"Situasjon: {situation_context} "
            "Stil: 'Under tvil... seil' eller 'Hadde havet gitt opp? Nei.' eller 'Med litt dop... alt ordner seg.' "
            "1 kort setning, norsk, litt bitter men motiverende. Maks 50 tegn for stor tekst på plakat."
        )
        
        comp = text_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Du lager korte, absurde, kvasi-motiverende setninger basert på kontorlivssituasjoner."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=25,
            temperature=0.9,
        )
        quote = comp.choices[0].message.content.strip().strip('"').strip("'")
    except Exception:
        quote = "Under tvil... seil."
    
    # Generate varied background images based on situation
    try:
        import random
        background_options = [
            "A dramatic Norwegian fjord at sunset with steep mountains, golden light reflecting on calm water, cinematic mood, no text",
            "A sailing boat on stormy seas under dramatic cloudy sky, waves crashing, powerful ocean scene, cinematic lighting, no text", 
            "A peaceful harbor at dawn with sailboats, misty morning light, serene Norwegian coastal scene, inspiring mood, no text",
            "A majestic mountain peak reflected in still water, golden hour lighting, Norwegian wilderness, breathtaking vista, no text",
            "A golf course overlooking the ocean at sunset, rolling hills, dramatic sky, peaceful and inspiring scene, no text",
            "A cozy Norwegian cabin by a lake surrounded by forest, warm evening light, serene and motivational atmosphere, no text"
        ]
        
        # Add situation-specific backgrounds
        if "seiling" in situation.lower() or "thomas" in situation.lower():
            background_options.extend([
                "A sailboat cutting through blue ocean waves, white sails against dramatic sky, freedom and adventure, no text",
                "A yacht marina at golden hour, masts silhouetted against sunset, peaceful sailing atmosphere, no text"
            ])
        elif "golf" in situation.lower() or "magnus" in situation.lower():
            background_options.extend([
                "A pristine golf course with ocean view, rolling green hills, inspiring sports scene, no text",
                "A golf ball on tee with mountain backdrop, early morning mist, motivational sports setting, no text"
            ])
        elif "klippegeni" in situation.lower() or "victoria" in situation.lower():
            background_options.extend([
                "A modern creative workspace with large windows overlooking nature, inspiring work environment, no text",
                "A high-tech editing suite with mountain view, creative professional setting, motivational workspace, no text"
            ])
        
        background_prompt = random.choice(background_options)
        
        response = text_client.images.generate(
            model="dall-e-3",
            prompt=background_prompt,
            n=1,
            size="1024x1024",
            quality="standard"
        )
        
        background_url = response.data[0].url
        
        # Create combined image with quote overlay
        print(f"Creating quote image with text: {quote}")
        quote_filename = create_quote_image(background_url, quote)
        
        if quote_filename:
            quote_url = request.url_root + f"static/quotes/{quote_filename}"
            print(f"Success! Returning image URL: {quote_url}")
            return jsonify({
                "quote": quote,
                "image_url": quote_url
            })
        else:
            print("Failed to create quote image, falling back to background")
            # Fallback to original background
            return jsonify({
                "quote": quote,
                "image_url": background_url
            })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Main
# -----------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", "10000"))  # Render default port
    app.run(host="0.0.0.0", port=port, debug=False)
