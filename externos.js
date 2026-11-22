"use strict";

const meteorizacionMecanica = {
 "gelifraccion": "El agua penetra en las grietas. Al congelarse, aumenta de volumen y ejerce presión sobre sus paredes. Esa presión puede fragmentar la roca.",
 "descompresion": "Una roca se forma en profundidad, a gran presión. Cuando asciende hacia la superficie, la presión disminuye. Al disminuir la presión, la roca se expande y puede fragmentarse.",
 "abrasion": "Los clastos que transportan el viento, el agua o el hielo desgastan la roca por rozamiento.",
 "termoclastia": "En una roca expuesta al sol pueden producirse grandes diferencias de temperatura entre su superficie y su interior. Esto provoca dilataciones desiguales que pueden fracturar y fragmentar la roca."
};
const raicesMeteorizacion = "Las raíces de los árboles ensanchan las grietas de forma parecida a la gelifracción.";

const meteorizacionQuimica = {
 oxidacion: "Algunos minerales, como los sulfuros, reaccionan con el oxígeno y forman óxidos e hidróxidos.",
 disolucion: "En contacto con el agua, los minerales solubles se separan en iones que pasan al agua. Algunos ejemplos son la halita, la silvina, la carnalita y el yeso.",
 carbonatacion: "El agua con dióxido de carbono facilita la disolución de algunos minerales, como la calcita.",
 hidrolisis: "Los iones de hidrógeno (H⁺) e hidroxilo (OH⁻) presentes en el agua rompen la estructura cristalina de un mineral. Los carbonatos y los feldespatos son más solubles en medio ácido. El cuarzo es más soluble en medio alcalino."
};

const definicionEdafizacion = "La edafización es el proceso por el que el detrito, también llamado regolito, se transforma en un suelo fértil.";
const factoresEdafizacion = [
 ["Presencia de seres vivos", [
   "Mezclan los componentes del detrito.",
   "Aumentan la <strong>porosidad</strong> y la capacidad de retener agua.",
   "Al <strong>aportar sustancias</strong>, favorecen la meteorización química.",
   "La <strong>descomposición de los restos orgánicos</strong> forma <strong>humus</strong>."
 ], "Los seres vivos actúan de forma <strong>mecánica</strong> y <strong>química</strong> sobre el suelo en formación."],
 ["Pendiente del terreno", [
   "En <strong>pendientes pronunciadas</strong>, el detrito puede desplazarse, lo que impide la formación del suelo (edafización).",
   "En <strong>zonas llanas</strong>, el detrito es más estable y se favorece la formación del suelo (edafización)."
 ]],
 ["El clima", [
   "En <strong>climas húmedos y cálidos</strong>, hay más actividad biológica. El suelo se forma más deprisa.",
   "En <strong>climas glaciares y desérticos</strong>, hay menos actividad biológica. Por eso es más difícil que se forme el suelo."
 ]],
 ["El tiempo", [
   "El suelo tarda décadas o siglos en formarse."
 ]],
 ["Otros factores", [
   "El tipo de roca de partida.",
   "El aporte de sedimentos por los agentes geológicos.",
   "La cantidad de nutrientes inorgánicos, como los nitratos y los fosfatos."
 ]]
];

const resumenFactorEdafizacion = ([, puntos, introduccion]) =>
 [introduccion, ...puntos].filter(Boolean).join(" ").replace(/<\/?strong>/g, "");

const horizontesDelSuelo = [
 "El <strong>horizonte O</strong> (cero) es el <strong>mantillo superficial</strong>, reconocible por las hojas y otros restos orgánicos. Los descomponedores transforman parte de esos restos en <strong>humus</strong>.",
 "En el <strong>horizonte A</strong>, el agua de lluvia que se infiltra arrastra sustancias solubles y algunos componentes del humus. Por eso es la zona de <strong>lavado</strong>.",
 "El <strong>horizonte B</strong> se encuentra por debajo del A y <strong>acumula</strong> parte del material arrastrado.",
 "El <strong>horizonte C</strong> contiene fragmentos y restos de la meteorización de la <strong>roca madre</strong>."
];

const relacionTransporteTextural = "Cuanto más largo es el transporte, más pequeños y redondeados se hacen los clastos.";

