// ===================================================================================
// KONFIGURASJON OG GLOBALE VARIABLER
// ===================================================================================
const correctPassword = "123";
let currentIde = { tittel: null, logline: null };

// FIX: Definer OPENAI_API_KEY fra config.js!
const OPENAI_API_KEY = window.API_CONFIG.openai[0]; // Bruker første nøkkel

// ===================================================================================
// DATA (Dine originale lister med ord og fraser)
// ===================================================================================

const data = {
    steder: ["i Oslofjorden", "på Tikopia", "på St.Hanshaugen", "på Hitra", "på Josefines Gate 26", "på BLÅ", "på Westerdals", "på Bislett", "på klipperommet", "i tredjeetasje", "på seilbåten til Thomas", "på kontoret", "i Trøndelag", "i kjelleren", "på havet", "ett eller annet sted i Stillehavet", "på en båt",  "på en båt uten seil", "på sopptur", "på bærtur", "i kø hos dealern", "på Nesodden", "i DITT personlige helvete", "på sommerfest", "i en tidsmaskin", "på månen", "i en ubåt", "på kysten", "på atlanterhavet", "på skråplanet", "på tantra kurs i Østfold", "på russetreff", "på swingersklubb", "på rave", "i boden bak Rema"],
    stednavn: ["Oslofjorden", "Tikopia", "St. Hanshaugen", "Hitra", "Josefines Gate", "Oslo", "BLÅ", "klipperommet", "tredjeetasje", "kontoret", "Trøndelag", "kjelleren", "havet", "Travellers Club", "Nordkapp", "kysten", "båt", "Tøyen", "Nord-Norge", "månen", "ubåt", "atlanterhavet", "skråplanet", "hjemme hos Magnus", "tantra kurs i Østfold"],
    folk: ["Alex Rosén", "klippegeniet", "Victoria", "Thomas", "Simen", "Magnus", "Lars Nilssen", "Vegar", "Kjetil", "en kreativ produsent", "sjefen av kaos", "Erling","en lei regissør", "menn godt over 50", "Kjetil på mollyrus", "Nils Larssen", "drugdealer",  "noen fra Drammen", "en grevling", "alle på Rollo Tomasi", "en stressa Simen", "din største fiende", "en dritings nordlending", "en halvpolakk","fallskjerm fyr", "båt-Thomas", "kontorfellesskapet", "Magnus med bøttehatt", "en eks du ikke husker navnet på", "en kvinne med rullator og attitude",  "en sexolog", "en sadistisk rideinstruktør", "en gledesdreper", "en kåt håndtverker", "en incel"],
    følelse: ["kåt", "spent", "skremt", "panisk", "fyllesyk", "sulten", "grinete", "sjokkert", "sentimental", "tilfreds", "inspirert", "trigga", "dødslei", "rastløs", "ellevill", "kokt", "forvirra", "følelsesløs", "trigger happy"],
    mer: ["mer kaos", "mer menn over 50", "mer søppel", "flere narkomane", "gøyere fester", "hardere dop", "flere bøttehatter", "mer forvirring", "flere problemer", "mer drama", "mer hemmeligheter", "større konsekvenser", "mindre klær", "mindre tid til å angre", "større risiko", "flere dårlig unnskyldninger", "mindre selvinnsikt", "hardere straff", "mindre moral",  "mindre moral", "mer offentlig ydmykelse"],
    start: ["begynnelsen", "første kapittel", "åpningen til romanen", "en uventet vending i en tilsynelatende vanlig dag", "det første kapittelet i en uforutsigbar reise", "det første tegn på noe langt mer alvorlig", "en tirsdag"],
    tid: ["på en blåmandag", "på en rød dag", "midt på natta", "på en fredag", "i en hvit uke", "etter leggetid", "etter midnatt", "til lunsj", "etter lunsj", "før riter", "før fest", "på fredagspils", "på tirsdag etter båttur", "under russetoget", "før første linje", "under budsjettmøte", "etter tredje pils",],
    tiduten: ["nå", "blåmandag", "rød dag", "fredag", "hvit uke", "leggetid", "lunsj", "yoga", "riter", "fylla", "fredagspils"],
    kort: ["kaos", "kos", "bråk", "fred", "støy", "rot", "moro", "styr", "lykke", "krig", "spenning", "fryd", "latter", "vondt", "sjokk", "mystikk"],
    verb_ing: ["stripping", "drikking",  "snakking", "klipping", "prokrastinering", "strikking", "seiling", "snusing", "rulling", "gråting", "kjøring", "snorting", "blåsing", "røyking", "klasking", "chugging", "jobbing", "smisking", "lurking", "stalking", "overtenning", "feiring"],
    prøver: ["prøver å prate med", "prøver å ligge med", "prøver å ruse seg på", "prøver å lære", "prøver å forstå", "prøver å ta livet av", "prøver å forføre", "prøver å komme seg til",  "prøver å stjele fra", "prøver å slå opp med", "prøver å unngå", "prøver å kidnappe", "prøver å psykoanalysere", "prøver å avsløre", "prøver å imponere", "prøver å snorte", "prøver å si nei til", "prøver å tolke",  "prøver å selge", "prøver å få orgasme av", "prøver å leke med", "prøver å sette fyr på"],
    verb_å: ["å lyve", "å drikke", "å le på feil tidspunkt", "å smake", "å ligge", "å sniffe", "å ta på", "å skrike", "å stjele", "å angre", "å forføre", "å skade", "å svindle", "å spille offer"],
    går: ["går galt", "går til helvete", "går overraskende bra", "går dårlig", "går helt midt på treet", "går inn i veggen", "går som en drøm", "går skikkelig på tryne", "går i dass", "går fra null til katastrofe på ett sekund", "går som en brusflaske i fryseren", "går over alle grenser", "går til gruppechatten", "går over til grining", "går opp i røyk"],
    ting: ["hav", "minehund", "problemer med dropbox", "voiceover", "litt knark", "en bøtte", "en post-it lapp", "en bok om riter", "workshop", "en torsk", "gruppechat", "grovklipp", "chat GPT", "riter", "rustur på båt", "deLillos", "vind", "hjemmebrent", "en bitteliten hvit pose", "pisk", "håndjern", "gavekort på kondomeriet", "brennmanet", "redbull", "panikk-klipp", "bøttehatt", "cola", "pilot", "kinky emojis", "nippel", "passiv aggresivt dickpic", "NRK", "fredagspils", "midtlivskrise", "dokumentar", "båt", "fylleangst", "kondom", "kaffe", "en liten valium", "proxyfil", "fernet", "sammenbrudd", "kontorstol", "seil", "spinnhakker", "nachspiel", "nitrogen", "paddling", "h264", "pilot versjon nr47", "mappestruktur", "dokumentkaos", "sinte mail", "harddisk", "premiere pro", "hvilepuls", "en kortfilm", "langhelg"],
    dop: ["MDMA", "hasj", "snus", "kokain", "dop", "amfetamin", "attentin", "en liten valium", "ecstasy", "fleinsopp", "snø", "knark", "en pille", "ketamin", "LSD", "cola", "weed", "bensin", "speed", "tequila", "hjemmebrent", "ayahuasca", "hjemmebrent", "ekstra sterk snus", "fermentert juice", "salmiakk", "en joint"],
    adjektiv: ["klippemagisk", "psykoaktiv", "turbulent", "magisk", "psykedelisk", "flytende", "ekstremt", "stormfull", "slitsom", "brennende", "fjerne", "hemmelig", "mistenkelig", "sexy", "abnorm", "deilig", "filosofisk", "grafisk", "høy", "fristende", "full", "kaotisk", "mørk", "eksplosiv", "mystisk", "usammenhengende", "intens", "fascinerende", "domminerende", "strategisk", "forstyrrende", "intim", "grenseløs", "panikkfylt", "skinnende", "berusende", "episk", "hypnotisk", "opphissende", "sjokkerende", "irriterende", "gripende", "farlig", "dristig", "drøy", "skandaløs", "beruset", "dødsrusa", "kanakkas", "sjængala bængala", "fjern", "kartdum", "dummere", "bøttehattete", "absurdistisk", "delulu", "bakvendt", "kokain-aktig", "hallusinerende", "kortfilm-aktig", "selvdestruktiv", "manisk", "desperat", "ustabil", "woke", "bakfull", "besatt", "overdreven", "håpløs", "overtent"],
    adjektivT: ["ekstremt", "slitsomt", "raskt", "stramt", "abnormt", "høyt", "flaut", "teit", "mørkt", "eksplosivt", "intenst", "undertrykt", "intimt", "grenseløst", "drøyt", "skandaløst"],
    verb: ["dropper lunsj", "er overklokka på molly", "går hjem før 16", "tar dop på en seilbåt", "bruker chat GPT til alt", "klipper", "stripper", "drikker hjemmebrent", "føler mest", "gråter i E-moll", "sender flaskepost", "snorter", "krangler med NRK", "lager kunst av kaos", "ruller på bølgene", "kaster bort tid", "fører sin egen dans", "stjal din SSD", "flyr på rus", "løper på impulser", "eksporterer stress", "dreper framerate med en fiskestang", "ignorerer e-poster", "lager en båt av forvirring", "tar molly", "sender sint mail", "dropper alt og seiler", "snurrer på stolen", "chugger øl", "går i terapi", "finner nye måter å være lat på", "tar en pause fra pausen", "klager", "surrer", "ler på feil tidspunkt", "tenker på seiling", "kaster bort tid som om det er gratis", "baker kake på amfetamin", "deler ut dårlige råd på TikTok", "skriver dikt til OnlyFans", "vurderer å bli revisor", "drar på gruppesex og glemmer hvem som var med", "ligger med en båt fordi ingen andre vil", "vinner VM i prokrastinering", "sier det ordner seg til alt", "går med string truse", "sniffer kokain", "gråter men på en sexy måte", "skriker på Simen", "tenker bare på Victoria", "drikker sprit", "dør innvendig", "tenker på klippen", "venter på pilot versjon 132", "sykler uten hjelm", "kaller yoga for riter", "venter på båten", "vurderer å slutte i filmbransjen", "panikk-klipper", "paddler", "synger en Marcus og Martinus sang", "tenker på sin storhetsstid", "tenker på Magnus", "har en samtale med havet", "danser tango alene", "starter podcast", "koker egg", "vil ligge med klippegeniet"],
    verb2: ["drikke hjemmebrent", "klippe pilot", "strippe litt", "føle noe", "sende flaskepost", "snorte", "rulle på bølgene", "løpe fra ansvar", "ta sopp", "se på dokumentar", "sende sint mail", "gråte til heismusikk", "våkne på gulvet etter wrapfest", "skylde på produksjonsassistenten", "tolke egne traumer", "skrive søknad til Viken under påvirkning", "bestille båt via fiken", "glemme å lagre – igjen", "sponse egen rus med faktura", "forsvare dårlig fargekorreksjon med filosofi", "skrive voiceover som ingen forstår", "kaste bort tid", "fly på rus", "løpe på impulser", "eksportere stress", "ignorere e-poster", "lage en båt av forvirring", "ta molly", "skyve bort virkeligheten", "feste for mye", "brenne seg på røyken", "klage på været", "droppe alt og seile", "snurre på stolen", "yoga", "chugge øl", "finne nye måter å være lat på", "klage", "surre", "le på feil tidspunkt", "tenke på seiling", "kaste bort tid som om det er gratis", "koke egg", "vente på båten", "vurdere å slutte i filmbransjen", "sniffe kokain", "gråte men på en sexy måte", "skrike til Simen", "tenke kun på Victoria", "å kalle yoga for riter", "paddle", "tenke på sin storhetsstid", "ha en samtale med havet", "danse tango alene", "starte podcast"]
};

