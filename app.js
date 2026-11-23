"use strict";

const modulos = [...externos,...lecciones];
const banco = [...preguntas,...preguntasExternos];
const $ = id => document.getElementById(id);
const key = "tema15-estudio-v1";
const defaults = {done:[],answers:{}, sorted:false, size:"100", contrast:false, rate:"1", voice:""};
let saved = {};
try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch { /* Local storage can be unavailable. */ }
const state = {...defaults,...saved};
let persistent = true;
function save() {
  try { localStorage.setItem(key, JSON.stringify(state)); }
  catch { persistent = false; }
}

const screen = $("screen");
const synth = window.speechSynthesis;
let utterance;
let speechRun = 0;
let speechTimer;
let activeSpeaker;
function clearActiveSpeaker() {
  if (!activeSpeaker) return;
  activeSpeaker.setAttribute("aria-pressed","false");
  activeSpeaker.title = activeSpeaker.getAttribute("aria-label");
  activeSpeaker.querySelector("span").textContent = "🔊";
  activeSpeaker = null;
}
const readingPause = 450;
const defaultVoiceLabel = "Automática (Google o voz del dispositivo)";
const spanishVoices = () => (synth?.getVoices() || []).filter(voice => /^es(?:[-_]|$)/i.test(voice.lang));
const isGoogle = voice => /\bgoogle\b/i.test(voice.name + " " + voice.voiceURI);
const isSpain = voice => /^es[-_]es$/i.test(voice.lang);
function deviceVoice(voices) {
  const available = voices.filter(voice => !isGoogle(voice));
  return available.find(voice => isSpain(voice) && /\bm[oó]nica\b/iu.test(voice.name))
    || available.find(isSpain)
    || available.find(voice => voice.default)
    || available[0];
}
const endsSentence = part => /[.!?][»”"')\]]*$/u.test(part)
  && !/\b(?:p|pp|pág|págs|fig|núm|aprox|etc)\.$/iu.test(part);

function speechSentences(text) {
  const sentences = [];
  const boundary = /([.!?][»”"')\]]*)\s+(?=[\p{Lu}¿¡0-9«“"])/gu;
  let start = 0;
  for (const match of text.matchAll(boundary)) {
    const end = match.index + match[1].length;
    const part = text.slice(start,end).trim();
    if (endsSentence(part)) {
      sentences.push(part);
      start = match.index + match[0].length;
    }
  }
  const tail = text.slice(start).trim();
  if (tail) sentences.push(tail);
  return sentences;
}
function stopSpeech() {
  speechRun++;
  clearTimeout(speechTimer);
  synth?.cancel();
  utterance = null;
  clearActiveSpeaker();
  $("speech-status").textContent = "";
}
function fillVoices() {
  $("voice").replaceChildren(new Option(defaultVoiceLabel,""), ...spanishVoices()
    .map(voice => new Option(voice.name + " · " + voice.lang, voice.voiceURI)));
  $("voice").value = state.voice;
  if ($("voice").selectedIndex < 0) $("voice").selectedIndex = 0;
}
function speak(area,trigger) {
  if (activeSpeaker === trigger) {
    stopSpeech();
    return;
  }
  if (!synth) { $("speech-status").textContent = "Lectura en voz alta no disponible en este navegador."; return; }
  stopSpeech();
  const voices = spanishVoices();
  const google = voices.filter(isGoogle);
  let voice = voices.find(item => item.voiceURI === state.voice)
    || google.find(isSpain) || google[0] || deviceVoice(voices);
  const currentRun = speechRun;
  activeSpeaker = trigger;
  trigger.setAttribute("aria-pressed","true");
  trigger.title = "Detener lectura";
  trigger.querySelector("span").textContent = "■";
  const lines = area.querySelectorAll("h1,h2,h3,p,figcaption,legend,.choice,li,.feedback");
  const chunks = Array.from(lines)
    .filter(node => node.innerText.trim() && !node.closest("[hidden]") && (!node.closest("details") || node.closest("details").open) && !node.querySelector("p,li"))
    .flatMap(node => {
      const text = node.querySelector(".sort-row span")?.innerText || node.innerText;
      return text.split(/\r\n?|\n/).flatMap(speechSentences);
    });
  let index = 0;
  function next() {
    if (currentRun !== speechRun) return;
    if (index === chunks.length) { clearActiveSpeaker(); $("speech-status").textContent = "Lectura terminada."; return; }
    const chunk = chunks[index++];
    utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = voice ? voice.lang.replace(/_/g,"-") : "es-ES";
    if (voice) utterance.voice = voice;
    utterance.rate = Number(state.rate);
    utterance.onend = () => {
      if (currentRun !== speechRun) return;
      if (index < chunks.length) speechTimer = setTimeout(next,readingPause);
      else next();
    };
    utterance.onerror = event => {
      if (currentRun !== speechRun) return;
      if (voice && isGoogle(voice) && ["network","voice-unavailable","language-unavailable","synthesis-failed"].includes(event.error)) {
        voice = deviceVoice(spanishVoices());
        index--;
        next();
        return;
      }
      clearActiveSpeaker();
      $("speech-status").textContent = "No se pudo iniciar la lectura. Puedes elegir otra voz en Accesibilidad y lectura.";
    };
    synth.speak(utterance);
  }
  $("speech-status").textContent = "Leyendo…";
  next();
}

function settings() {
  document.documentElement.style.fontSize = state.size + "%";
  document.documentElement.classList.toggle("contrast",state.contrast);
  $("size").value = state.size;
  $("contrast").checked = state.contrast;
  $("rate").value = state.rate;
}
for (const id of ["size","contrast","voice","rate"]) {
  $(id).addEventListener("change", event => {
    state[id] = id === "contrast" ? event.target.checked : event.target.value;
    save();
    settings();
  });
}
settings();
fillVoices();
synth?.addEventListener("voiceschanged",fillVoices);
$("speak").onclick = event => speak(screen,event.currentTarget);
$("stop").onclick = stopSpeech;
$("print").onclick = () => window.print();
document.querySelector(".skip").addEventListener("click", event => {
  event.preventDefault();
  $("contenido").focus();
});

const button = (href,label,primary=false) => `<a class="button ${primary ? "primary" : ""}" href="#${href}">${label}</a>`;
const speaker = (label,attributes="") => `<button type="button" class="speaker" aria-pressed="false" aria-label="${label}" title="${label}" ${attributes}><span aria-hidden="true">🔊</span></button>`;
const studyPoints = points =>
  `<ul class="study-points">${points.map(point => `<li>${point}</li>`).join("")}</ul>`;

const explanation = content => {
  if (Array.isArray(content)) return studyPoints(content);
  const points = content.split(/(?<=[.!?])\s+(?=(?:<strong>)?[A-ZÁÉÍÓÚÜÑ¿¡])/u);
  return points.length > 1 ? studyPoints(points) : `<p>${content}</p>`;
};
const modelTerms = /(?<![\p{L}])(?:composición química|mosaico de cristales|climas húmedos y cálidos|climas glaciares y desérticos|pendientes pronunciadas|zonas llanas|formación de magma|estado sólido|fusión parcial|falla transformante|esfuerzos tectónicos|presión litostática|esfuerzos dirigidos|cámara magmática|colada de lava|metamorfismo de contacto|metamorfismo dinámico|metamorfismo regional|estructura granoblástica|madurez textural|depósito gravitacional|acreción cinética|plano de falla|plano axial|horizonte [OABC]|roca madre|regolito|humus|granito de anatexia|minerales de arcilla|carbonato de calcio|magmatismo|metamorfismo|subducción|compresión|cizalla|distensión|fusión|magma|piroclastos|lapilli|ceniza|lava|conos?|chimenea|cráter|caldera|plutón|dique|viscosidad|sílice|presión|temperatura|granito|obsidiana|pumita|basalto|fanerítica|microcristalina|vítrea|porfídica|vacuolar|foliación|blastesis|arcilla|pizarra|filita|esquisto|gneis|anatexia|corneana|milonita|cuarcita|mármol|silicatos?|olivino|granates|charnela|labios|salto|flancos|pliegue|diaclasa|falla|meteorización mecánica|química|biológica|meteorización|erosión|gelifracción|termoclastia|descompresión|abrasión|oxidación|disolución|carbonatación|hidrólisis|edafización|caliche|litosuelo|porosidad|permeabilidad|fertilidad|textura|estructura|lavado|acumulación|detrito|sedimentación|suspensión|saltación|rodadura|diagénesis|compactación|cementación|sedimentos|clastos|enterramiento|litificación|conglomerado|pudinga|brecha|arenisca|marga|cuarzo|yeso|halita|calcita)(?![\p{L}])/giu;
const modelExplanation = text => `<div class="explanation model-explanation">${explanation(Array.isArray(text) ? text : text.replace(modelTerms,term=>`<strong>${term}</strong>`))}</div>`;
const flow = items => `<ol class="diagram">${items.map(item => `<li>${item}</li>`).join("")}</ol>`;
const visual = {
  magma: `<figure><div class="volcano" aria-hidden="true"><span class="cone"></span><span class="vent"></span><span class="chamber"></span></div>
  <figcaption><strong>Corte de un volcán.</strong> El cono rodea el cráter en la parte superior. Debajo, la chimenea conecta la abertura con la cámara magmática.</figcaption></figure>`,
  meta: `<figure><div class="rock-samples" aria-hidden="true"><span class="foliation"></span><span class="mosaic"></span></div>
  <figcaption><strong>Dos estructuras.</strong> Izquierda, disposición en láminas o bandas (foliación). Derecha, mosaico de granos sin orientación preferente (granoblástica).</figcaption></figure>`,
};
const examExternal = `<div class="grid"><section class="card"><h2>Qué entra · Tema 14</h2><ul>
<li><strong>Meteorización.</strong> Define la meteorización y estudia los procesos mecánicos, químicos y biológicos. La profesora puede dar el nombre de un mecanismo, por ejemplo termoclastia, y pedir que lo expliques, o dar sus características y pedir que lo identifiques.</li>
<li><strong>Edafización o formación del suelo.</strong> La profesora destaca cuatro factores: seres vivos, pendiente, clima y tiempo. Puede poner un dibujo de la estructura del suelo para identificar los horizontes O, A, B y C.</li>
<li><strong>Propiedades del suelo.</strong> Define textura, porosidad y permeabilidad. Explica qué factores favorecen un suelo más fértil.</li>
<li><strong>Tipos de suelos.</strong> Presta especial atención a distinguir el caliche del suelo rocoso o litosuelo.</li>
<li><strong>Erosión, transporte y sedimentación.</strong> Define erosión y distingue detrito, sedimento y sedimentación. Reconoce los modos de transporte y compara la madurez textural de dos muestras a partir de una imagen. En la sedimentación, distingue los dos modos de depósito: depósito gravitacional y acreción cinética.</li>
<li><strong>Rocas sedimentarias.</strong> Explica las características de un tipo de roca o identifícalo a partir de ellas. Repasa brevemente cuarzo, minerales de arcilla, yeso, halita y calcita.</li></ul></section>
<section class="card"><h2>Qué se excluye</h2><p>El punto 6, dedicado a los modelados.</p></section></div>`;
const exam = `<div class="notice"><h2>Pregunta segura del tema 15</h2><p>Explica la serie regional desde el ambiente sedimentario hasta el magmático y cómo cambian las rocas al aumentar la presión y la temperatura.</p><p><strong>Arcilla → pizarra → filita → esquisto → gneis → granito de anatexia.</strong> Al final, la fusión parcial origina un magma que, al enfriarse y solidificarse, puede formar granito.</p></div>
<div class="grid"><section class="card"><h2>Qué entra · Tema 15</h2><ul>
<li><strong>Procesos internos.</strong> Distingue magmatismo, metamorfismo y esfuerzos. Interpreta el bloque diagrama. Define el magma y explica sus componentes. De los emplazamientos intrusivos, estudia el plutón y el dique.</li>
<li><strong>Vulcanismo.</strong> Explica cómo se produce una erupción, cuáles son sus productos y cómo influyen la composición, la temperatura, los gases disueltos y el lugar de la erupción. Identifica la caldera, la cámara magmática, la chimenea, el cono y el cráter.</li>
<li><strong>Rocas ígneas.</strong> Relaciona el enfriamiento con las rocas volcánicas, plutónicas y filonianas. Distingue textura y estructura. Repasa fanerítica o fanerocristalina, microcristalina, vítrea, porfídica y vacuolar. Practica describir e identificar las rocas plutónicas y volcánicas.</li>
<li><strong>Metamorfismo.</strong> Define el proceso, explica sus factores y los cambios de color, densidad, tenacidad, textura y estructura. Distingue metamorfismo dinámico, térmico o de contacto, y regional.</li>
<li><strong>Rocas metamórficas.</strong> Explica cómo la <strong>presión</strong> condiciona la <strong>foliación</strong> y reconoce la <strong>estructura granoblástica</strong>. Identifica pizarra, esquisto, gneis, cuarcita y mármol. Asocia la <strong>corneana</strong> al metamorfismo de contacto y la <strong>brecha de falla o la milonita</strong> al dinámico.</li>
<li><strong>Minerales y ciclo de las rocas.</strong> Define los <strong>silicatos</strong>. Da un ejemplo <strong>magmático</strong> (olivino) y otro <strong>metamórfico</strong> (granate). Estudia el esquema simplificado del ciclo.</li>
<li><strong>Esfuerzos.</strong> Define <strong>pliegue</strong> y <strong>falla</strong> y explica sus elementos principales.</li></ul></section>
<section class="card"><h2>Qué se excluye</h2><ul>
<li>Tipos de actividad volcánica hawaiana, estromboliana y peleana, y el recuadro azul.</li>
<li>Textura criptocristalina, diabasa y microscopio petrográfico.</li>
<li>Estructuras de los silicatos y actividad sísmica.</li></ul></section></div>`;

const bookImages = {
  meteorizacion: [["14-mecanica","Tipos de meteorización mecánica","Recuadro con las cuatro fotografías en su orden original: gelifracción, descompresión, abrasión y termoclastia.","268"],["14-raices","Raíces y meteorización","Raíces de árbol que ocupan y ensanchan grietas de una roca.","269"]],
  suelo: [["14-horizontes","Estructura del suelo","Perfil con cuatro flechas. La flecha de la izquierda señala el horizonte O o mantillo. Las de la derecha señalan, de arriba abajo, los horizontes A, B y C.","270",16],["14-propiedades-suelo","Textura, porosidad y permeabilidad","Recuadro con los tamaños de arena, limo y arcilla y la comparación de poros entre un suelo arenoso y uno arcilloso.","271"],["14-suelos","Tipos de suelos","Recuadro completo. De izquierda a derecha: podsol, caliche, suelo pardo y litosuelo o suelo rocoso.","271",15]],
  sedimentos: [["14-transporte","Cómo viajan las partículas","Esquema del libro con suspensión, flotación, disolución, reptación, saltación y rodadura.","272"],["14-madurez","Compara las muestras A y B","A muestra arena de playa fina; B muestra fragmentos angulosos de un sedimento glaciar.","273"],["14-depositos","Dos formas de depósito","Cantos en un cauce y barras arenosas vistas desde arriba.","273"]],
  sedimentarias: [["14-sedimentarias","Rocas detríticas","Recuadro completo con conglomerados, areniscas y arcillas y limos. Incluye los tamaños de los clastos y una foto en cada columna.","274",15],["14-carbonatadas","Calizas y dolomías","Recuadro de las rocas carbonatadas. A la izquierda, una caliza. A la derecha, una dolomía.","274"],["14-evaporiticas","Yesos y sales","Recuadro de las rocas evaporíticas. A la izquierda, una roca de yeso. A la derecha, una muestra de sales.","275"],["14-organicas","Carbones y petróleo","Recuadro de las rocas orgánicas con fotografías de turba, antracita y petróleo.","275"],["14-margas","Margas · 4.3. Rocas mixtas","Recuadro de las margas con su fotografía y composición: carbonato de calcio y una parte importante de limo o arcilla.","275"],
    ["14-cuarzo","Cuarzo","Muestra de cuarzo blanquecino.","277"],
    ["14-caolinita","Caolinita · mineral de arcilla","Muestra blanca de caolinita.","277"],
    ["14-yeso","Yeso","Muestra de yeso.","277"],
    ["14-halita","Halita","Muestra de halita con cristales blanquecinos.","277"],
    ["14-calcita","Calcita","Muestra de calcita.","277"]],
  magma: [["15-tectonica","Bloque diagrama de los procesos geológicos internos","Dibujo con cinco recuadros y leyenda. A la izquierda se ve la subducción, arriba la compresión de sedimentos y la falla transformante, y a la derecha una pluma térmica.","288",16],["15-componentes-magma","Las tres fracciones del magma","Esquema y recuadros de la fracción líquida, sólida y gaseosa.","289"],["15-intrusiones","Emplazamientos intrusivos o en profundidad","El plutón es la masa gris abovedada de la izquierda. El dique es la lámina gris inclinada que atraviesa las capas centrales.","289"],["15-volcan","Corte de un volcán","Cono, conducto, cámara y colada. Contrasta esta vista con las partes descritas.","290"]],
  igneas: [["15-enfriamiento","Dónde se forman las rocas ígneas","Corte del volcán que muestra emplazamientos superficiales y profundos.","292"],["15-igneas","Muestras de rocas ígneas","Fotografías de pumita, andesita, obsidiana, basalto, granito, diorita, sienita y gabro.","293"]],
  meta: [["15-aureola","Aureola alrededor de una intrusión","Corte donde el plutón calienta la roca encajante y la transforma a su alrededor.","297"],["15-foliacion","Minerales orientados y foliación","Esquema de la orientación de los minerales planos bajo presión.","298"],["15-metamorficas","Muestras de rocas metamórficas","Fotografías de rocas foliadas y de rocas con estructura granoblástica.","299"]],
  ciclo: [["15-olivino-granates","Olivino y granates","Muestra de olivino a la izquierda y dos granates a la derecha.","300"],["15-ciclo","Ciclo de las rocas en el libro","Diagrama de los caminos entre magma, rocas y sedimentos.","301"]],
  esfuerzos: [["15-pliegues","Elementos del pliegue","Corte con capas plegadas, núcleo, charnela, flancos y plano axial.","302"],["15-fallas","Elementos de una falla","Bloques de roca desplazados a lo largo de un plano de fractura.","303"]]
};
const studyQuestions = {
  meteorizacion: [
    ["¿Qué es la meteorización? Nombra y define sus tres tipos.","Es la alteración de las rocas en la superficie terrestre, en el lugar donde se encuentran. La meteorización mecánica fragmenta la roca sin cambiar su composición. La química altera la composición química de los minerales que componen la roca. La biológica se debe a la acción de los seres vivos, que pueden fragmentar la roca o alterar sus minerales.",true],

  ],
  suelo: [
    ["¿Qué es la edafización? Explica cómo influyen los seres vivos, la pendiente, el clima y el tiempo en la formación del suelo.", [definicionEdafizacion, ...factoresEdafizacion.slice(0,4).map(factor => `${factor[0]}. ${resumenFactorEdafizacion(factor)}`)].join(" "),true],
    ["Antes de que se forme el suelo, ¿cómo se llama la cubierta de fragmentos sueltos? Explica cómo se origina.","Se llama detrito o regolito. La meteorización desprende fragmentos de roca llamados clastos. Cuando se acumulan, forman esa cubierta de materiales sueltos. La edafización transforma el detrito en suelo fértil."],
    ["Además de los seres vivos, la pendiente, el clima y el tiempo, ¿qué otros factores influyen en la edafización?",resumenFactorEdafizacion(factoresEdafizacion[4])],
    ["En un perfil, ¿cómo distingues los horizontes O, A, B y C?",horizontesDelSuelo,true],
    ["Define la textura, la porosidad y la permeabilidad del suelo. ¿Puede un suelo arcilloso tener mucha porosidad y dejar pasar el agua lentamente?","La textura indica la proporción de arena, limo y arcilla de la fracción mineral del suelo. La porosidad indica qué porcentaje del suelo está ocupado por huecos que pueden contener aire o agua. La permeabilidad es la facilidad con la que el agua circula por el suelo. Sí: en un suelo muy arcilloso los poros son pequeños y pueden contener mucha agua, aunque esta circule despacio.",true],
    ["¿Qué factores favorecen que un suelo sea más fértil?","Un suelo es más fértil cuando favorece el crecimiento de las plantas. Ayudan la presencia de humus y de nutrientes disponibles, como nitratos y fosfatos, así como una buena disponibilidad de agua y una aireación adecuada.",true],
    ["¿En qué se diferencian el caliche y el suelo rocoso o litosuelo?",calicheYSueloRocoso,true],
    ["Un perfil tiene una costra de cal cerca de la superficie. El otro presenta una capa de suelo muy delgada sobre roca madre poco alterada. ¿Cuál es el caliche y cuál es el suelo rocoso? Justifica tu respuesta.","El primer perfil es un caliche. La pista es la costra de cal. En un clima árido, el agua asciende por capilaridad y, al evaporarse, deja cal o sales cerca de la superficie. El segundo perfil es un litosuelo o suelo rocoso. Las pistas son el poco espesor del suelo, la roca madre poco alterada y los horizontes poco diferenciados.",true],
    ["Ves una costra de cal cerca de la superficie en una zona muy seca. ¿Qué suelo es y cómo se forma?",[calicheYSueloRocoso[0]],true],
    ["Ves una capa de suelo muy delgada sobre roca madre poco alterada. Apenas se distinguen los horizontes. ¿Qué suelo es?",[calicheYSueloRocoso[1]],true]
  ],
  sedimentos: [
    ["¿Qué es la meteorización? Explica en qué se diferencia de la erosión.","La meteorización altera los minerales o fragmenta la roca en superficie, en el mismo lugar donde se encuentra. Por ejemplo, cuando el agua se congela en una grieta y la ensancha, la roca se meteoriza. Si una corriente recoge después los clastos y los pone en movimiento, se produce erosión. Los fragmentos que permanecen acumulados donde se formaron constituyen el detrito."],
    ["En una ladera se han acumulado fragmentos de roca producidos por la meteorización. Tras una lluvia intensa, el agua arrastra parte de ellos pendiente abajo y los deja al llegar a una zona llana donde pierde velocidad. Identifica el detrito, explica cuándo esos fragmentos pasan a llamarse sedimento y distingue erosión, transporte y sedimentación.",[
      "<strong>Detrito.</strong> Los fragmentos de roca están acumulados en la ladera, donde se formaron.",
      "<strong>Erosión.</strong> Comienza cuando el agua recoge parte del detrito y lo pone en movimiento. Desde ese momento, los fragmentos se llaman <strong>sedimento</strong>.",
      "<strong>Transporte.</strong> El agua arrastra el sedimento ladera abajo.",
      "<strong>Sedimentación.</strong> Al llegar a la zona llana, el agua pierde velocidad y deja allí el sedimento."
    ]],
    ["¿Cuáles son los modos de transporte de sedimentos? Distingue los que tienen contacto con el fondo de los que se producen separados de él.","En contacto con el fondo: reptación, rodadura y saltación. En la reptación las partículas se arrastran. En la rodadura ruedan y en la saltación avanzan en saltos. Separados del fondo: suspensión, flotación y disolución. En suspensión las partículas viajan en el fluido, en flotación van por su superficie y en disolución las sustancias viajan disueltas en el agua.",true],
    ["Una partícula avanza dando saltos y otra viaja dentro del agua sin tocar el fondo. ¿Cómo se transporta cada una?","La primera viaja por saltación. La corriente la levanta y la partícula vuelve a tocar el fondo antes del salto siguiente. La segunda viaja en suspensión. Permanece dentro del agua durante el desplazamiento, sin apoyarse en el fondo."],
    ["¿Cuándo tiene un sedimento madurez textural alta? Observa las muestras A y B del recuadro. ¿Cuál presenta mayor madurez textural? Justifica tu respuesta por el tamaño y la forma de los clastos.",`${relacionTransporteTextural} Un sedimento tiene madurez textural alta cuando está formado por clastos muy pequeños y redondeados. La muestra A, arena de playa, presenta esos dos rasgos y tiene mayor madurez textural. La muestra B, sedimento glaciar, tiene menor madurez textural porque sus fragmentos son angulosos y de distintos tamaños.`,true],
    ["Durante la sedimentación, ¿en qué se diferencian el depósito gravitacional y la acreción cinética?","En el depósito gravitacional, la corriente pierde energía y los clastos que transportaba caen al fondo por gravedad. En la acreción cinética, los clastos todavía están en movimiento cuando encuentran un obstáculo que provoca su acumulación. La pista es si los clastos caen al fondo al debilitarse la corriente o se acumulan al topar con un obstáculo.",true]
  ],
  magma: [
    ["¿En qué se diferencian el magmatismo, el metamorfismo y los esfuerzos tectónicos?","En el magmatismo, la fusión de las rocas produce un líquido, el magma, que contiene cristales en suspensión y gases disueltos. En el metamorfismo, la roca se transforma por cambios de presión y temperatura, pero permanece en estado sólido. Los esfuerzos tectónicos pueden curvar o fracturar las rocas y desplazar los bloques.",true],
    ["Mira el bloque diagrama. ¿Qué proceso explica la formación de magma en la zona de subducción? ¿Y la transformación en estado sólido de los sedimentos comprimidos? ¿Dónde ves un ejemplo de esfuerzos tectónicos?","Es magmatismo en la zona de subducción. La placa que se hunde aporta agua y facilita la formación de magma. Es metamorfismo en los sedimentos comprimidos del prisma de acreción, porque se transforman en estado sólido. La falla transformante es un ejemplo de esfuerzos tectónicos. Los bloques se desplazan lateralmente entre sí.",true],
    ["En el prisma de acreción del dibujo, ¿qué predomina, la presión o la temperatura? ¿Qué pista lo indica?","Predomina la presión. El dibujo muestra que el empuje de la placa comprime los sedimentos acumulados. Por eso se trata de metamorfismo regional de alta presión."],
    ["La fusión de las rocas produce un líquido con cristales en suspensión y gases disueltos. ¿Cómo se llama? Identifica sus tres fracciones.","Se llama magma. La roca fundida es la fracción líquida. Los cristales en suspensión forman parte de la fracción sólida, que también puede contener fragmentos de roca. Los gases disueltos constituyen la fracción gaseosa."],
    ["¿Qué son un plutón y un dique? Indica cómo se distinguen por su forma.","Un plutón es una masa voluminosa de roca magmática que se solidifica en profundidad. Suele tener forma ovoide o de cúpula. Un dique es una lámina delgada que se forma cuando el magma solidifica en una fractura. Se reconoce porque atraviesa las capas que ya existían.",true],
    ["En el corte hay una masa gris abovedada a la izquierda y una lámina gris que atraviesa varias capas. ¿Cuál es el plutón y cuál es el dique? Justifica con una pista en cada caso.","La masa gris abovedada de la izquierda es el plutón. La pista es su forma de cúpula. La lámina gris inclinada es el dique. La pista es que corta las capas de roca.",true],
    ["En un dibujo de un volcán, localiza la cámara, la chimenea, el cráter y el cono. ¿En qué se diferencia una caldera de un cráter?","La cámara magmática es la zona donde se acumula el magma en profundidad. La chimenea es el conducto por el que asciende y el cráter es la abertura de salida. El cono es el relieve formado por la acumulación de materiales de las erupciones. La caldera es una depresión amplia y suele formarse por el hundimiento del techo de la cámara magmática.",true],
    ["Explica qué sucede con los gases al ascender el magma. ¿Qué productos puede emitir una erupción?","Al ascender el magma, baja la presión y los gases disueltos forman burbujas. El magma se vuelve espumoso y menos denso. Su empuje favorece la apertura de fracturas que le permiten llegar a la superficie. En la erupción pueden salir gases, lava y piroclastos.",true],
    ["¿Qué cuatro factores influyen en la actividad volcánica? Explica qué cambia en cada caso.","Composición: cuanta más sílice contiene el magma, más le cuesta fluir. Es decir, tiene más viscosidad. Temperatura: cuanto más caliente, más fluido. Cantidad de gases disueltos: mientras están disueltos, favorecen la fluidez. Al bajar la presión, se forman burbujas y los gases tienden a escapar. Lugar: bajo el agua, el enfriamiento es brusco y puede dar lugar a lavas almohadilladas. En tierra pueden formarse coladas.",true],
    ["El magma llega al fondo del mar y se enfría bruscamente. ¿Qué factor explica lo ocurrido y qué forma pueden adquirir las lavas?","El factor es el lugar de la erupción. Al entrar en contacto con el agua, el magma se enfría de golpe y puede formar lavas almohadilladas."]
  ],
  igneas: [
    ["Relaciona rocas plutónicas, volcánicas y filonianas con el lugar de consolidación y sus texturas habituales.","Las plutónicas se consolidan lentamente en profundidad y suelen tener cristales visibles. Las volcánicas se enfrían con rapidez cerca de la superficie y pueden tener grano fino o vidrio. Las filonianas se forman cuando el magma se consolida en fracturas o entre capas, a menor profundidad.",true],
    ["Una roca tiene cristales grandes dispersos en una matriz de grano fino. Otra conserva huecos de burbujas. Describe sus texturas.","La primera es porfídica: tiene cristales grandes en una matriz fina. La segunda es vacuolar: sus huecos quedaron donde había burbujas de gas, como en la pumita o en algunas lavas solidificadas.",true],
    ["Una roca se consolida despacio a gran profundidad. Otra se enfría rápidamente tras una erupción. Una tercera se consolida en una grieta. ¿A qué grupo pertenece cada una?","La primera es plutónica. La segunda es volcánica. La tercera es subvolcánica o filoniana. Las pistas son la profundidad, la velocidad de enfriamiento y el emplazamiento en una grieta.",true],
    ["Identifica estas tres texturas. A: tiene cristales claramente visibles. B: tiene cristales muy pequeños que aún se ven a simple vista. C: es homogénea y carece de cristales.","A. Fanerítica o fanerocristalina. B. Microcristalina. C. Vítrea.",true],
    ["Te dan los nombres granito, obsidiana y pumita. Describe un rasgo que te permita identificar cada roca.","En el granito se ven a simple vista cristales de cuarzo, feldespatos y micas. Encajan como piezas de un puzle y forman un mosaico de cristales. La obsidiana es un vidrio volcánico negro y compacto. La pumita es ligera y tiene muchas vacuolas.",true],
    ["¿Qué rasgos describirías si te dan los nombres andesita, basalto, diorita, sienita y gabro?","Andesita: roca volcánica gris o violácea, de composición similar a la diorita. Basalto: volcánica, oscura y densa, a veces con vacuolas. Diorita: plutónica, oscura y moteada de blanco. Sienita: plutónica, suele ser rosada o anaranjada, con abundante ortosa y sin cuarzo. Gabro: plutónica y oscura, con predominio de piroxenos y plagioclasas.",true],
    ["Una muestra tiene cuarzo, feldespatos y micas visibles. Otra es negra, compacta y se rompe con superficies curvas. Una tercera es ligera y llena de huecos. Identifica las tres.","La primera es granito, por su mosaico de cristales y su composición. La segunda es obsidiana, un vidrio volcánico de fractura curva. La tercera es pumita, reconocible por sus numerosas vacuolas y su baja densidad.",true],
    ["Identifica las rocas. A: volcánica, oscura y densa, típica de la corteza oceánica. B: plutónica, rosada, rica en ortosa y sin cuarzo. C: plutónica y oscura, con piroxenos y plagioclasas como minerales principales.","A. Basalto. B. Sienita. C. Gabro.",true],
    ["Dos rocas tienen una composición parecida. Una es gris o violácea y se forma en una erupción. La otra es oscura, moteada de blanco, y se consolida en profundidad. ¿Cuál es la andesita y cuál es la diorita?","La volcánica es la andesita. La plutónica es la diorita. Para distinguirlas, fíjate en el lugar de formación y en el aspecto.",true]
  ],
  meta: [
    ["Define metamorfismo. Nombra los factores y explica un cambio que pueda producir cada uno.","Es la transformación de los minerales, la textura o la estructura de una roca que permanece en estado sólido. La presión litostática se debe al peso de las capas superiores. Puede reducir los huecos de la roca. La temperatura facilita las reacciones entre los minerales. Los esfuerzos dirigidos pueden cambiar la orientación de los minerales o triturar la roca en una falla. El agua lleva iones disueltos que pueden reaccionar con los minerales.",true],
    ["Ordena la serie regional desde la arcilla. Indica los grados de metamorfismo y explica cuándo empieza a fundirse parte de la roca.",serieRegionalCuaderno,true],
    ["Compara foliación y estructura granoblástica. Da un ejemplo de roca para cada una.",estructurasMetamorficas,true],
    ["Identifica tres rocas foliadas. A: se separa en láminas finas y paralelas. B: tiene foliación ondulada y brillo de micas. C: tiene bandas claras y oscuras.","A. Pizarra. B. Esquisto. C. Gneis o neis. Las tres tienen foliación, pero se distinguen por la forma en que se organizan sus minerales.",true],
    ["Las dos muestras tienen estructura granoblástica. Una procede de una arenisca rica en cuarzo. La otra procede de una caliza. ¿Qué roca es cada una?","La primera es cuarcita y la segunda es mármol. Como ambas pueden presentar un mosaico de cristales, la pista decisiva en esta pregunta es la roca de origen.",true],
    ["Una muestra procede de la roca que rodea una intrusión. La otra se deformó mucho en una falla. Para cada muestra, indica qué tipo de metamorfismo ocurrió y qué roca pudo formarse.","Junto a la intrusión, el calor transforma la roca encajante por metamorfismo de contacto y puede originar corneana. En la zona de falla, la deformación intensa se asocia al metamorfismo dinámico y puede originar milonita.",true]
  ],
  ciclo: [
    ["¿Qué son los silicatos? Da un ejemplo de mineral magmático y otro de mineral metamórfico.",[
      "<strong>Silicatos.</strong> Son minerales que tienen <strong>silicio y oxígeno</strong> como elementos fundamentales.",
      "<strong>Mineral magmático.</strong> El <strong>olivino</strong> puede formarse cuando cristaliza el magma.",
      "<strong>Mineral metamórfico.</strong> El <strong>granate</strong> puede formarse cuando una roca se transforma por metamorfismo."
    ],true],
    ["Explica el ciclo de las rocas. ¿Cómo se forman los sedimentos y las rocas sedimentarias, metamórficas e ígneas?",caminosCicloRocas,true],
    ["Construye un recorrido del ciclo que incluya granito, sedimentos, arenisca y cuarcita.","El granito expuesto se meteoriza y los materiales se movilizan, se transportan y se depositan. La diagénesis puede formar arenisca. Si es rica en cuarzo, el metamorfismo puede transformarla en cuarcita."]
  ],
  esfuerzos: [
    ["¿Qué distingue un pliegue de una falla en un corte?","En el pliegue se curvan las capas. En la falla hay rotura con desplazamiento relativo."],
    ["En el dibujo, señala y define la charnela, los flancos, el núcleo y el plano axial.","La charnela es la zona de mayor curvatura. Los flancos están a ambos lados. El núcleo es la zona más interna. El plano axial pasa por las charnelas de las capas plegadas.",true],
    ["En el dibujo, identifica y define el plano de falla, los labios y el salto.","El plano de falla es la superficie de rotura por la que se desplazan los bloques. Los labios son esos bloques. El salto es el desplazamiento total entre ellos.",true]
  ]
};

const figurePlacement = {
  meteorizacion:[1,3], suelo:[1,2,4], sedimentos:[2,3,4], sedimentarias:[1,"carbonatadas","evaporiticas","organicas",3,4,4,4,4,4],
  magma:[0,1,2,3], igneas:[0,4], meta:[2,4,5], ciclo:[1,3], esfuerzos:[1,2]
};

const questionPlacement = {
  meteorizacion:[0], suelo:[0,0,0,1,2,3,4,4,4,4], sedimentos:[0,0,2,2,3,4],
  magma:[0,0,0,1,2,2,3,4,6,6], igneas:[0,3,0,2,4,5,4,5,5],
  meta:[0,3,4,5,5,5], ciclo:[1,3,3], esfuerzos:[0,1,2]
};
const extraQuestions = {
  sedimentos: {
    0:["¿Qué es la erosión? ¿En qué se diferencia del detrito y de la sedimentación?",[
      "<strong>Erosión.</strong> Comienza cuando un agente como el agua recoge parte del detrito y lo pone en movimiento.",
      "<strong>Detrito.</strong> Son los fragmentos de roca que siguen acumulados en el lugar donde se formaron.",
      "<strong>Sedimentación.</strong> Ocurre cuando el agua deja los fragmentos que estaba transportando."
    ],true],
    3:["¿Qué indica una madurez mineralógica alta? Explica por qué un sedimento puede ser rico en cuarzo o en minerales de arcilla después de una alteración prolongada.",madurezMineralogica]
  },
  suelo: {
    0:["En la misma zona hay una ladera muy inclinada y una superficie llana con vegetación. ¿Dónde es más probable que se forme suelo? Explica por qué.","En la superficie llana. El detrito se mantiene más estable y puede acumularse. Los seres vivos mezclan los materiales, favorecen que se retenga agua y aportan restos orgánicos que, al descomponerse, forman humus."]
  },
  magma: {
    1:["¿Qué es el magma? Nombra sus tres componentes.","El magma se forma por la fusión de las rocas en el interior de la Tierra. Contiene una fracción líquida de roca fundida, una fracción sólida de cristales en suspensión y fragmentos de roca, y una fracción gaseosa de gases disueltos, principalmente vapor de agua y dióxido de carbono.",true],
    5:["Distingue gases, lava y piroclastos. Clasifica ceniza, lapilli y bombas por tamaño.","Los gases son productos volátiles. La lava es magma emitido al exterior. Los piroclastos son fragmentos sólidos: ceniza menor de 2 mm, lapilli de 2 a 64 mm y bombas mayores de 64 mm."]
  },
  igneas: {
    1:["¿Qué diferencia hay entre textura y estructura en una roca magmática?","La textura describe el tamaño y la forma de los granos minerales. El libro también usa el término estructura para rasgos como las cavidades, la porosidad o la orientación de los minerales. Por ejemplo, el tamaño de los cristales de un granito describe su textura y la disposición de los minerales en láminas describe la estructura de una roca foliada.",true],
    2:["Distingue las texturas fanerítica o fanerocristalina, microcristalina y vítrea. Da un ejemplo de cada una.","Fanerítica: cristales claramente visibles, como en el granito. Microcristalina: cristales muy pequeños pero apreciables a simple vista, como en la aplita. Vítrea: masa sin cristales, como la obsidiana.",true]
  },
  meta: {
    1:["¿Qué cambios puede experimentar una roca durante el metamorfismo?","Color: puede cambiar al cambiar los minerales. Densidad: puede aumentar si disminuyen los huecos. Tenacidad: aumenta si los granos quedan más unidos y resisten mejor la rotura. Textura: cambia cuando los cristales crecen. Estructura: cambia cuando los minerales se orientan y forman láminas o bandas.",true],
    2:["Distingue metamorfismo dinámico, de contacto y regional.",tiposMetamorfismo,true]
  },
  ciclo: {
    0:["¿Qué elementos son fundamentales en los silicatos?","El silicio y el oxígeno."]
  }
};

const preguntasRocasSedimentarias = [
  ["Formación y clasificación",[
    ["¿Cómo se transforma un sedimento en una roca sedimentaria?","El sedimento se transforma en roca sedimentaria mediante la diagénesis o litificación. Primero, el enterramiento: se acumulan nuevas capas de sedimentos sobre las anteriores. Después, la compactación: el peso de las capas superiores aproxima los clastos y reduce los huecos entre ellos. Por último, la cementación: precipitan minerales en los huecos que quedan y actúan como un cemento que une los clastos. Así queda consolidada la roca sedimentaria."],
    ["¿En qué se diferencian las rocas detríticas, las no detríticas y las mixtas?",[origenRocasDetriticas,"Las no detríticas se forman a partir de sustancias disueltas en el agua que se convierten en sólidos, o de materia orgánica. Las mixtas combinan minerales formados a partir de sustancias disueltas y clastos de otras rocas."]]
  ]],
  ["Te dan el nombre · explica las características",[
    ["¿Cómo describirías una pudinga y una brecha?",tiposRocasDetriticas.slice(0,3),true],
    ["¿Qué tamaño tienen los granos de la arenisca? ¿Y los del limo y la arcilla?",tiposRocasDetriticas.slice(3)],
    ["¿En qué se diferencian una caliza y una dolomía por su composición?",composicionCarbonatadas],
    ["¿Cómo se forman las rocas evaporíticas? Indica el mineral principal de los yesos y da un ejemplo de mineral de las sales.",rocasEvaporiticas],
    ["¿Cómo distinguirías una muestra de turba de una de antracita? ¿De qué materia orgánica procede el petróleo?","La turba es parda, conserva restos vegetales y contiene entre un 45 % y un 65 % de carbono. La antracita es gris, tiene brillo metálico y contiene entre un 90 % y un 95 % de carbono. El petróleo es líquido y procede de materia orgánica de microorganismos marinos enterrada en sedimentos arcillosos sin oxígeno."]
  ]],
  ["Te dan las características · identifica la roca",[
    ["Compara dos rocas detríticas. Una tiene cantos redondeados de 8 mm unidos por un cemento. La otra está formada por granos cementados de 0,5 mm. Identifícalas y justifica la clasificación.","La primera es una pudinga. Los cantos superan los 2 mm y están unidos por un cemento, así que es un conglomerado. Los cantos redondeados permiten distinguirla de una brecha. La segunda es una arenisca porque los 0,5 mm están dentro del intervalo del tamaño arena, entre 1/16 mm y 2 mm.",true],
    ["Una muestra es parda y conserva restos vegetales. Otra es gris y tiene brillo metálico. ¿Qué dos carbones son?","La primera muestra es turba. Se reconoce por el color pardo y los restos vegetales. La segunda es antracita. Se reconoce por el color gris y el brillo metálico."],
    ["¿Qué roca mixta está formada por carbonato de calcio y una parte importante de limo o arcilla?","Es una marga."]
  ]],
  ["Minerales · repaso breve",[
    ["Relaciona los cinco minerales de repaso con una característica.","Cuarzo: es resistente y frecuente en areniscas. Minerales de arcilla: la caolinita es un ejemplo. Yeso: es un sulfato de calcio. Halita: es cloruro de sodio. Calcita: es carbonato de calcio y es el mineral principal de las calizas."]
  ]]
];

const preguntasMecanica = [
  ["Te dan el nombre. Explica cómo actúa",[
    ["¿En qué consiste la termoclastia?",meteorizacionMecanica.termoclastia,true],
    ["¿En qué consiste la gelifracción?",meteorizacionMecanica.gelifraccion],
    ["¿Cómo puede la descompresión fracturar una roca?",meteorizacionMecanica.descompresion],
    ["¿En qué consiste la abrasión?",meteorizacionMecanica.abrasion]
  ]],
  ["Te dan las características. Identifica el mecanismo",[
    ["El viento arrastra arena que, al rozar una roca, va desgastando su superficie. ¿Qué mecanismo actúa? Justifica tu respuesta.",`Abrasión. ${meteorizacionMecanica.abrasion}`],
    ["Una roca llega cerca de la superficie. Al disminuir la presión que soporta, se expande y aparecen grietas. ¿Qué mecanismo actúa? Justifica tu respuesta.",`Descompresión. ${meteorizacionMecanica.descompresion}`],
    ["Tras repetidos calentamientos y enfriamientos, los minerales de una roca se dilatan y se contraen de manera desigual. ¿Qué mecanismo puede acabar fracturándola? Justifica tu respuesta.",`Termoclastia. ${meteorizacionMecanica.termoclastia}`,true],
    ["El agua penetra en una grieta y durante la noche se congela. Con el tiempo, la grieta se ensancha. ¿Qué mecanismo actúa? Justifica tu respuesta.",`Gelifracción. ${meteorizacionMecanica.gelifraccion}`]
  ]]
];
const preguntasQuimica = [
  ["Te dan el nombre. Explica qué ocurre",[
    ["¿En qué consiste la oxidación?",meteorizacionQuimica.oxidacion],
    ["¿En qué consiste la disolución?",meteorizacionQuimica.disolucion],
    ["¿En qué consiste la carbonatación?",meteorizacionQuimica.carbonatacion],
    ["¿En qué consiste la hidrólisis?",meteorizacionQuimica.hidrolisis]
  ]],
  ["Te dan las características. Identifica el mecanismo",[
    ["El agua con dióxido de carbono facilita que se disuelva la calcita. ¿Qué mecanismo actúa?",`Carbonatación. ${meteorizacionQuimica.carbonatacion}`],
    ["Los iones hidrógeno e hidroxilo del agua rompen la estructura cristalina de un mineral. ¿Qué mecanismo actúa?",`Hidrólisis. ${meteorizacionQuimica.hidrolisis}`],
    ["Un sulfuro reacciona con el oxígeno del aire y aparecen óxidos e hidróxidos. ¿Qué mecanismo actúa?",`Oxidación. ${meteorizacionQuimica.oxidacion}`],
    ["El agua entra en contacto con halita y sus iones pasan al agua. ¿Qué mecanismo actúa?",`Disolución. ${meteorizacionQuimica.disolucion}`]
  ]]
];
const preguntasBiologica = [
  ["Te dan el nombre. Explica qué ocurre",[
    ["¿En qué consiste la meteorización biológica? Pon un ejemplo mecánico y otro químico.",`Los seres vivos pueden fragmentar las rocas o alterar sus minerales. ${raicesMeteorizacion} Como ejemplo químico, el oxígeno que aporta la fotosíntesis al agua y al aire favorece la oxidación de minerales.`],
    ["¿Cómo favorece la meteorización la cubierta herbácea?","La cubierta herbácea conserva la humedad del suelo. Esto facilita la oxidación, la carbonatación y la disolución de minerales."]
  ]],
  ["Te dan las características. Identifica el proceso",[
    ["Una raíz crece dentro de una grieta y la ensancha. ¿Qué tipo de meteorización es? ¿Cómo actúa la raíz?",`Es meteorización biológica por acción mecánica. ${raicesMeteorizacion}`],
    ["La respiración de los seres vivos y algunos procesos de descomposición aportan dióxido de carbono al agua. ¿Qué efecto tiene?","La respiración y la descomposición realizada por bacterias y hongos aportan dióxido de carbono al agua. Esto aumenta su acidez y favorece la carbonatación, que facilita, por ejemplo, la disolución de la calcita."],
    ["En una laguna con algas, la fotosíntesis aporta oxígeno al agua. ¿Qué proceso de meteorización puede favorecer?","La oxidación. Al haber más oxígeno, el agua tiene mayor capacidad de oxidar minerales."]
  ]]
];
const gruposMeteorizacion = [null,preguntasMecanica,preguntasQuimica,preguntasBiologica];
const examStar = '<span aria-hidden="true">★ </span>';

const belenStar = '<span class="belen-star" role="img" aria-label="Pregunta destacada" title="Pregunta destacada">★</span>';

function promptCards(entries) {
  return entries.map(([question,answer,destacada])=>`<div class="exam-question"><p>${destacada?belenStar+" ":""}<strong>${question}</strong></p><details><summary aria-label="Ver respuesta modelo: ${question}">Ver respuesta modelo</summary>${modelExplanation(answer)}</details></div>`).join("");
}

function studyPrompts(id,index) {
  if (id==="sedimentarias") {
    if (index!==4) return "";
    return `<div class="study-prompts inline-prompts"><h3>Preguntas de práctica · rocas y minerales sedimentarios</h3>
    ${preguntasRocasSedimentarias.map(([title,entries])=>`<section><h4>${title}</h4>${promptCards(entries)}</section>`).join("")}</div>`;
  }
  if (id==="meteorizacion" && gruposMeteorizacion[index]) {
    const anchors = ["","preguntas-mecanica","preguntas-quimica","preguntas-biologica"];
    return `<div class="study-prompts inline-prompts" id="${anchors[index]}"><h3>Preguntas de práctica sobre mecanismos de meteorización</h3>
    <p>Cuando identifiques un proceso, explica también qué pista te ha ayudado.</p>
    ${gruposMeteorizacion[index].map(([title,entries])=>`<section><h4>${title}</h4>${promptCards(entries)}</section>`).join("")}</div>`;
  }
  const entries = studyQuestions[id]
    .map((question,i)=>({question,block:questionPlacement[id][i]}))
    .filter(entry=>entry.block===index).map(entry=>entry.question);
  const extra = extraQuestions[id]?.[index];
  const complementary = id==="sedimentos" && index===3;
  if (extra && !complementary) entries.push(extra);
  if (!entries.length) return "";
  const confirmed = id==="meta" && index===3;
  let title = entries.length===1 ? "Pregunta de práctica" : "Preguntas de práctica";
  if (confirmed) title = "Serie regional · pregunta segura";
  if (id==="suelo" && index===1) title = "Horizontes del suelo · posible pregunta con dibujo";
  if (id==="suelo" && index===4) title = "Posibles preguntas de examen · Caliche y suelo rocoso";
  if (id==="esfuerzos" && (index===1 || index===2)) title = "Práctica con dibujo · elementos principales";
  return `<div class="study-prompts inline-prompts"><h3>${confirmed?examStar:""}${title}</h3>
  ${promptCards(entries)}
  ${complementary && extra ? `<h4>Repaso complementario</h4>${promptCards([extra])}` : ""}
  ${id==="suelo" && index===1?button("horizontes","Entrenar con perfiles diferentes",true):""}
  ${confirmed?button("serie","Practicar el orden de la serie"):""}
  </div>`;
}
const figureGuides = {
  "15-intrusiones": [
    ["Izquierda · Plutón","Busca la masa gris gruesa y abovedada."],
    ["Centro · Dique","Sigue la lámina gris inclinada que atraviesa varias capas."]
  ],
  "14-depositos": [
    ["Foto izquierda · Depósito gravitacional","Los cantos quedan en el fondo del cauce cuando la corriente pierde energía y deja de transportarlos."],
    ["Foto derecha · Acreción cinética","La barra de arena se forma cuando los granos todavía en movimiento encuentran un obstáculo y se acumulan."]
  ],
  "15-pliegues": [
    ["Plano axial","La flecha superior izquierda señala el plano que pasa por las charnelas de las capas."],
    ["Núcleo","La flecha inferior izquierda señala la zona más interna del pliegue."],
    ["Flancos","La flecha central derecha señala un lado del pliegue. Hay un flanco a cada lado de la charnela."],
    ["Charnela","La flecha inferior derecha apunta a la zona donde la capa se curva más."]
  ],
  "15-fallas": [
    ["Plano de falla","La flecha superior izquierda señala la superficie inclinada por la que se han desplazado los bloques."],
    ["Salto de falla","La flecha de arriba señala el desplazamiento de los bloques. Busca la misma capa a ambos lados y compara su posición."],
    ["Labio hundido","Es el bloque que queda más bajo. Lo indica el recuadro de la izquierda."],
    ["Labio levantado","Es el bloque que queda más alto respecto al otro. Lo indica el recuadro inferior derecho del dibujo principal."],
  ]
};

function figureGuide(file) {
  const rows = figureGuides[file];
  if (!rows) return "";
  const label = file === "14-depositos" ? "Qué muestra cada foto" : "Partes que debes reconocer";
  return `<p><strong>${label}</strong></p><ul class="explanation figure-guide" aria-label="${label}">${rows.map(([term,description])=>`<li><strong>${term}.</strong> ${description}</li>`).join("")}</ul>`;
}

function tectonicStudyFigure() {
  return `<figure class="book-figure tectonic-study">
    <figcaption><strong>Los tres procesos en el dibujo</strong></figcaption>
    <div class="tectonic-labels">
      <div><strong>Magmatismo</strong><span>Subducción → se forma magma.</span></div>
      <div><strong>Metamorfismo</strong><span>Los sedimentos se comprimen y cambian en estado sólido.</span></div>
      <div><strong>Esfuerzos tectónicos</strong><span>Falla transformante → cizalla. Los bloques se mueven de lado.</span></div>
    </div>
    <div class="tectonic-crop" aria-hidden="true">
      <img src="./15-tectonica.webp?v=16" alt="" loading="lazy">
      <span class="tectonic-arrow" style="--x:14.3%;--y:41%;--length:26.2cqw;--angle:-85deg"></span>
      <span class="tectonic-arrow" style="--x:31%;--y:37.5%;--length:30.4cqw;--angle:-52deg"></span>
      <span class="tectonic-arrow" style="--x:45.4%;--y:26.3%;--length:41.6cqw;--angle:-24deg"></span>
    </div>
    <p><a href="./15-tectonica.webp?v=16" target="_blank" rel="noopener">Ver el dibujo completo del libro</a></p>
  </figure>`;
}

function figures(lesson,index) {
  const related = bookImages[lesson.id].filter((_,i)=>figurePlacement[lesson.id][i]===index);
  if (!related.length) return "";
  const galleryClass = lesson.id==="sedimentarias" && index===4 ? " mineral-photos" : "";
  return `<div class="book-figures${galleryClass}">${related.map(([file,title,alt,page,version=lesson.id==="meteorizacion"?15:14])=>file==="15-tectonica" ? tectonicStudyFigure() : `<figure class="book-figure"><a href="./${file}.webp?v=${version}" aria-label="Ampliar en otra pestaña: ${title}" target="_blank" rel="noopener">
    <img src="./${file}.webp?v=${version}" alt="${alt}" loading="lazy"></a><figcaption><strong>${title}.</strong>${figureGuide(file)}</figcaption></figure>`).join("")}</div>`;
}

function lessonBody(lesson,readButtons=false) {
  const isComparison = lesson.id === "esfuerzos";
  const diagram = isComparison
    ? `<ul>${lesson.esquema.map(item => `<li>${item}</li>`).join("")}</ul>`
    : flow(lesson.esquema);
  const listen = title => readButtons ? speaker("Escuchar: "+title,"data-read") : "";
  return `
  ${readButtons && lesson.id==="igneas"?'<p><a class="button primary" href="https://orientadoracarmenmora-max.github.io/rocas_magmaticas/" target="_blank" rel="noopener">Estudiar los tipos de rocas magmáticas (abre otra pestaña)</a></p>':""}
  ${lesson.id === "meteorizacion" ? "" : `<section class="notice"><div class="block-head"><h2>Idea principal</h2>${listen("Idea principal")}</div><div class="explanation">${explanation(lesson.idea)}</div></section>`}
  ${lesson.bloques.map(([title,body,subtopics=[]],index) => {
  const pictures = readButtons ? figures(lesson,index) : "";
  const showPicturesFirst = (lesson.id==="magma" && index<=3) || (lesson.id==="igneas" && index===0) || (lesson.id==="esfuerzos" && index>=1);
  return `<section class="block">
  <div class="block-head"><h2>${title}</h2>${listen(title)}</div>
  ${showPicturesFirst ? pictures : ""}
  <div class="explanation">${explanation(body)}</div>
  ${subtopics.map(([key,heading,content,intro])=>`<section><div class="block-head"><h3>${lesson.id === "suelo" && index === 0 ? `<mark class="soil-factor">${heading}</mark>` : heading}</h3>${listen(heading)}</div>
  <div class="explanation">${Array.isArray(content) ? `${intro ? `<p>${intro}</p>` : ""}${studyPoints(content)}` : explanation(content)}</div>${readButtons ? figures(lesson,key) : ""}</section>`).join("")}
  ${showPicturesFirst ? "" : pictures}
  ${readButtons ? studyPrompts(lesson.id,index) : ""}</section>`;
  }).join("")}
  <section class="block"><h2>${isComparison ? "Relaciones clave" : "Esquema de repaso"}</h2>${diagram}${visual[lesson.id] || ""}</section>
  <section class="block"><div class="block-head"><h2>Ejemplo razonado</h2>${listen("Ejemplo razonado")}</div><div class="explanation">${explanation(lesson.ejemplo)}</div></section>
  `;
}
function printTopic(title,guide,modules) {
  const ids = modules.map(lesson=>lesson.id);
  const questions = banco.filter(question=>ids.includes(question[0]));
  return `<section class="print-theme"><h2>${title}</h2>${guide}
  ${modules.map(lesson=>`<section><h2>${lesson.titulo}</h2>${lessonBody(lesson)}</section>`).join("")}
  <h2>Práctica de reconocimiento</h2><ol>${questions.map(([,prompt,,options])=>`<li>${prompt}<ul>${options.map(option=>`<li>${option}</li>`).join("")}</ul></li>`).join("")}</ol>
  <h2>Soluciones razonadas</h2><ol>${questions.map(([, ,correct,options,reasons])=>`<li><strong>${options[correct]}.</strong> ${reasons[correct]}</li>`).join("")}</ol></section>`;
}
$("printout").innerHTML = `<h1>Procesos geológicos</h1><p>1.º de Bachillerato · Temas 14 y 15</p>
${printTopic("Tema 14 · Procesos geológicos externos",examExternal,externos)}
${printTopic("Tema 15 · Procesos geológicos internos",exam,lecciones)}
<h2>Ordena la serie regional</h2><p>Numera del 1 al 6: esquisto, arcilla, gneis, filita, granito de anatexia y pizarra. Explica en qué momento empieza la fusión.</p>
<h3>Solución</h3><p>${serie.join(" → ")}. Al alcanzarse la anatexia comienza la fusión parcial.</p>
${identificaciones.map(item=>`<section class="block"><h3>Tema ${item.tema} · ${item.titulo}</h3><p>${item.descripcion}</p>
<p><strong>Opciones:</strong> ${item.opciones.join(", ")}.</p><ol>${item.partes.map(([label])=>`<li>${label}.</li>`).join("")}</ol></section>`).join("")}
<h2>Soluciones de identificación</h2>${identificaciones.map(item=>`<section class="block"><h3>${item.titulo}</h3><ol>${item.partes.map(([,correct,why])=>`<li><strong>${correct}.</strong> ${why}</li>`).join("")}</ol></section>`).join("")}
<h2>Actividades con respuesta escrita</h2>${respuestas.map(([theme,,title,prompt])=>`<section class="block"><h3>Tema ${theme} · ${title}</h3><p>${prompt}</p><div class="writing-lines"></div></section>`).join("")}
<h2>Soluciones de la práctica escrita</h2>${respuestas.map(([, ,title,,answer])=>`<section class="block"><h3>${title}</h3>${modelExplanation(answer)}</section>`).join("")}`;
screen.addEventListener("click",event => {
  const trigger = event.target.closest("button[data-read]");
  if (trigger) speak(trigger.closest("section"),trigger);
});

let ordering = [3,5,0,4,1,2];
let quiz = null;
let quizTopic = "";
function shuffled(items) {
  const result = [...items];
  for (let i=result.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [result[i],result[j]] = [result[j],result[i]];
  }
  return result;
}

function sortList() {
  $("sort-list").innerHTML = ordering.map((item,index) => `<li><div class="sort-row"><span>${serie[item]}</span><span>
    <button data-from="${index}" data-step="-1" aria-label="Subir ${serie[item]}" ${index===0?"disabled":""}>Subir</button>
    <button data-from="${index}" data-step="1" aria-label="Bajar ${serie[item]}" ${index===ordering.length-1?"disabled":""}>Bajar</button>
    </span></div></li>`).join("");
}
function sortPage() {
  screen.innerHTML += `<section class="block"><h2>De menor grado a la fusión parcial</h2>
  <p>Usa Subir y Bajar para colocar los materiales. Comprueba el resultado cuando hayas ordenado los seis.</p>
  <ol id="sort-list" class="sort"></ol><p id="sort-change" role="status"></p>
  <div class="actions"><button class="primary" id="check-sort">Comprobar orden</button><button id="shuffle">Mezclar</button></div>
  <div id="sort-feedback" role="status"></div>
  <details><summary>Ver solución razonada</summary>${flow(serie)}<p>Al aumentar el grado metamórfico se pasa de pizarra a filita, esquisto y gneis. La anatexia implica fusión parcial. El granito se forma al cristalizar ese fundido.</p></details></section>`;
  sortList();
  $("sort-list").onclick = event => {
    const move = event.target.closest("button[data-from]");
    if (!move) return;
    const start = Number(move.dataset.from);
    const end = start + Number(move.dataset.step);
    [ordering[start],ordering[end]] = [ordering[end],ordering[start]];
    sortList();
    const same = $("sort-list").querySelector(`[data-from="${end}"][data-step="${move.dataset.step}"]`);
    const reverse = $("sort-list").querySelector(`[data-from="${end}"]:not([data-step="${move.dataset.step}"])`);
    (same.disabled ? reverse : same).focus();
    $("sort-feedback").textContent = "";
    $("sort-change").textContent = `${serie[ordering[end]]} está ahora en la posición ${end+1}.`;
  };
  $("check-sort").onclick = () => {
    const first = ordering.findIndex((item,index) => item !== index);
    if (first < 0) {
      state.sorted = true;
      save();
    }
    const feedback = $("sort-feedback");
    feedback.className = "feedback";
    feedback.textContent = first < 0
      ? "Serie correcta. El granito es ígneo porque cristaliza a partir del fundido de anatexia."
      : `Revisa la posición ${first+1}. ${["Empieza por el material de partida, antes del metamorfismo.","Busca la roca con planos finos que aparece al grado más bajo.","Entre pizarra y esquisto aparece una roca de brillo sedoso.","Busca la roca con foliación marcada y micas visibles.","Antes de la fusión aparece la roca de bandas claras y oscuras.","La última posición corresponde al producto que cristaliza del fundido."][first]}`;
  };
  $("shuffle").onclick = () => {
    const newOrder = shuffled(ordering);
    if (newOrder.every((item,index) => item === index) || newOrder.every((item,index) => item === ordering[index])) {
      newOrder.push(newOrder.shift());
    }
    ordering = newOrder;
    sortList();
    $("sort-feedback").textContent = "";
    $("sort-change").textContent = "Serie mezclada.";
  };
}

const reviewIds = () => banco.map((_,i)=>i).filter(i=>state.answers[i] === false);
function quizMenu() {
  screen.innerHTML += `<section class="block"><h2>Elige un recorrido</h2><p>Elige un tema o un apartado. Responde a las preguntas y comprueba al momento por qué cada respuesta es correcta o incorrecta. Puedes volver a intentar las preguntas que hayas fallado.</p>
  <label for="topic">Preguntas de</label> <select id="topic"><option value="">Los dos temas</option><option value="14">Todo el tema 14</option><option value="15">Todo el tema 15</option>${modulos.map(lesson=>`<option value="${lesson.id}">${lesson.titulo}</option>`).join("")}</select>
  <div class="actions"><button id="start" class="primary">Empezar práctica</button><button id="mistakes" ${reviewIds().length ? "" : "disabled"}>Repetir fallos (${reviewIds().length})</button></div></section><div id="question"></div>`;
  $("start").onclick = () => {
    const topic = $("topic").value;
    quizTopic = topic;
    begin(banco.map((question,index) => {
      const group = externos.some(lesson=>lesson.id===question[0]) ? "14" : "15";
      return !topic || topic===question[0] || topic===group ? index : -1;
    }).filter(index=>index>=0));
  };
  $("mistakes").onclick = () => begin(reviewIds());
  $("topic").value = quizTopic;
  if (quiz) showQuestion(false);
}
function begin(ids) {
  quiz = {ids:shuffled(ids), at:0, score:0, choice:null};
  showQuestion(true);
}
function showQuestion(focus) {
  const target = $("question");
  if (quiz.at === quiz.ids.length) {
    target.innerHTML = `<section class="block"><h2 tabindex="-1">Resultado</h2><p>${quiz.score} de ${quiz.ids.length} respuestas correctas en esta práctica.</p><p>${reviewIds().length} preguntas pendientes en el repaso de fallos.</p>${button("repaso","Ver progreso")}</section>`;
    if (focus) target.querySelector("h2").focus();
    return;
  }
  const id = quiz.ids[quiz.at];
  const [topic,prompt,correct,options,reasons] = banco[id];
  const answered = quiz.choice !== null;
  target.innerHTML = `<section class="block"><h2 tabindex="-1">Pregunta ${quiz.at+1} de ${quiz.ids.length}</h2>
  <form id="answer"><fieldset ${answered?"disabled":""}><legend>${prompt}</legend>
  ${options.map((option,i)=>`<label class="choice"><input type="radio" name="choice" value="${i}" required ${quiz.choice===i?"checked":""}> ${option}</label>`).join("")}
  </fieldset>${answered?"":'<button class="primary">Comprobar respuesta</button>'}</form>
  ${answered ? `<div class="feedback" tabindex="-1" id="answer-feedback"><h3>${quiz.choice===correct?"Correcto":"Revisa esta pista"}</h3>
  ${modelExplanation(reasons[quiz.choice])}${quiz.choice!==correct?`<p><strong>Respuesta correcta: ${options[correct]}.</strong></p>${modelExplanation(reasons[correct])}`:""}
  <a href="#${topic}">Volver a la explicación</a></div>
  <button class="primary" id="next-question">${quiz.at+1===quiz.ids.length?"Ver resultado":"Siguiente pregunta"}</button>`:""}</section>`;
  $("answer").onsubmit = event => {
    event.preventDefault();
    if (quiz.choice !== null) return;
    const value = new FormData(event.target).get("choice");
    if (value === null) return;
    quiz.choice = Number(value);
    const right = quiz.choice === correct;
    if (right) quiz.score++;
    state.answers[id] = right;
    save();
    $("mistakes").textContent = `Repetir fallos (${reviewIds().length})`;
    $("mistakes").disabled = reviewIds().length === 0;
    showQuestion(false);
    $("answer-feedback").focus();
  };
  if (answered) $("next-question").onclick = () => {quiz.at++; quiz.choice=null; showQuestion(true);};
  if (focus) target.querySelector("h2").focus();
}
function reviewPage() {
  const correct = Object.values(state.answers).filter(Boolean).length;
  screen.innerHTML += `<section class="block"><h2>Tu progreso</h2>
  <p>${correct} de ${banco.length} preguntas acertadas en el último intento de cada una.</p>
  <progress aria-label="Preguntas acertadas" max="${banco.length}" value="${correct}"></progress>
  <p>${state.done.length} de ${respuestas.length+identificaciones.length} actividades de examen revisadas.</p>
  <p>Serie regional: ${state.sorted?"completada":"pendiente"}. ${persistent?"El progreso se guarda en este navegador si el almacenamiento está disponible.":"El progreso se conserva durante esta sesión."}</p>
  <button class="primary" id="review-session" ${reviewIds().length?"":"disabled"}>Repasar fallos (${reviewIds().length})</button></section>
  <section class="block"><h2>Repaso rápido</h2><p>Di la idea principal en voz alta y abre la tarjeta para comprobarla.</p>
  ${modulos.map(lesson=>`<details class="card"><summary>${lesson.titulo}</summary><p>${lesson.idea}</p>${button(lesson.id,"Abrir apartado")}</details>`).join("")}</section>`;
  $("review-session").onclick = () => {
    beginReview = true;
    location.hash = "practica";
  };
}

function challengeIllustration(item) {
    const id = item.id;
    if (item.imagen) {
      const [file,alt,page] = item.imagen;
      if (item.marcas) return `<figure class="book-figure photo-exercise"><div class="numbered-photo">
        <img src="./${file}.webp" alt="${alt}" loading="lazy">
        ${item.marcas.map(([n,x,y])=>`<span aria-hidden="true" style="--x:${x};--y:${y}">${n}</span>`).join("")}</div>
        <figcaption>Fotografía del libro.</figcaption></figure>`;
      return `<figure class="book-figure"><a href="./${file}.webp" aria-label="Ampliar imagen del libro" target="_blank" rel="noopener"><img src="./${file}.webp" alt="${alt}" loading="lazy"></a><figcaption>Actividad final del libro.</figcaption></figure>`;
    }
    const profile = (name,layers) => `<figure><ol class="soil-profile soil-variant" aria-label="${name}">${layers.map(([mark,detail])=>`<li><strong>${mark}</strong><span class="sr-only">${detail}</span></li>`).join("")}</ol><figcaption>${name}</figcaption></figure>`;
    if (item.capas) return profile("Perfil 2 · De arriba abajo",item.capas);
    if (item.perfiles) return `<div class="grid">${item.perfiles.map(view=>profile(view.nombre,view.capas)).join("")}</div>`;
    if (id==="volcan") return `<figure><div class="volcano labeled" aria-hidden="true"><span class="cone"></span><span class="vent"></span><span class="chamber"></span><b>A</b><b>B</b><b>C</b><b>D</b></div><figcaption>Corte esquemático. El caso E se describe debajo.</figcaption></figure>`;
    if (id==="clastos") return `<div class="grid sample-grid"><figure><div class="clast-box rounded" aria-hidden="true">${"<span></span>".repeat(16)}</div><figcaption>Muestra A · clastos pequeños y redondeados.</figcaption></figure><figure><div class="clast-box angular" aria-hidden="true">${"<span></span>".repeat(6)}</div><figcaption>Muestra B · clastos grandes y angulosos.</figcaption></figure></div>`;
    if (id==="perfil") return `<figure><ol class="soil-profile" aria-label="Perfil del suelo de arriba abajo"><li>Capa 1</li><li>Capa 2</li><li>Capa 3</li><li>Capa 4</li></ol><figcaption>Corte esquemático del suelo, desde la superficie hasta la roca de partida.</figcaption></figure>`;
    return "";
}

function renderSolvedExam() {
  const profileCards = perfilesConCuatroHorizontes.map(profile => ({
    topic: 14, title: profile.titulo, destacada:true,
    question: "Identifica qué horizonte señala cada una de las cuatro marcas.",
    image: trainingProfile(profile),
    answer: profile.correccion.map(([mark,horizon,why]) =>
      `<strong>Marca ${mark} · Horizonte ${horizon}.</strong> ${why}`)
  }));
  const withImage = {
    "Mira el bloque diagrama.": tectonicStudyFigure,
    "Observa las muestras A y B": () => figures({id:"sedimentos"},3),
    "En el dibujo, señala y define la charnela": () => mockCut("pliegue"),
    "En el dibujo, identifica y define el plano": () => mockCut("falla")
  };
  const cards = [
    ...profileCards,
    ...modulos.flatMap(({id,titulo}) => {
      const topic = externos.some(lesson => lesson.id === id) ? 14 : 15;
      const special = id === "meteorizacion" ? gruposMeteorizacion.filter(Boolean).flatMap(group => group.flatMap(([,entries])=>entries))
        : id === "sedimentarias" ? preguntasRocasSedimentarias.flatMap(([,entries])=>entries) : [];
      return [...(studyQuestions[id] || []), ...Object.values(extraQuestions[id] || {}), ...special].map(([question,answer,destacada]) => ({
        topic, title:topic === 14 && id === "suelo" && /caliche|suelo muy delgada|costra de cal/i.test(question) ? "Posible pregunta de examen · Caliche y suelo rocoso" : titulo, question, answer, destacada:destacada || (id === "meta" && question.startsWith("Ordena la serie regional")),
        image:Object.entries(withImage).find(([start])=>question.includes(start))?.[1]()
      }));
    }),
    ...respuestas.map(([topic,,title,question,answer])=>({topic,title,question,answer})),
    ...identificaciones.map(item=>({
      topic:item.tema, title:item.titulo, question:item.descripcion, image:challengeIllustration(item),
      answer:item.partes.map(([label,correct,why])=>`<strong>${label} · ${correct}.</strong> ${why}`)
    })),
    ...preguntasSimulacro.map(({tema,pregunta,modelo,foto,corte})=>({
      topic:tema,title:"Pregunta de práctica",question:pregunta,answer:modelo,
      image:corte ? mockCut(corte) : foto ? challengeIllustration(identificaciones.find(item=>item.id==="perfil-foto")) : ""
    }))
  ];
  const panel = $("solved-exam");
  const topic = $("solved-topic");
  const onlyPossible = $("solved-only-possible");
  let index = 0;
  function show(focus=false) {
    const visible = cards.filter(card =>
      (!topic.value || card.topic === Number(topic.value)) && (!onlyPossible.checked || card.destacada));
    const {title,question,image,answer} = visible[index];
    panel.innerHTML = `<section class="block">
      <p class="muted">Pregunta ${index+1} de ${visible.length}</p>
      <div class="block-head"><h2 tabindex="-1">${title}</h2>${speaker("Escuchar la pregunta y la respuesta","data-read")}</div>
      <p><strong>${question}</strong></p>${image || ""}
      <h3>Respuesta modelo</h3>${modelExplanation(answer)}
      <div class="actions">
        <button type="button" id="solved-prev" ${index===0?"disabled":""}>Anterior</button>
        <button type="button" id="solved-next" class="primary" ${index===visible.length-1?"disabled":""}>Siguiente</button>
      </div></section>`;
    $("solved-prev").onclick = () => { index--; show(true); };
    $("solved-next").onclick = () => { index++; show(true); };
    if (focus) panel.querySelector("h2").focus();
  }
  topic.onchange = onlyPossible.onchange = () => { index = 0; show(); };
  show();
}

const drafts = new Map();
function renderChallenges() {
  screen.innerHTML += `<p>Lee una posible pregunta y repasa la solución que aparece debajo.</p>
  <label for="solved-topic">Ver preguntas de <select id="solved-topic"><option value="">Los dos temas</option><option value="14">Tema 14</option><option value="15">Tema 15</option></select></label>
  <p><label><input type="checkbox" id="solved-only-possible"> Solo posibles preguntas de examen destacadas</label></p>
  <div id="solved-exam"></div>
  <details><summary>Practicar sin ver la respuesta</summary>
  <div class="challenge-controls">
    <label for="challenge-topic">Tema <select id="challenge-topic"><option value="14">Tema 14</option><option value="15">Tema 15</option></select></label>
    <label for="challenge-mode">Cómo practicar <select id="challenge-mode"><option value="guided">Práctica guiada</option><option value="exam">Como en el examen</option></select></label>
    <label for="challenge-choice">Actividad <select id="challenge-choice"></select></label>
  </div>
  <div id="challenges"></div></details>
  <div class="actions">${button("horizontes","Entrenar horizontes",true)} ${button("simulacro","Simulacro de los dos temas",true)} ${button("practica","Autoevaluación")} ${button("serie","Ordenar la serie regional")}</div>`;
  const choices = $("challenge-choice");
  function refresh() {
    renderChallengeList(choices.value,$("challenge-mode").value==="guided");
  }
  function selectTopic() {
    const topic = Number($("challenge-topic").value);
    const items = identificaciones.filter(item=>item.tema===topic).map(item=>new Option(item.titulo,item.id));
    const written = respuestas.flatMap(([number,,title],i)=>number===topic?[new Option(title,"written-"+i)]:[]);
    choices.replaceChildren(...items,...written);
    refresh();
  }
  $("challenge-topic").onchange = selectTopic;
  $("challenge-mode").onchange = refresh;
  choices.onchange = refresh;
  renderSolvedExam();
  selectTopic();
}
function markChallenge(id,completed) {
  if (completed && !state.done.includes(id)) state.done.push(id);
  if (!completed) state.done = state.done.filter(item=>item!==id);
  save();
}
function renderChallengeList(id,guided) {
  const labels = element => element.partes.map(([label],i)=>`<div class="match-row"><label for="${element.id}-${i}">${element.capas || element.perfiles ? label.split(" · ")[0] : label}</label><select id="${element.id}-${i}" required>
    <option value="">Elige una opción</option>${element.opciones.map(option=>`<option>${option}</option>`).join("")}</select></div>`).join("");
  const selected = identificaciones.find(item=>item.id===id);
  const index = selected ? -1 : Number(id.slice("written-".length));
  if (guided) {
    renderGuidedChallenge(selected,index,challengeIllustration);
    return;
  }
  $("challenges").innerHTML = `
  ${identificaciones.filter(item=>item.id===id).map(item=>`<section class="block"><h3>${item.titulo}</h3><p>${item.descripcion}</p>${challengeIllustration(item)}<form data-match="${item.id}">${labels(item)}
  <button class="primary">Comprobar correspondencias</button></form><div id="feedback-${item.id}" aria-live="polite"></div></section>`).join("")}
  ${selected?"":'<h2 class="section-title">Escribe y justifica</h2>'}
  ${respuestas.map(([number,lesson,title,prompt,answer,check],i)=> i===index ? `<section class="block written">
  <div class="block-head"><h3>Tema ${number} · ${title}</h3>${speaker("Escuchar la actividad "+title,"data-read")}</div>
  <p id="prompt-${i}">${prompt}</p><label for="written-${i}">Tu respuesta</label>
  <textarea id="written-${i}" data-draft="${i}" aria-describedby="prompt-${i}" rows="3"></textarea>
  <button type="button" class="primary" id="exam-written-check">Ver corrección</button>
  <div id="exam-written-review" hidden><h3>Respuesta modelo y criterios</h3>${modelExplanation(answer)}<p><strong>Comprueba:</strong> ${check}</p>
  <label><input type="checkbox" data-complete="written-${i}" ${state.done.includes("written-"+i)?"checked":""}> He comparado mi respuesta</label></div>
  <p><a href="#${lesson}">Consultar la explicación</a></p></section>` : "").join("")}`;
  for (const textarea of $("challenges").querySelectorAll("[data-draft]")) {
    textarea.value = drafts.get(textarea.dataset.draft) || "";
    textarea.oninput = () => drafts.set(textarea.dataset.draft,textarea.value);
    $("exam-written-check").onclick = () => {
      if (!textarea.value.trim()) {
        textarea.setCustomValidity("Escribe tu respuesta antes de ver la corrección.");
        textarea.reportValidity();
        textarea.focus();
        textarea.setCustomValidity("");
        return;
      }
      $("exam-written-review").hidden = false;
      $("exam-written-review").setAttribute("tabindex","-1");
      $("exam-written-review").focus();
    };
  }
  for (const check of $("challenges").querySelectorAll("[data-complete]")) {
    check.onchange = () => markChallenge(check.dataset.complete,check.checked);
  }
  for (const form of $("challenges").querySelectorAll("[data-match]")) {
    form.onsubmit = event => {
      event.preventDefault();
      const item = identificaciones.find(challenge=>challenge.id===form.dataset.match);
      const rows = item.partes.map(([label,correct,why],i)=> {
        const choice = $(item.id+"-"+i).value;
        return {label,correct,why,right: choice===correct};
      });
      const feedback = $("feedback-"+item.id);
      feedback.className = "feedback";
      const score = rows.filter(row=>row.right).length;
      feedback.innerHTML = `<h3>${score} de ${rows.length} correctas</h3><ul>${rows.map(row=>`<li><strong>${row.right?"Correcto":"Revisa"} · ${row.label}.</strong> ${row.correct}. ${row.why}</li>`).join("")}</ul>`;
      if (item.final) {
        const note = document.createElement("p");
        note.textContent = item.final;
        feedback.append(note);
      }
      if (score===rows.length) markChallenge(item.id,true);
    };
  }
}

function renderGuidedChallenge(item,index,illustration) {
  const area = $("challenges");
  const written = item ? null : respuestas[index];
  const title = item?.titulo || written[2];
  const [caseText,solution] = ejemplosGuiados[item ? temasIdentificacion[item.id] : written[1]];
  const steps = item?.partes || consignasEscritas[index];
  const activityId = item?.id || "written-"+index;
  let step = 0;
  let allCorrect = true;

  function showExample(focus=false) {
    area.innerHTML = `<section class="block"><h2 tabindex="-1">${title}</h2>
    <div class="notice"><h3>Ejemplo resuelto</h3><p>${caseText}</p><p><strong>Respuesta y pista.</strong> ${solution}</p></div>
    <button class="primary" id="guided-start">Empezar actividad</button></section>`;
    $("guided-start").onclick = () => showStep();
    if (focus) area.querySelector("h2").focus();
  }

  function showStep() {
    stopSpeech();
    const current = steps[step];
    const prompt = item ? current[0] : current;
    const label = item?.capas || item?.perfiles ? "Identifica " + prompt.split(" · ")[0] + "." : prompt;
    area.innerHTML = `<section class="block">
      <div class="block-head"><h2 tabindex="-1">${title}</h2>${speaker("Escuchar el paso","data-read")}</div>
      <p><strong>Paso ${step+1} de ${steps.length}</strong></p>
      ${item ? illustration(item) : `<p>${contextosEscritos[index]}</p>`}
      ${item?.capas || item?.perfiles ? `<details><summary>Ver una pista</summary><p>${prompt.split(" · ")[1]}</p></details>` : ""}
      <form id="guided-form"><p id="guided-prompt"><strong>${label}</strong></p>
      ${item ? `<label for="guided-answer">Elige una respuesta</label>
        <select id="guided-answer" aria-describedby="guided-prompt" required><option value="">Selecciona una opción</option>${item.opciones.map(option=>`<option>${option}</option>`).join("")}</select>`
        : '<label for="guided-answer">Escribe tu respuesta</label><textarea id="guided-answer" rows="3" aria-describedby="guided-prompt" required></textarea>'}
      <div class="actions"><button class="primary">${item?"Comprobar respuesta":"Guardar y continuar"}</button></div></form>
      <div id="guided-feedback" tabindex="-1"></div>
    </section>`;
    if (!item) {
      const key = activityId+"-step-"+step;
      $("guided-answer").value = drafts.get(key) || "";
      $("guided-answer").oninput = event => drafts.set(key,event.target.value);
    }
    $("guided-form").onsubmit = event => {
      event.preventDefault();
      const field = $("guided-answer");
      if (!field.value.trim()) { field.focus(); return; }
      if (!item) { advance(); return; }
      const right = field.value === current[1];
      allCorrect &&= right;
      field.disabled = true;
      event.submitter.disabled = true;
      $("guided-feedback").className = "feedback";
      $("guided-feedback").innerHTML = `<h3>${right?"Correcto":"Revisa esta pista"}</h3><p><strong>${current[1]}.</strong> ${current[2]}</p>
        <button class="primary" id="guided-next">${step+1===steps.length?"Ver resultado":"Siguiente paso"}</button>`;
      $("guided-feedback").focus();
      $("guided-next").onclick = advance;
    };
    area.querySelector("h2").focus();
  }

  function advance() {
    if (++step < steps.length) { showStep(); return; }
    if (item && allCorrect) markChallenge(activityId,true);
    area.innerHTML = `<section class="block"><h2 tabindex="-1">Actividad completada</h2>
      ${item ? `<p>${allCorrect?"Has acertado todos los pasos.":"Puedes repetir la actividad para repasar los pasos que fallaste."}</p>${item.final?`<p>${item.final}</p>`:""}`
      : `<h3>Tus respuestas</h3><ol id="guided-replies"></ol><h3>Respuesta modelo</h3>${modelExplanation(written[4])}<p><strong>Comprueba.</strong> ${written[5]}</p>
        <label><input type="checkbox" id="guided-reviewed" ${state.done.includes(activityId)?"checked":""}> He comparado mis respuestas</label>`}
      <div class="actions"><button id="guided-repeat">Volver al ejemplo</button><button class="primary" id="guided-choose">Elegir otra actividad</button></div></section>`;
    if (!item) {
      for (const [i,prompt] of steps.entries()) {
        const li = document.createElement("li");
        li.textContent = prompt+" "+(drafts.get(activityId+"-step-"+i) || "");
        $("guided-replies").append(li);
      }
      $("guided-reviewed").onchange = event => markChallenge(activityId,event.target.checked);
    }
    $("guided-repeat").onclick = () => { step=0; allCorrect=true; showExample(true); };
    $("guided-choose").onclick = () => $("challenge-choice").focus();
    area.querySelector("h2").focus();
  }
  showExample();
}

const mockCuts = {
  pliegue: {
    title:"Corte 1",
    description:"Varias capas se curvan. A apunta a la parte de arriba donde una capa se curva más. B apunta a un lado inclinado. C apunta a la línea vertical discontinua. D señala la zona interior, bajo las capas curvadas.",
    layers:`<path d="M22 171C85 170 111 58 180 58S275 170 338 171V221H22Z" fill="#dbb685"/>
      <path d="M22 187C85 186 111 79 180 79S275 186 338 187" fill="none" stroke="#8a4f35" stroke-width="8"/>
      <path d="M22 205C85 204 111 101 180 101S275 204 338 205" fill="none" stroke="#5f7863" stroke-width="8"/>
      <path d="M22 221C85 220 111 124 180 124S275 220 338 221" fill="none" stroke="#795133" stroke-width="7"/>
      <path d="M180 34V145" stroke="#23374b" stroke-width="2" stroke-dasharray="5 5"/>`,
    marks:[["A",94,46,174,58],["B",288,72,248,121],["C",233,23,180,39],["D",270,169,180,156]]
  },
  falla: {
    title:"Corte 2",
    description:"Las capas están interrumpidas y desplazadas a lo largo de una línea inclinada. A señala la línea de rotura. B señala los dos bloques a ambos lados. C señala la separación vertical entre dos líneas de referencia de la misma capa.",
    layers:`<path d="M22 52H215L151 218H22Z" fill="#ecd1a6"/>
      <path d="M215 52H338V218H151Z" fill="#ecd1a6"/>
      <path d="M22 92H200M185 130H338" stroke="#87543a" stroke-width="10"/>
      <path d="M22 136H183M168 174H338" stroke="#5f7863" stroke-width="12"/>
      <path d="M22 179H167M152 217H338" stroke="#87543a" stroke-width="8"/>
      <path d="M215 52L151 218" stroke="#26343a" stroke-width="4"/>
      <path d="M201 92H301M185 130H301" stroke="#26343a" stroke-width="1.7" stroke-dasharray="5 4"/>
      <path d="M292 92v38m-5-38h10m-10 38h10" stroke="#26343a" stroke-width="2.5" fill="none"/>`,
    marks:[["A",230,37,207,74],["B",82,34,82,72],["B",279,196,264,158],["C",324,106,292,110]]
  }
};
function mockCut(key) {
  const {title,description,layers,marks} = mockCuts[key];
  return `<figure class="mock-cut">
    <svg viewBox="0 0 360 240" role="img" aria-label="${description}">
      ${layers}
      ${marks.map(([label,x,y,endX,endY])=>`<path d="M${x} ${y}L${endX} ${endY}" stroke="#27323a" stroke-width="2" fill="none"/><circle cx="${endX}" cy="${endY}" r="3" fill="#27323a"/><circle cx="${x}" cy="${y}" r="13" fill="#fffdf8" stroke="#27323a" stroke-width="2"/><text x="${x}" y="${y}" dominant-baseline="central" text-anchor="middle" fill="#23232b" font-size="15" font-weight="700">${label}</text>`).join("")}
    </svg>
    <figcaption>${title} · Esquema de examen</figcaption>
  </figure>`;
}

const mockDraft = new Map();
let mockSubmitted = false;
function renderMock() {
  const photo = identificaciones.find(item=>item.id==="perfil-foto");
  const numbered = `<figure class="book-figure photo-exercise"><div class="numbered-photo">
    <img src="./14-podsol.webp" alt="${photo.imagen[1]}">
    ${photo.marcas.map(([number,x,y])=>`<span aria-hidden="true" style="--x:${x};--y:${y}">${number}</span>`).join("")}</div>
    <figcaption>Perfil del suelo.</figcaption></figure>`;
  screen.innerHTML += `<p>${preguntasSimulacro.length} preguntas de los temas 14 y 15. Responde con los términos del libro. La corrección aparece al entregar.</p>
    <form id="mock-form"><ol class="mock-list">${preguntasSimulacro.map(({tema,pregunta,foto,campos,corte},i)=>`<li class="block">
    <section><div class="block-head"><h2>Pregunta ${i+1} · Tema ${tema}</h2>${speaker("Escuchar la pregunta "+(i+1),"data-read")}</div>
    <p id="mock-prompt-${i}">${pregunta}</p>${foto ? numbered : ""}${corte ? mockCut(corte) : ""}
    ${(campos||[]).map(([label,options],j)=>`<div class="match-row"><label for="mock-${i}-${j}">${label}</label><select data-mock id="mock-${i}-${j}">
    <option value="">Elige una opción</option>${options.map(option=>`<option>${option}</option>`).join("")}</select></div>`).join("")}
    <label for="mock-written-${i}">${foto?"Tu justificación":"Tu respuesta"}</label><textarea data-mock id="mock-written-${i}" aria-describedby="mock-prompt-${i}" rows="3"></textarea>
    </section></li>`).join("")}</ol><button class="primary">Entregar y ver la corrección</button></form><div id="mock-result"></div>`;
  const form = $("mock-form");
  for (const field of form.querySelectorAll("[data-mock]")) {
    field.value = mockDraft.get(field.id) || "";
    field.readOnly = mockSubmitted;
    if (field.tagName==="SELECT") field.disabled = mockSubmitted;
    field.addEventListener("input",()=>mockDraft.set(field.id,field.value));
  }
  function showResult(focus) {
    form.querySelector("button[type=submit], :scope > button").hidden = true;
    $("mock-result").innerHTML = `<section class="notice"><h2 tabindex="-1">Corrección del simulacro</h2>
    <p>Compara tus respuestas escritas con el modelo. En la imagen se comprueba también cada horizonte que elegiste.</p></section>
    <ol class="mock-list">${preguntasSimulacro.map(({modelo,campos},i)=>`<li class="block"><h3>Pregunta ${i+1}</h3>
    ${(campos||[]).map(([label,,answer],j)=>`<p><strong>${label} · ${mockDraft.get("mock-"+i+"-"+j)===answer?"Correcto":"Revisa"}.</strong> ${answer}.</p>`).join("")}
    <p><strong>Tu respuesta</strong></p><p id="mock-reply-${i}"></p><p><strong>Respuesta modelo</strong></p>${modelExplanation(modelo)}</li>`).join("")}</ol>
    <button id="mock-restart">Hacer otro intento</button>`;
    preguntasSimulacro.forEach((_,i)=>{ $("mock-reply-"+i).textContent=mockDraft.get("mock-written-"+i)?.trim() || "Sin respuesta escrita."; });
    $("mock-restart").onclick = () => { mockDraft.clear(); mockSubmitted=false; render(true); };
    if (focus) $("mock-result").querySelector("h2").focus();
  }
  form.onsubmit = event => {
    event.preventDefault();
    if (mockSubmitted) return;
    mockSubmitted = true;
    for (const field of form.querySelectorAll("[data-mock]")) {
      mockDraft.set(field.id,field.value);
      if (field.tagName==="SELECT") field.disabled = true;
      else field.readOnly = true;
    }
    showResult(true);
  };
  if (mockSubmitted) showResult(false);
}

const pistasHorizontes = [
  ["O","Es la capa superficial de hojas y otros restos orgánicos."],
  ["A","Es la capa de lavado, situada justo debajo del mantillo."],
  ["B","Está debajo del horizonte A y acumula parte del material arrastrado."],
  ["C","Es la capa profunda con fragmentos y restos de la roca madre."]
];

const perfilesConCuatroHorizontes = [
  {titulo:"Fotografía del libro", foto:"cuatro-horizontes",
   alt:"B señala la banda superficial junto a la vegetación. D señala la franja oscura inferior. A señala la capa intermedia con algunos fragmentos. C señala el material rocoso del fondo.",
   marcas:[["B",33,12],["D",35,76],["A",48,76],["C",83,76]],
   correccion:["B","D","A","C"].map((tag,i)=>[tag,...pistasHorizontes[i]])},
  ...[
    ["Perfil bajo vegetación", "DBAC", ["#503727","#956247","#b0774d","#d6bb95"], [12,29,37,22]],
    ["Perfil con mantillo fino", "CADB", ["#3b2b23","#65493b","#ac6343","#c6a880"], [9,25,24,42]],
    ["Perfil con capa intermedia gruesa", "ACBD", ["#45372f","#a79478","#aa765a","#c9bcae"], [13,18,51,18]],
    ["Perfil con capa inferior pedregosa", "BDCA", ["#403026","#765b49","#95654e","#aaa090"], [12,22,22,44]],
    ["Perfil con mantillo grueso", "DCAB", ["#644938","#97745b","#925231","#bab099"], [19,27,34,20]]
  ].map(([titulo,tags,colors,depths])=>({
    titulo,
    capas:[...tags].map((tag,i)=>[tag,colors[i],depths[i],[
      "Restos de hojas en la superficie.","Tierra con raíces bajo los restos superficiales.",
      "Franja intermedia con acumulaciones.","Fragmentos de roca en la parte inferior."
    ][i]]),
    correccion:[...tags].map((tag,i)=>[tag,...pistasHorizontes[i]])
  }))
];

function trainingProfile(profile) {
  if (profile.foto) return `<figure class="book-figure photo-exercise">
    <div class="numbered-photo"><img src="./14-perfil-${profile.foto}.webp" alt="${profile.alt}">
    ${profile.marcas.map(([tag,y,x])=>`<span aria-hidden="true" style="--x:${x}%;--y:${y}%">${tag}</span>`).join("")}</div>
    <figcaption>Fotografía del libro</figcaption></figure>`;
  const textures = ["roots","dots","gravel"];
  return `<figure class="profile-training-drawing"><div class="profile-training-column" role="img" aria-label="${profile.capas.map(([tag,,,alt])=>tag+". "+alt).join(" ")}">
    ${profile.capas.map(([tag,color,depth],i)=>`<div aria-hidden="true" class="soil-band ${textures[i===profile.capas.length-1 ? 2 : Math.min(i,1)]}" style="--soil:${color};--depth:${depth}"><b>${tag}</b></div>`).join("")}
    </div><figcaption>Dibujo esquemático del perfil</figcaption></figure>`;
}

function renderSoilTraining() {
  screen.innerHTML += '<div id="soil-training"></div>';
  const area = $("soil-training");
  let current = 0;
  const corrected = new Set();
  const order = perfilesConCuatroHorizontes.map((_,index)=>index);
  const attempts = [];
  function example(focus=false) {
    area.innerHTML = `<section class="block"><h2 tabindex="-1">Ejemplo guiado</h2>
      <p>Observa la flecha de la foto del libro. Señala la franja clara que está encima de la franja ocre.</p>
      <figure class="book-figure photo-exercise"><img src="./14-podsol.webp" alt="Un perfil de suelo. Una flecha verde señala una franja clara encima de una franja de color ocre."><figcaption>Fotografía del libro.</figcaption></figure>
      <p><strong>Respuesta.</strong> En el perfil del libro, la franja señala el <strong>horizonte A</strong>, donde predomina el <strong>lavado</strong>. En el <strong>horizonte B</strong>, situado debajo, se acumula parte del material arrastrado.</p>
      <p>En los perfiles de práctica, fíjate en la posición y en los materiales. Los colores y el grosor de las capas pueden cambiar.</p>
      <button id="soil-start" class="primary">Ver el primer perfil</button></section>`;
    $("soil-start").onclick = question;
    if (focus) area.querySelector("h2").focus();
  }
  function question() {
    const profile = perfilesConCuatroHorizontes[order[current]];
    const isLastProfile = current + 1 === order.length;
    area.innerHTML = `<section class="block"><h2 tabindex="-1">Perfil ${current+1} de ${order.length}</h2><h3>${profile.titulo}</h3>
      <p>Observa el perfil y elige un horizonte para cada una de las cuatro marcas.</p>
      ${trainingProfile(profile)}
      <form id="soil-form">${[...profile.correccion].sort(([a],[b])=>a.localeCompare(b)).map(([tag],i)=>`<div class="match-row"><label for="soil-response-${i}">Marca ${tag}</label><select id="soil-response-${i}"><option value="">Elige un horizonte</option>${["O","A","B","C"].map(h=>`<option value="${h}">Horizonte ${h}</option>`).join("")}</select></div>`).join("")}
      <div class="actions">
        <button type="button" id="soil-previous" ${current===0?"disabled":""}>Perfil anterior</button>
        <button type="submit" class="primary">Corregir perfil</button>
        <button type="button" id="soil-next">${isLastProfile?"Repetir perfiles":"Siguiente perfil"}</button>
      </div></form><div id="soil-result" hidden></div></section>`;
    const rows = [...profile.correccion].sort(([a],[b])=>a.localeCompare(b));
    const fields = rows.map((_,i)=>$("soil-response-"+i));
    fields.forEach((field,i)=>{ field.value=attempts[current]?.[i] ?? ""; });
    function saveAnswers() {
      attempts[current]=fields.map(field=>field.value);
    }
    $("soil-previous").onclick = () => {
      if (current===0) return;
      saveAnswers();
      current--;
      question();
    };
    function showCorrection(focus=false) {
      const result = $("soil-result");
      result.hidden = false;
      result.innerHTML = `<h3 tabindex="-1">Corrección del perfil ${current+1}</h3>
        <ul class="study-points">${rows.map(([tag,expected,why],i)=>{
          const answer = attempts[current][i];
          const status = answer ? (answer===expected?"Correcto":"Revisa") : "Sin responder";
          return `<li><strong>Marca ${tag} · ${status}.</strong> ${answer?`Elegiste el horizonte ${answer}. `:""}Corresponde al <strong>horizonte ${expected}</strong>. ${why}</li>`;
        }).join("")}</ul>`;
      if (focus) result.querySelector("h3").focus();
    }
    fields.forEach(field => { field.onchange = () => {
      corrected.delete(current);
      $("soil-result").hidden = true;
    }; });
    $("soil-form").onsubmit = event => {
      event.preventDefault();
      saveAnswers();
      corrected.add(current);
      showCorrection(true);
    };
    $("soil-next").onclick = () => {
      saveAnswers();
      if (isLastProfile) {
        current=0;
        attempts.length=0;
        corrected.clear();
        order.push(order.shift());
      } else {
        current++;
      }
      question();
    };
    if (corrected.has(current)) showCorrection();
    area.querySelector("h2").focus();
  }
  example();
}

let beginReview = false;
const titles = {inicio:"Procesos geológicos",externos:"Procesos geológicos externos",internos:"Procesos geológicos internos",retos:"Actividades de examen",horizontes:"Entrena con distintos perfiles",simulacro:"Simulacro de examen",examen:"Qué entra en el examen",serie:"Ordena la serie regional",practica:"Autoevaluación",repaso:"Repaso y progreso"};
function render(focus) {
  stopSpeech();
  const hash = location.hash.slice(1);
  const lesson = modulos.find(item => item.id === hash);
  const page = lesson || Object.hasOwn(titles,hash) ? hash : "inicio";
  const title = lesson?.titulo || titles[page];
  for (const link of document.querySelectorAll("nav a")) {
    const group = lesson && (lesson.tema === 14 ? "externos" : "internos");
    if (link.hash === "#" + (group || page)) link.setAttribute("aria-current","page");
    else link.removeAttribute("aria-current");
  }
  document.body.classList.toggle("cover",page === "inicio");
  screen.innerHTML = page === "inicio" ? `<h1 class="sr-only" tabindex="-1">Procesos geológicos · Temas 14 y 15</h1>
  <div class="cover-choices">
  <a class="cover-link external" href="#externos">Tema 14</a>
  <a class="cover-link internal" href="#internos">Tema 15</a>
  </div>` : `<h1 tabindex="-1">${title}</h1>`;
  if (page === "examen") {
    screen.innerHTML += `<p>Según las indicaciones del audio. La serie regional es la pregunta anunciada como segura.</p><nav class="actions" aria-label="Ir a un tema"><a class="button" href="#alcance-tema-14" data-exam-jump>Tema 14</a><a class="button" href="#alcance-tema-15" data-exam-jump>Tema 15</a></nav><h2 id="alcance-tema-14" tabindex="-1">Tema 14 · Procesos externos</h2>${examExternal}<h2 id="alcance-tema-15" class="section-title" tabindex="-1">Tema 15 · Procesos internos</h2>${exam}`;
    screen.querySelectorAll("[data-exam-jump]").forEach(link => {
      link.onclick = event => {
        event.preventDefault();
        const heading = $(link.hash.slice(1));
        heading.focus();
        heading.scrollIntoView({block:"start"});
      };
    });
  }
  if (page === "externos" || page === "internos") {
    const group = page === "externos" ? externos : lecciones;
    screen.innerHTML += `<p class="kicker">Tema ${page==="externos"?14:15}</p><div class="grid">${group.map(item=>`<section class="card"><h2><a href="#${item.id}">${item.titulo}</a></h2><div class="explanation">${explanation(item.idea)}</div></section>`).join("")}</div>`;
  }
  if (page === "retos") renderChallenges();
  if (page === "horizontes") renderSoilTraining();
  if (page === "simulacro") renderMock();
  if (page === "serie") sortPage();
  if (page === "practica") {
    quizMenu();
    if (beginReview && reviewIds().length) begin(reviewIds());
    beginReview = false;
  }
  if (page === "repaso") reviewPage();
  if (lesson) {
    const group = lesson.tema === 14 ? externos : lecciones;
    const next = group[group.indexOf(lesson)+1];
    screen.innerHTML += lessonBody(lesson,true) + `<div class="actions">
    <button class="primary" id="lesson-quiz">Practicar este apartado</button>${next?button(next.id,"Siguiente apartado"):""}</div>`;
    $("lesson-quiz").onclick = () => {
      quizTopic = page;
      quiz = {ids:shuffled(banco.map((q,i)=>q[0]===page?i:-1).filter(i=>i>=0)),at:0,score:0,choice:null};
      location.hash = "practica";
    };
  }
  if (focus) {
    const heading = screen.querySelector("h1");
    if (window.matchMedia("(max-width: 740px)").matches) heading.focus();
    else { window.scrollTo(0,0); heading.focus({preventScroll:true}); }
  }
}
window.addEventListener("hashchange",()=>render(true));
render(false);