const madurezMineralogica = [
 "La <strong>madurez mineralógica</strong> indica cuánto ha cambiado la <strong>composición mineral</strong> del sedimento durante la alteración. Los minerales que se alteran con facilidad van siendo menos abundantes.",
 "El <strong>cuarzo</strong> resiste mejor la alteración. Por eso aumenta su proporción respecto a otros minerales. Si abunda, indica una <strong>madurez mineralógica alta</strong>.",
 "Las <strong>micas</strong> y los <strong>feldespatos</strong> pueden alterarse y formar <strong>minerales de arcilla</strong>. En el ejemplo del tema, su abundancia también puede indicar una <strong>alteración química prolongada</strong>."
];

const origenRocasDetriticas = "Las rocas <strong>detríticas</strong> se forman por la <strong>acumulación de clastos</strong>, es decir, fragmentos de otras rocas. La erosión los pone en movimiento, se transportan y se acumulan. Para reconocerlas, fíjate en el <strong>tamaño de los clastos</strong>.";
const tiposRocasDetriticas = [
 "<strong>Conglomerado.</strong> Predominan los clastos de <strong>más de 2 mm</strong>.",
 "<strong>Pudinga.</strong> Es un conglomerado con cantos <strong>redondeados</strong>.",
 "<strong>Brecha.</strong> Es un conglomerado con fragmentos <strong>angulosos</strong>.",
 "<strong>Arenisca.</strong> Tiene granos de <strong>entre 1/16 y 2 mm</strong>. El cuarzo suele ser abundante.",
 "<strong>Limo.</strong> Sus clastos miden <strong>entre 1/256 y 1/16 mm</strong>.",
 "<strong>Arcilla.</strong> Sus clastos miden <strong>menos de 1/256 mm</strong>."
];

const composicionCarbonatadas = [
 "<strong>Caliza.</strong> Está compuesta principalmente por <strong>calcita</strong> (carbonato de calcio).",
 "<strong>Dolomía.</strong> Contiene <strong>calcita y dolomita</strong>. La dolomita es un carbonato de calcio y magnesio."
];

const rocasEvaporiticas = [
 "Se forman cuando se <strong>evapora el agua</strong> del mar o de lagos salobres. Las <strong>sales disueltas</strong> quedan y forman cristales.",
 "En las rocas de <strong>yeso</strong> predomina el mineral yeso. También pueden contener minerales de arcilla.",
 "En las rocas de <strong>sales</strong> aparecen minerales como la <strong>halita</strong>, la silvina y la carnalita."
];