// ===================================================================================
// === DIN ORIGINALE PROMPT-STRUKTUR, RESTAURERT OG FORBEDRET ===
// ===================================================================================

const prompts = {
    reality: { // Tidligere 'workplace'
        titler: [
            "En lang zoom inn på {stednavn} – {folk} {verb} etter {dop}.",
            "{folk} og {folk2} forsøker å {verb2}. 96 timer med seiledokumentar fra {steder}.",
            "{folk} på {dop} – 12 timer uavbrutt.",
            "En vanlig dag {steder} med {folk} – helt {adjektiv} og uforutsigbart.",
            "Kreativ produsent {verb} etter {ting}. Hva skjer?",
            "{ting}-kaos for {folk} men det er bare {start}.",
            "En dag {steder} – {folk} prøver å finne ut hva {ting} egentlig betyr, men {verb} ved et uhell.",
            "{folk} og {folk2} snakker om {ting} og ikke minst {dop}.",
            "Kaffepause blir til krise – {folk} søker etter {ting}, men finner bare {mer}.",
            "Alt {går} når {ting} møter {folk}.",
            "{kort} {steder} – {folk} prøver å holde hodet kaldt mens {adjektiv} {ting} skjer.",
            "Livet med en {adjektiv} {folk} som alltid {verb} og later som ingenting",
            "Den store konkurransen: {folk} og {folk2} konkurrerer om å {verb2}",
            "Alt kan gå galt {steder}, men {folk} insisterer på å fikse {ting} selv.",
            "{ting} møter {ting2}: {folk} prøver å overleve arbeidsdagen, men {ting3} nekter å fungere.",
            "Keeping up with {folk} - en absurd overlevelsesdokumentar",
            "Ingen vet hva som skjer {steder} ..eller?",
            "Livet på kontoret: {folk} finner ut at {ting} og {ting2} ikke er det samme",
            "Bli med {folk} på jobb til {stednavn}! Men de vil bare {verb2}?!",
            "Følg med når {folk} {verb} igjen og igjen",
            "Kreativ produsent har sammenbrudd etter nye problemer med {ting}.",
            "Møte med {folk}, {ting}, {dop} og selvinnsikt.",
            "{folk} har gått seg vill {steder} – og dessverre så venter {folk2} med {ting}.",
            "Etter for mye {dop} føler {folk} seg {følelse} og en {adjektiv} {tiduten} venter.",
            "Oppdrag: Finn {ting}! {folk} og {folk2} tar saken.",
        ],
        loglines: [
            "{folk} {prøver} {ting} før fristen, men {folk2} {verb}.",
            "Det er alltid {mer} {steder} enn {folk} tror.",
            "På innsiden av {stednavn}: Møtet som ble til en krise – {folk} og {folk2} snakker om {ting}, men ingen får det til å funke.",
            "Lunsjen utarter seg til kritikk av {ting} og {ting2}. Ingen får egentlig {verb2}.",
            "Mandagsmøte starter med at noen {verb} og at {folk} prøver å finne ut av {ting}, mens {folk2} søker etter den siste versjonen av {ting2} ",
            "{folk} har sammenbrudd {tid} på grunn av {ting} - men i det minste er det bare {start}.",
            "Gruppechatten til {folk} og {folk2} er i full panikk – de {verb} og prøver å rydde opp i {ting} mens {folk3} har gått på en overdose med {dop}",
            "{folk} og {folk2} finner endelig {ting} – men de blir distrahert av {ting2}!",
            "{folk} har sammenbrudd {tid}, men i det minste har de {ting} og {dop} til å redde dagen.",
            "Dagen er over, men {folk} har ikke gjort noe – i mellomtiden har {folk2} gått på et {adjektiv} eventyr og prøver å redde dem med {ting}.",
            "{folk} og {folk2} prøver å overleve arbeidsdagen, men ingen har fått til {ting} og alt er {adjektiv}.",
            "Klarer {folk} å redde {ting} {steder}? De fleste driver å {verb} men kaoset er langt fra over.",
            "Følg med når {folk} endelig møter {folk2} etter 20 år og stemninger blir {adjektiv}. Flaks at {folk3} redder dagen med {ting}.",
            "Er det en løsning på {ting}? {folk} prøver å finne det ut, men alt blir mer {adjektiv} enn de trodde når {folk2} {verb}.",
        ]
    },
    dokumentar: { // Tidligere 'reise'
        titler: [
            "{folk} {verb} – live {steder}.",
            "Ingenting skjer før {dop}.",
            "Sakte bilder av {ting} {steder} – i en {adjektiv} tilstand.",
            "Endelig en pause fra {ting}.",
            "{folk} på ekspedisjon med {ting} og for mye {dop}.",
            "{folk} reiser fra {stednavn} til {stednavn2} – letende etter {ting} i en verden av {adjektiv} {kort}.",
            "Fra {stednavn} til {stednavn2} – med {dop} - {folk} og {ting}.",
            "Victoria og {folk} leter etter {ting} {steder}.",
            "Det startet som en seiledokumentar, det endte som {adjektiv} {ting2}.",
            "{verb_å} {folk} - en {adjektiv} dokumentar.",
            "{verb2}: et eksistensielt studie.",
            "Brennpunkt: livet med {adjektiv} {ting}",
            "Livet {steder} – {folk} {prøver} {ting}, men finner seg selv i nærheten av {folk2}.",
            "Båtreise uten {folk}, men med {ting}.",
            "{ting} og {folk} på villspor!",
            "{folk} på sporet av den tapte pdf og hvor er egentlig min {ting}?",
            "Rollo Tomasi: {adjektiv} eller {adjektivT} - Victoria undersøker",
            "Flaskepost fra havet sesong 4: {mer} og alt blir {adjektivT}",
            "NRK {verb} {steder} med {folk}.",
            "Fest {steder}: Alle {prøver} {ting}",
        ],
        loglines: [
            "På veien fra {stednavn} til {stednavn2} møter {folk} alt fra {ting} til {ting2}. Det blir mer {dop} enn forventet.",
            "En reise i slow motion – {folk} mister {dop} over {ting}, men finner meningen med {ting2} {steder}.",
            "Ferden går over {stednavn} og {stednavn2}, med et uventet stopp for å {verb2} {steder}.",
            "Det startet med en sterk drøm om {ting}, men endte i {ting2} og {folk}",
            "{ting}, {folk} og {ting2} – alle veier fører til {stednavn}.",
            "Alt begynte med en idé om {ting}, men endte opp med {folk} som {verb} {steder}.",
            "Hva skjer når {folk} mister {ting}? Det er {mer} enn de trodde, og alt handler om å finne {dop}.",
            "{folk} er ute {steder} på jakt etter {ting} for å bruke som {dop}, men ender {sted2}.",
            "Et eventyr med {mer} og mer screentime for {folk} enn handling.. og {folk2} vet hvem som {verb}.",
            "{folk} glemmer {ting} og finner på selv. Det handler om {ting2}, å {verb2} og et vindkast som nesten blåser {folk2} av gårde.",
        ]
    },
    kunstfilm: { // Tidligere 'poetisk'
        titler: [
            "Barndommens stemmer fra {stednavn}.",
            "Det er alltid mer {dop} bak horisonten.",
            "{ting} og minner. Det blir ganske {adjektiv} til slutt.",
            "En natt {steder}, {folk} finner seg selv i en tåke av {ting}.",
            "Fra {stednavn} til {stednavn2}: {folk} ser men {ting} er bare en drøm.",
            "Stjernene vi ser her {steder} – når vinden stiller.",
            "Vinden som bærer {ting} – et eventyr i stillhet.",
            "L'ombre des souvenirs - {steder}",
            "{folk} trouvent le silence.",
            "L'eau {steder}",
            "Stille natt {steder} – {folk} finner seg selv mellom stjernene, på jakt etter {ting}.",
            "Havet ser på oss fratredjeettasje – men {folk} er allerede langt borte.",
            "Et eventyr som starter med {ting} {tid}, men slutter i fullstendig {kort}.",
            "Havets sang fra {stednavn} til {stednavn2}",
            "{steder} finner {folk} seg selv mellom skyggene av {ting}.",
            "Un film de {folk}.",
            "En ode til {ting}.",
            "Victoria {verb} i feil kodek.",
            "Stille film om {ting} og {ting2}.",
            "{ting}, et drama i fire deler."
        ],
        loglines: [
            "{ting} glitrer i kveldslyset, og redbull-boksen står igjen på rekka.",
            "En dokumentar som lar vinden ta fortellingen videre, der minner fra Hitra blandes med {ting}, stillhet og brustne {ting2}.",
            "Alt flyter sammen i klippepoesi, og ingen untatt {folk} vet hvor drømmen starter eller havet slutter.",
            "Vinden bærer {ting}til {stednavn} – og alt står stille, som om tiden har glemt å {verb2}.",
            "Mørket legger seg {steder}, og {folk} finner seg selv i et hav av minner og {ting}, der ingenting blir sagt, men alt forstås.",
            "Det er alltid mer hav bak horisonten, men {folk} ser bare på {ting} og mister seg selv i stillheten.",
            "Først var det bare bølger og {ting}. Nå er det bare ekko.",
            "Klippelegenden {verb} i {stednavn}.",
            "Ingen sover, alle {verb}. Stillheten henger {steder}.",
            "{folk} ser mot vest og gråter i snøen.",
            "Hav og {ting}, lys, {dop} og minner. Hvem {verb} først?",
            "Lange, tause, {adjektiv} bilder av {folk} som vurderer å {verb2}. Det er uklart om filmen egentlig har begynt.",
            "En {adjektiv} voiceover om {ting}s reise fra havet til {stednavn}",
            "En båt glir gjennom tåka {steder}, og alt er i sort/hvitt når {folk} {verb}",
        ]
    }
};

// ===================================================================================
// KJERNEFUNKSJONER (Samme forbedrede motor som før)
// ===================================================================================

// GENERATOR LOGIKK (ORIGINAL FUNGERENDE VERSJON)
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomReplace(str) {
  return str
    .replace("{folk}", pick(data.folk))
    .replace("{folk2}", pick(data.folk))
    .replace("{folk3}", pick(data.folk))
    .replace("{prøver}", pick(data.prøver))
    .replace("{start}", pick(data.start))
    .replace("{steder}", pick(data.steder))
    .replace("{mer}", pick(data.mer))
    .replace("{stednavn}", pick(data.stednavn))
    .replace("{stednavn2}", pick(data.stednavn))
    .replace("{sted2}", pick(data.steder))
    .replace("{ting}", pick(data.ting))
    .replace("{verb_å}", pick(data.verb_å))
    .replace("{ting2}", pick(data.ting))
    .replace("{ting3}", pick(data.ting))
    .replace("{tid}", pick(data.tid))
    .replace("{dop}", pick(data.dop))
    .replace("{følelse}", pick(data.følelse))
    .replace("{kort}", pick(data.kort))
    .replace("{går}", pick(data.går))
    .replace("{verb2}", pick(data.verb2))
    .replace("{verb_ing}", pick(data.verb_ing))
    .replace("{verb}", pick(data.verb))
    .replace("{adjektivT}", pick(data.adjektivT))
    .replace("{adjektiv}", pick(data.adjektiv))
    .replace("{tiduten}", pick(data.tiduten));
}

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function generateIde() {
    const vibe = document.getElementById("vibe").value;
    const valgtePrompts = prompts[vibe];

    if (!valgtePrompts) return;

    let tittel = randomReplace(pick(valgtePrompts.titler));
    let logline = randomReplace(pick(valgtePrompts.loglines));

    currentIde = {
        tittel: capitalizeFirstLetter(tittel),
        logline: capitalizeFirstLetter(logline)
    };

    document.getElementById("doku-resultat").innerHTML = currentIde.tittel;
    document.getElementById("doku-logline").innerHTML = currentIde.logline;
    document.getElementById("klikk-for-mer").style.display = "block";
    document.getElementById("ai-enhancements").style.display = "none";
    document.getElementById("ai-content").style.display = "none";
    document.getElementById("loading-spinner").style.display = "none";
    document.getElementById("ai-error").style.display = "none";
}