const externos = [
{
 id:"meteorizacion", titulo:"Meteorización", paginas:"268–269", tema:14,
 idea:"La <strong>meteorización</strong> es la <strong>fragmentación física</strong> de las rocas o la <strong>alteración química</strong> de sus minerales en la superficie terrestre, en el lugar donde se encuentran. La <strong>erosión</strong> consiste en la retirada y movilización de materiales por agentes como el agua, el viento o el hielo.",
 bloques:[
 ["Tres formas de alterar una roca","La <strong>meteorización</strong> es la alteración de las rocas en la superficie terrestre por la acción de los agentes atmosféricos y los seres vivos. La meteorización <strong>mecánica</strong> fragmenta la roca sin modificar su composición mineralógica o química. La <strong>química</strong> altera la <strong>composición química</strong> de los minerales que componen la roca. La <strong>biológica</strong> se debe a la actividad de los seres vivos y puede actuar de forma mecánica o química. Los fragmentos se llaman <strong>clastos</strong>. Si se acumulan donde se han formado, constituyen el <strong>detrito</strong>."],
 ["Meteorización mecánica",`<strong>Gelifracción.</strong> ${meteorizacionMecanica.gelifraccion} <strong>Descompresión.</strong> ${meteorizacionMecanica.descompresion} <strong>Abrasión.</strong> ${meteorizacionMecanica.abrasion} <strong>Termoclastia.</strong> ${meteorizacionMecanica.termoclastia}`],
 ["Meteorización química",`<strong>Oxidación.</strong> ${meteorizacionQuimica.oxidacion} <strong>Disolución.</strong> ${meteorizacionQuimica.disolucion} <strong>Carbonatación.</strong> ${meteorizacionQuimica.carbonatacion} <strong>Hidrólisis.</strong> ${meteorizacionQuimica.hidrolisis}`],
 ["Meteorización biológica",`Se debe a la acción de los seres vivos y puede ser mecánica o química. La <strong>fotosíntesis</strong> aporta oxígeno al agua y al aire, lo que aumenta su capacidad de oxidar minerales. La <strong>cubierta herbácea</strong> conserva la humedad del suelo y favorece la oxidación, la carbonatación y la disolución de minerales. La <strong>respiración</strong> de los seres vivos y algunos procesos de <strong>descomposición</strong> realizados por bacterias y hongos aportan dióxido de carbono al agua. Así aumentan su acidez y su capacidad de producir carbonatación. ${raicesMeteorizacion.replace("raíces","<strong>raíces</strong>")}`]
 ],
 esquema:["Roca expuesta","Alteración física, química o biológica","Clastos y material alterado"],
 ejemplo:"Un bloque se agrieta tras repetidos calentamientos y enfriamientos, sin agua que se congele. La pista es la dilatación desigual: <strong>termoclastia</strong>."
},
{
 id:"suelo", titulo:"Edafización o formación del suelo", paginas:"270–271", tema:14,
 idea:definicionEdafizacion,
 bloques:[
 ["Factores de la edafización",`La meteorización desprende fragmentos de roca llamados <strong>clastos</strong>. Cuando se acumulan, forman una cubierta de materiales sueltos que recibe el nombre de <strong>detrito o regolito</strong>. La <strong>edafización</strong> transforma ese detrito en suelo fértil.`,factoresEdafizacion.map(([factor, puntos, introduccion], index) => [`factor-${index}`, factor, puntos, introduccion])],
 ["Estructura del suelo",horizontesDelSuelo],
 ["Propiedades del suelo","La <strong>textura</strong> indica qué proporción de arena, limo y arcilla hay en la parte mineral del suelo. La arena tiene los granos más grandes. El limo tiene un tamaño intermedio y la arcilla, el más pequeño. Un suelo <strong>franco</strong> tiene una mezcla equilibrada de los tres. La <strong>porosidad</strong> es el porcentaje del suelo ocupado por huecos que pueden contener aire o agua. La <strong>permeabilidad</strong> es la facilidad con que el agua circula por esos huecos. Un suelo muy arcilloso puede retener mucha agua y, aun así, ser poco permeable porque el agua circula lentamente por sus poros pequeños."],
 ["Fertilidad del suelo","Un suelo es más <strong>fértil</strong> si favorece el crecimiento de las plantas. Ayudan la presencia de <strong>humus</strong> y de nutrientes disponibles, como nitratos y fosfatos. También influyen el agua disponible y la aireación del suelo."],
 ["Tipos de suelos","<strong>Podsol.</strong> En un clima húmedo y con poca evaporación, el agua se infiltra y desciende. El agua arrastra muchas sales del horizonte A. Esa capa queda pobre en sales y toma un color grisáceo. <strong>Suelo pardo.</strong> En la época lluviosa, el agua se infiltra en el suelo. En verano puede subir por los poros, por <strong>ascenso capilar</strong>. Por eso cuesta distinguir los horizontes A y B. <strong>Caliche.</strong> En un clima muy seco y caluroso, el agua sube por los poros del suelo. Este movimiento se llama <strong>ascenso capilar</strong>. Al evaporarse el agua, las sales o la cal pueden formar una costra cerca de la superficie. <strong>Litosuelo o suelo rocoso.</strong> Tiene poco espesor y sus horizontes apenas se distinguen. Se forma sobre roca madre poco o nada alterada."]
 ],
 esquema:["O · Mantillo","A · Lavado","B · Acumulación","C · Roca madre alterada"],
 ejemplo:"En una zona seca observas una costra de cal. La explicación compatible con el <strong>caliche</strong> es que el agua sube por capilaridad y la <strong>evaporación</strong> deja sales cerca de la superficie."
},
{
 id:"sedimentos", titulo:"Erosión, transporte y depósito", paginas:"272–273", tema:14,
 idea:"La <strong>erosión</strong> retira y moviliza materiales. El <strong>transporte</strong> es su desplazamiento. La <strong>sedimentación</strong> es el depósito de los materiales transportados.",
 bloques:[
 ["Detrito y sedimento","Los <strong>clastos</strong> son fragmentos de roca producidos por la meteorización. Al acumularse en el lugar donde se formaron constituyen el <strong>detrito</strong> o regolito. En la <strong>erosión</strong>, un agente geológico recoge los clastos del detrito o arranca fragmentos de la roca y los pone en movimiento. Cuando el agente arrastra el material, este pasa a llamarse <strong>sedimento</strong>. Ya tiene ese nombre durante el viaje. El <strong>transporte</strong> es su desplazamiento. La <strong>sedimentación</strong> ocurre cuando el agente deja de arrastrarlo y lo deposita."],
 ["Gravedad y agentes geológicos",
  "Los <strong>clastos</strong> pueden ponerse en movimiento y acumularse en otras zonas por la acción de la <strong>gravedad</strong> o de los <strong>agentes geológicos</strong>.",
  [
   ["gravedad","Gravedad",[
    "Los <strong>procesos gravitacionales</strong> trasladan los materiales <strong>hasta el pie de la pendiente</strong>.",
    "En pendientes muy inclinadas pueden desprenderse bloques.",
    "Si la lluvia intensa o el deshielo empapan los materiales arcillosos, pueden producirse <strong>corrimientos de tierras</strong>."
   ]],
   ["agentes","Agentes geológicos",[
    "El <strong>agua</strong>, el <strong>viento</strong> y el <strong>hielo</strong> pueden transportar los clastos <strong>a grandes distancias</strong>.",
    "Un agente también puede recoger sedimentos que otro ya había depositado."
   ]]
  ]],
 ["Cómo se transporta una partícula","<strong>En contacto con el fondo.</strong> En la <strong>reptación</strong>, la partícula se arrastra. En la <strong>rodadura</strong>, gira sobre el fondo. En la <strong>saltación</strong>, se levanta y vuelve a tocarlo en saltos sucesivos. <strong>Separada del fondo.</strong> En <strong>suspensión</strong>, la partícula viaja dentro del fluido. En <strong>flotación</strong>, viaja por la superficie. En <strong>disolución</strong>, el agua transporta sustancias disueltas, por ejemplo iones."],
 ["Madurez textural",`${relacionTransporteTextural} Un sedimento formado por <strong>clastos muy pequeños y redondeados</strong> tiene <strong>madurez textural alta</strong>. Durante el transporte, los golpes y el roce tienden a reducir el tamaño de los clastos y a redondear sus bordes. En el ejemplo del tema, la <strong>arena de playa</strong> presenta madurez textural alta. El <strong>sedimento glaciar</strong> del ejemplo presenta menor madurez textural y contiene fragmentos angulosos de distintos tamaños. Cada agente geológico modifica los clastos de forma distinta.`,[["madurez-mineralogica","Madurez mineralógica",madurezMineralogica]]],
 ["La sedimentación","La <strong>sedimentación</strong> es el depósito de los materiales que un agente geológico transportaba. <strong>Dos modos de depósito.</strong> Depósito gravitacional y acreción cinética. <strong>Depósito gravitacional.</strong> Cuando la corriente pierde energía, deja de sostener parte de la carga y los clastos caen al fondo por gravedad. <strong>Acreción cinética.</strong> Los clastos que aún se están moviendo tropiezan con un obstáculo y se acumulan. Esta acumulación puede dar lugar a formas como dunas o barras. Los materiales depositados pueden sufrir erosión de nuevo. Si llegan a una <strong>cuenca sedimentaria</strong>, pueden acumularse allí en capas."]
 ],
 esquema:["Meteorización","Erosión","Transporte","Sedimentación"],
 ejemplo:"La muestra A es arena de playa. Sus clastos son muy pequeños y redondeados, por lo que tiene <strong>madurez textural alta</strong>. La muestra B es un sedimento glaciar. Sus fragmentos son angulosos y de distintos tamaños, por lo que presenta menor madurez textural."
},
{
 id:"sedimentarias", titulo:"Rocas y minerales sedimentarios", paginas:"274–277", tema:14,
 idea:"Primero identifica cómo se formó la roca y luego comprueba sus pistas: fragmentos, tamaño, composición o restos orgánicos.",
 bloques:[
 ["Del sedimento a la roca","En una <strong>cuenca sedimentaria</strong>, el fondo se va hundiendo poco a poco. Ese hundimiento se llama <strong>subsidencia</strong> y permite que se sigan acumulando sedimentos. Primero se produce el <strong>enterramiento</strong>: se acumulan nuevas capas sobre los sedimentos anteriores, que quedan a mayor presión y temperatura. Con la <strong>compactación</strong>, el peso de las capas superiores aproxima los clastos y reduce el espacio entre ellos. Con la <strong>cementación</strong>, precipitan minerales en los huecos que quedan y unen los clastos. La transformación del sedimento en roca sedimentaria se llama <strong>diagénesis</strong> o <strong>litificación</strong>."],
 ["Rocas detríticas",[origenRocasDetriticas,...tiposRocasDetriticas]],
 ["Rocas no detríticas","Las rocas <strong>no detríticas</strong> se forman a partir de <strong>sustancias disueltas en el agua</strong> que se convierten en sólidos, o de <strong>materia orgánica</strong>. Se agrupan en <strong>carbonatadas</strong>, <strong>evaporíticas</strong> y <strong>orgánicas</strong>.",[
  ["carbonatadas","Rocas carbonatadas",composicionCarbonatadas,"Se forman cuando los <strong>carbonatos</strong> disueltos en el agua pasan a estado sólido. En su formación pueden intervenir los seres vivos."],
  ["evaporiticas","Rocas evaporíticas",rocasEvaporiticas],
  ["organicas","Rocas orgánicas","Se forman por acumulación y transformación de materia orgánica. <strong>Carbones.</strong> Proceden de materia orgánica principalmente vegetal. Al transformarse en ausencia de oxígeno mediante la <strong>carbonización</strong>, se enriquece en carbono. De menor a mayor contenido de carbono, los cuatro tipos son turba, lignito, hulla y antracita. <strong>Turba.</strong> Es parda, conserva restos vegetales y contiene entre un 45 % y un 65 % de carbono. <strong>Antracita.</strong> Es gris, tiene brillo metálico y contiene entre un 90 % y un 95 % de carbono. <strong>Petróleo.</strong> Es líquido y procede de materia orgánica de microorganismos marinos enterrada en sedimentos arcillosos, en un ambiente sin oxígeno."]
 ]],
 ["Rocas mixtas","Las rocas <strong>mixtas</strong> están entre las detríticas y las no detríticas. Combinan <strong>minerales formados a partir de sustancias disueltas</strong> y <strong>clastos de otras rocas</strong>. La <strong>marga</strong> combina carbonato cálcico con una proporción importante de limo o arcilla. Si reconoces clastos, describe primero su tamaño y forma. Si la muestra se describe por su composición, explica qué componentes permiten clasificarla."],
 ["Cinco minerales de repaso","El <strong>cuarzo</strong> resiste bien la alteración. La <strong>caolinita</strong> es un ejemplo de mineral de arcilla. Puede formarse por la alteración de feldespatos. El <strong>yeso</strong> es sulfato de calcio hidratado. La <strong>halita</strong> es cloruro de sodio. La <strong>calcita</strong> es carbonato de calcio y es habitual en las calizas."]
 ],
 esquema:["Sedimento","Enterramiento","Compactación","Cementación","Roca sedimentaria"],
 ejemplo:"Una roca formada por cantos de 8 mm unidos por un cemento es un <strong>conglomerado</strong>. Si esos cantos son redondeados, la clave del libro la identifica como <strong>pudinga</strong>."
}
];