// ===================================================================================
// OPENAI INTEGRASJON (GPT-4o & DALL-E 3)
// ===================================================================================

async function enhanceWithAI() {
    console.log("enhanceWithAI() called!"); // DEBUG
    
    if (!currentIde.tittel) {
        console.log("Ingen idé generert ennå!");
        return;
    }

    if (!OPENAI_API_KEY || OPENAI_API_KEY.includes("sk-din-nøkkel-her")) {
        alert("Du må legge inn en gyldig OpenAI API-nøkkel i config.js-filen!");
        return;
    }

    const aiEnhancements = document.getElementById("ai-enhancements");
    const loadingSpinner = document.getElementById("loading-spinner");
    const aiContent = document.getElementById("ai-content");
    const aiError = document.getElementById("ai-error");

    console.log("Starter AI-generering..."); // DEBUG

    aiEnhancements.style.display = "block";
    loadingSpinner.style.display = "block";
    aiContent.style.display = "none";
    aiError.style.display = "none";
    document.getElementById("klikk-for-mer").style.display = "none";

    try {
        console.log("Kaller OpenAI API..."); // DEBUG
        
        const [textResponse, imageResponse] = await Promise.all([
            fetchOpenAIText(currentIde.tittel, currentIde.logline),
            fetchOpenAIImage(currentIde.tittel, currentIde.logline)
        ]);

        const textData = await textResponse.json();
        if(!textResponse.ok) throw new Error(textData.error.message);
        const aiText = textData.choices[0].message.content;
        
        const sporsmalMatch = aiText.match(/### Dramatisk Spørsmål\s*([\s\S]*?)(?=\s*###|$)/);
        const beskrivelseMatch = aiText.match(/### Utvidet Beskrivelse\s*([\s\S]*)/);

        const dramatiskSporsmal = sporsmalMatch ? sporsmalMatch[1].trim() : "AI-en klarte ikke å generere et dramatisk spørsmål.";
        const utvidetBeskrivelse = beskrivelseMatch ? beskrivelseMatch[1].trim() : "AI-en klarte ikke å generere en utvidet beskrivelse.";

        document.getElementById("dramatisk-sporsmal").innerText = dramatiskSporsmal;
        document.getElementById("utvidet-beskrivelse").innerText = utvidetBeskrivelse;
        
        const imageData = await imageResponse.json();
        if(!imageResponse.ok) throw new Error(imageData.error.message);
        const imageUrl = imageData.data[0].url;
        document.getElementById("film-plakat-img").src = imageUrl;

        console.log("AI-generering fullført!"); // DEBUG
        loadingSpinner.style.display = "none";
        aiContent.style.display = "flex";

    } catch (error) {
        console.error("Feil ved kall til OpenAI API:", error);
        loadingSpinner.style.display = "none";
        aiError.style.display = "block";
    }
}

function fetchOpenAIText(tittel, logline) {
    const textPrompt = `Du er en kynisk, men humoristisk filmprodusent for "Rollo Tomasi". Basert på følgende filmidé, generer en utvidet og morsom beskrivelse. Bruk en tørr og intern bransjetone. TITTEL: "${tittel}" LOGLINE: "${logline}" Ditt svar MÅ struktureres nøyaktig slik, med norske overskrifter: ### Dramatisk Spørsmål [Skriv et kort, spissfindig og humoristisk dramatisk spørsmål her. Ca. 1-2 setninger.] ### Utvidet Beskrivelse [Skriv en lengre, mer detaljert og morsom beskrivelse av prosjektet. Utbroder loglinen med absurde detaljer og karakterkonflikter. Ca. 3-5 setninger.]`;
    return fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "user", content: textPrompt }], temperature: 0.8 })
    });
}

function fetchOpenAIImage(tittel, logline) {
    const imagePrompt = `En filmatisk, detaljert, absurd og humoristisk filmplakat for en norsk mockumentary. Stilen skal være litt slitt og "indie", som en film fra 90-tallet. Tittelen er "${tittel}". Handling: "${logline}". Ikke vis tekst på selve bildet, utenom eventuelt tittelen på en stilig måte.`;
    return fetch("https://api.openai.com/v1/images/generations", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({ model: "dall-e-3", prompt: imagePrompt, n: 1, size: "1024x1024", quality: "standard" })
    });
}

// ===================================================================================
// UI- OG HJELPEFUNKSJONER (Passord, Modal, etc.)
// ===================================================================================

function checkPassword() {
    const userPassword = document.getElementById("password-input").value;
    if (userPassword === correctPassword) {
        document.getElementById("password-container").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        document.querySelector(".thomas-button").style.display = "block";
    } else {
        document.getElementById("error-message").style.display = "block";
    }
}

function showModal() { document.getElementById('thomasModal').style.display = 'flex'; }
function closeModal() { document.getElementById('thomasModal').style.display = 'none'; }