const preguntasExternos = [
 ["meteorizacion","¿Qué proceso altera la roca en el mismo lugar, antes de que sus fragmentos se movilicen?",0,["Meteorización","Sedimentación","Erosión"],["La meteorización altera o fragmenta la roca expuesta donde está.","La sedimentación deposita material que ya se transportaba.","La erosión retira y moviliza material."]],
 ["meteorizacion","Una grieta crece cada vez que el agua que la ocupa se congela.",1,["Termoclastia","Gelifracción","Carbonatación"],["En la termoclastia el mecanismo es la dilatación desigual sin necesidad de hielo.","El hielo aumenta de volumen y actúa como cuña.","La carbonatación es una alteración química vinculada al CO₂ en el agua."]],
 ["meteorizacion","Partículas lanzadas por el viento desgastan la base de una roca.",2,["Descompresión","Hidrólisis","Abrasión"],["La descompresión ocurre por pérdida de presión al acercarse a la superficie.","La hidrólisis altera minerales por reacción química.","El roce de partículas que viajan con el viento es abrasión."]],
 ["meteorizacion","Una roca expuesta al sol se fractura por dilataciones desiguales al calentarse y enfriarse.",1,["Gelifracción","Termoclastia","Meteorización biológica"],["Para que haya gelifracción debe formarse hielo en las grietas.","Los cambios térmicos provocan dilataciones y contracciones desiguales.","La pista indica un mecanismo térmico, sin intervención de seres vivos."]],
 ["meteorizacion","¿Qué mecanismo rompe la estructura cristalina de un mineral por la acción de los iones hidrógeno e hidroxilo del agua?",0,["Hidrólisis","Abrasión","Descompresión"],[meteorizacionQuimica.hidrolisis,"La abrasión desgasta sin producir por sí sola nuevos minerales.","La descompresión causa expansión y fractura, no este cambio mineralógico."]],
 ["meteorizacion","El agua con CO₂ facilita la disolución de la calcita. ¿Qué mecanismo actúa?",2,["Oxidación","Termoclastia","Carbonatación"],[meteorizacionQuimica.oxidacion,"La termoclastia fragmenta por diferencias térmicas.",meteorizacionQuimica.carbonatacion]],
 ["meteorizacion","Se desprenden láminas de una roca que se expande al perder la carga de encima.",1,["Abrasión","Descompresión","Oxidación"],["La abrasión requiere roce con partículas.","La pérdida de presión permite que la roca se expanda y fracture.",meteorizacionQuimica.oxidacion]],
 ["meteorizacion","Una sal soluble se separa en iones al entrar en contacto con agua.",0,["Disolución","Carbonatación","Abrasión"],[meteorizacionQuimica.disolucion,"La carbonatación se relaciona con el CO₂ y afecta, por ejemplo, a la calcita.","La abrasión desgasta por roce sin disolver iones."]],
 ["meteorizacion","¿Qué ejemplo muestra un mecanismo físico de meteorización biológica?",2,["CO₂ de la respiración disuelto en agua","Oxígeno que reacciona con minerales","Raíces que abren grietas"],["El CO₂ disuelto favorece reacciones químicas.","La reacción con oxígeno es oxidación, un mecanismo químico.","La raíz actúa como una cuña y ensancha la grieta, de forma parecida a la gelifracción."]],
 ["suelo","¿Dónde se acumulan los materiales arrastrados por el agua desde A?",1,["O","B","C"],["O es el mantillo superficial.","B recibe materiales procedentes del lavado.","C contiene restos y fragmentos de la roca madre."]],
 ["suelo","Un suelo tiene numerosos poros pequeños, pero el agua apenas circula. ¿Qué propiedad es baja?",2,["Porosidad","Proporción de partículas finas","Permeabilidad"],["Puede haber abundante volumen de huecos y aun así circular poco el agua.","Los poros pequeños son compatibles con partículas finas abundantes.","La permeabilidad mide la facilidad con la que pasa el agua."]],
 ["suelo","Aparece una costra de cal en un clima árido con fuerte evaporación.",0,["Caliche","Podsol","Litosuelo"],["El ascenso capilar y la evaporación explican la acumulación superficial de cal o sales.","El podsol se asocia con clima húmedo y lavado descendente.","Un litosuelo se reconoce por poco espesor sobre roca madre poco alterada."]],
 ["suelo","¿Qué condición dificulta mantener el material sobre el que se forma el suelo?",1,["Aporte de humus","Pendiente muy pronunciada","Tiempo suficiente"],["El humus y la actividad biológica favorecen el desarrollo del suelo.","Una pendiente muy fuerte facilita la retirada de detritos.","Con tiempo pueden desarrollarse horizontes."]],
 ["suelo","¿Qué describe la textura de un suelo?",2,["El volumen de huecos","La facilidad de paso del agua","Las proporciones de arena, limo y arcilla"],["El volumen relativo de huecos es la porosidad.","El paso del agua es la permeabilidad.","La textura se refiere a las proporciones de partículas según su tamaño."]],
 ["sedimentos","Las partículas avanzan dando pequeños saltos y volviendo repetidamente al fondo.",1,["Suspensión","Saltación","Rodadura"],["Las partículas en suspensión permanecen dentro del fluido durante el transporte.","El avance por saltos sucesivos describe la saltación.","En la rodadura las partículas giran en contacto con el fondo."]],
 ["sedimentos","La muestra A (arena de playa) tiene clastos muy pequeños y redondeados. La muestra B (sedimento glaciar) tiene fragmentos angulosos de distintos tamaños. ¿Cuál tiene madurez textural alta?",0,["La muestra A","La muestra B","El tamaño y la redondez indican solo la madurez mineralógica"],["La muestra A tiene madurez textural alta porque sus clastos son muy pequeños y redondeados.","La angularidad y el tamaño grande apuntan a menor madurez textural en esta comparación.","En este caso se compara el tamaño y la forma de los clastos. Para valorar la madurez mineralógica se examina la composición, por ejemplo la proporción de cuarzo o de minerales de arcilla formados durante la alteración."]],
 ["sedimentos","La corriente pierde energía y los clastos caen al fondo.",2,["Acreción cinética","Meteorización","Depósito gravitacional"],["En la acreción cinética las partículas en movimiento se acumulan al tropezar con un obstáculo.","La meteorización altera roca expuesta.","La pérdida de energía de la corriente permite que los clastos se depositen por gravedad."]],
 ["sedimentos","La arena en movimiento se acumula al topar con un obstáculo.",1,["Disolución","Acreción cinética","Diagénesis"],["En la disolución viajan iones, sin acumulación de granos contra un obstáculo.","El obstáculo es la pista que identifica este modo de sedimentación.","La diagénesis transforma posteriormente el sedimento acumulado en roca."]],
 ["sedimentarias","Una roca detrítica presenta clastos de 8 mm con bordes angulosos.",2,["Pudinga","Arenisca","Conglomerado tipo brecha"],["La pudinga presenta clastos gruesos redondeados.","La arenisca se compone de clastos menores de 2 mm en la tabla del libro.","Los clastos mayores de 2 mm y angulosos identifican una brecha."]],
 ["sedimentarias","¿Qué nombre recibe el proceso por el que los minerales precipitan entre clastos y los unen?",0,["Cementación","Compactación","Saltación"],["El cemento mineral rellena huecos y une los clastos.","La compactación reduce huecos al aumentar la carga.","La saltación es un modo de transporte."]],
 ["sedimentarias","Una roca mezcla carbonato de calcio con una fracción importante de limo o arcilla.",1,["Halita","Marga","Pudinga"],["La halita es cloruro de sodio, no una mezcla de carbonato y arcilla.","La mezcla de carbonato cálcico y partículas detríticas finas define la marga.","La pudinga está formada por clastos gruesos redondeados."]],
 ["sedimentarias","¿Cuál es el mineral más característico de una caliza?",2,["Halita","Cuarzo","Calcita"],["La halita es cloruro de sodio y puede formar cristales cuando se evapora el agua.","El cuarzo es un silicato habitual en arenas y areniscas.","La calcita es carbonato de calcio, componente principal de muchas calizas."]],
 ["sedimentarias","¿Qué proceso permite explicar una roca de yeso en una cuenca salina?",1,["Transporte de cantos grandes","Formación de cristales al evaporarse el agua","Compactación de restos vegetales"],["Los cantos gruesos pueden dar conglomerados.","Al evaporarse el agua, las sales disueltas quedan y forman cristales, como los de yeso.","Los restos vegetales enterrados son precursores de carbones."]]
];
