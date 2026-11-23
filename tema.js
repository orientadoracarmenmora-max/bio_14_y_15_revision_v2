"use strict";

const serie = ["Arcilla","Pizarra","Filita","Esquisto","Gneis","Granito de anatexia"];
const tiposMetamorfismo = [
 "<strong>Dinámico → presión.</strong> En las grandes fallas, la presión dirigida y el movimiento de los bloques pueden deformar o triturar la roca. Así pueden formarse <strong>brechas de falla</strong> o <strong>milonitas</strong>.",
 "<strong>Térmico o de contacto → temperatura.</strong> El magma calienta la roca que lo rodea (roca encajante). El calor transforma esa roca y forma una franja llamada <strong>aureola metamórfica</strong>. Allí puede formarse <strong>corneana</strong>.",
 "<strong>Regional → presión y temperatura en zonas extensas.</strong> Suele ocurrir donde las placas se acercan, por ejemplo, al formarse montañas. Según la zona, puede predominar la presión, como en el prisma de acreción, o aumentar tanto la presión como la temperatura."
];

const estructurasMetamorficas = [
 "<strong>Foliación.</strong> La <strong>presión dirigida</strong> hace que minerales como las micas se orienten en planos. Esa disposición se llama <strong>foliación</strong>. Da a la roca un aspecto de láminas o bandas, como en la pizarra y el esquisto.",
 "<strong>Estructura granoblástica.</strong> Los cristales encajan como piezas de un puzle y apuntan en distintas direcciones. Forman un <strong>mosaico de cristales</strong>. Se observa en la cuarcita y el mármol."
];

const caminosCicloRocas = [
 "<strong>Roca expuesta → sedimentos.</strong> La meteorización fragmenta o altera la roca. Los materiales se erosionan, se transportan y se depositan.",
 "<strong>Sedimentos → roca sedimentaria.</strong> Los sedimentos se compactan y sus granos se unen. Esa transformación se llama <strong>diagénesis</strong>.",
 "<strong>Roca → roca metamórfica.</strong> La presión o la temperatura transforman la roca en <strong>estado sólido</strong>. Es el <strong>metamorfismo</strong>.",
 "<strong>Roca → magma → roca ígnea.</strong> Si la roca se funde, se forma <strong>magma</strong>. Al enfriarse y solidificarse, el magma forma una <strong>roca ígnea</strong>."
];

const serieRegionalCuaderno = [
 "<strong>Recorrido.</strong> Arcilla → pizarra → filita → esquisto → gneis → granito de anatexia.",
 "<strong>Ambiente sedimentario · arcilla.</strong> El recorrido empieza en un material arcilloso de origen sedimentario.",
 "<strong>Bajo grado · pizarra y filita.</strong> Al aumentar la presión y la temperatura, se forman primero pizarra y luego filita.",
 "<strong>Grado medio · esquisto.</strong> El esquisto puede contener <strong>granate</strong>, como indica el esquema.",
 "<strong>Alto grado · gneis.</strong> El <strong>ojo de sapo</strong> es un ejemplo de gneis. Hasta el gneis, las transformaciones se producen en <strong>estado sólido</strong>.",
 "<strong>Ambiente magmático · granito de anatexia.</strong> Si parte de la roca se funde, se produce la <strong>anatexia</strong> (fusión parcial). Al enfriarse y cristalizar, ese material fundido puede formar granito de anatexia."
];

const lecciones = [
{
 id:"magma", titulo:"Procesos geológicos internos, magmatismo y volcanes", paginas:"288–291",
 idea:"Para distinguir los tres <strong>procesos geológicos internos</strong>, fíjate en qué le ocurre a la roca. Puede <strong>fundirse</strong> y dar lugar a magma, <strong>transformarse en estado sólido</strong> o <strong>deformarse o fracturarse</strong> por la acción de los esfuerzos.",
 bloques:[
 ["Los tres procesos geológicos internos",[
  "<strong>Magmatismo.</strong> Parte de la roca se funde y se forma magma. En el dibujo, la <strong>subducción</strong> facilita la formación de magma.",
  "<strong>Metamorfismo.</strong> La presión y la temperatura transforman la roca en <strong>estado sólido</strong>. En el dibujo, la <strong>compresión</strong> afecta a los sedimentos del prisma de acreción.",
  "<strong>Esfuerzos tectónicos.</strong> Pueden plegar o fracturar las rocas. En el dibujo, en la <strong>falla transformante</strong> actúa la <strong>cizalla</strong>."
 ]],
 ["2. El magmatismo · el magma y sus componentes","El magma se forma cuando parte de la roca se funde en el interior terrestre. <strong>Fracción líquida.</strong> Es la roca fundida, rica en sílice. Puede empezar como pequeñas gotas que se unen y ascienden. <strong>Fracción sólida.</strong> Incluye cristales en suspensión, restos de roca sin fundir y fragmentos desprendidos de la roca encajante, que es la que rodea al magma. <strong>Fracción gaseosa.</strong> Son los gases disueltos en el fundido. Los más abundantes son el vapor de agua y el dióxido de carbono. El magma puede acumularse en una cámara magmática."],
 ["Emplazamientos intrusivos o en profundidad · plutón y dique","En un <strong>emplazamiento intrusivo</strong>, el magma se introduce entre rocas y se solidifica en el interior. <strong>Plutón.</strong> Es un cuerpo voluminoso de roca magmática, de forma ovoide o de cúpula. En el dibujo es la masa gris abovedada de la izquierda. <strong>Dique.</strong> Es una lámina de roca magmática, delgada en relación con su extensión. Se forma cuando el magma penetra en una fractura y, en el dibujo, se reconoce porque corta las capas de la roca que lo rodea. Para el examen, fíjate en esas dos formas."],
 ["3.3. Emplazamientos en superficie y estructuras volcánicas","La <strong>cámara magmática</strong> es la acumulación de magma en profundidad. La <strong>chimenea</strong> es el conducto por el que el magma asciende y el <strong>cráter</strong> es la abertura por la que salen los productos volcánicos. Los materiales que salen por el cráter se acumulan a su alrededor. Así se forma el <strong>cono o edificio volcánico</strong>. La <strong>caldera</strong> es una depresión amplia, generalmente circular, que suele formarse por el hundimiento del techo de la cámara magmática. La <strong>colada de lava</strong> es la lava que se extiende por la superficie."],
 ["3.1. Los volcanes · cómo se produce una erupción","Cuando el magma asciende, tiene menos roca encima y disminuye la <strong>presión</strong>. Los gases dejan de estar disueltos y forman burbujas, como al destapar una bebida gaseosa. El magma se vuelve espumoso y menos denso. Al empujar las rocas de encima, favorece la apertura de fracturas por las que puede llegar a la superficie y producir una erupción."],
 ["3.2. Los productos volcánicos","<strong>Gaseosos.</strong> Se emiten principalmente vapor de agua y dióxido de carbono. <strong>Líquidos.</strong> La lava es el magma que llega a la superficie y ha perdido parte de sus gases. <strong>Sólidos.</strong> Los piroclastos se clasifican por tamaño. La ceniza mide menos de 2 mm. El lapilli mide entre 2 y 64 mm. Las bombas volcánicas superan los 64 mm."],
 ["3.4. Tipos de actividad volcánica · factores","<strong>Composición.</strong> Cuanta más sílice contiene el magma, más le cuesta fluir. Es decir, tiene más <strong>viscosidad</strong>. <strong>Temperatura.</strong> El magma más caliente fluye con más facilidad. <strong>Cantidad de gases disueltos.</strong> Los gases disueltos tienden a aumentar la fluidez del magma. Al bajar la presión cerca de la superficie, parte del gas se separa del magma, forma burbujas y escapa. La salida de los gases se llama <strong>desgasificación</strong>. Si el magma es muy viscoso, los gases pueden salir de forma más violenta. <strong>Lugar.</strong> Bajo el agua, la lava se enfría bruscamente y puede formar lavas almohadilladas. En tierra se desgasifica y puede extenderse en coladas."]
 ],
 esquema:["Fusión","Magma","Cámara magmática","Chimenea","Cráter","Productos"],
 ejemplo:"Una lámina de roca ígnea atraviesa varios estratos. La pista es que los corta: se trata de un <strong>dique</strong>."
},
{
 id:"igneas", titulo:"Rocas magmáticas o ígneas", paginas:"292–293",
 idea:"Relaciona el lugar de enfriamiento con el tamaño de los cristales y combina <strong>textura</strong> y composición para reconocer una roca.",
 bloques:[
 ["4. Las rocas magmáticas o ígneas · dónde se forman","<strong>Plutónicas.</strong> El magma se enfría lentamente en profundidad y da tiempo a que crezcan los cristales. Los cristales suelen verse a simple vista. Juntos forman un <strong>mosaico de cristales</strong>: encajan como las piezas de un puzle. <strong>Volcánicas.</strong> Se forman a partir de materiales expulsados en una erupción. Al enfriarse rápidamente, tienen menos tiempo para formar cristales grandes. Por eso suele costar distinguir los minerales a simple vista. En el vidrio volcánico no se forman cristales. A veces se observan algunos cristales dispersos. <strong>Subvolcánicas o filonianas.</strong> Se forman a menor profundidad, cuando el magma se introduce en grietas, fallas o entre capas y se consolida allí, formando, por ejemplo, filones o diques."],
 ["4.1. Texturas de las rocas magmáticas · textura y estructura","La <strong>textura</strong> describe el tamaño y la forma de los granos minerales. Depende, entre otros factores, de la velocidad de enfriamiento. Un enfriamiento más lento da más tiempo para que crezcan los cristales. La <strong>estructura</strong> describe otros rasgos. Por ejemplo, si la roca tiene huecos o si sus minerales están orientados en una dirección. La <strong>porosidad</strong> indica cuánto espacio ocupan esos huecos."],
 ["Grado de cristalización","<strong>Fanerítica u holocristalina (fanerocristalina en la explicación de Belén).</strong> Los cristales se distinguen a simple vista y encajan como piezas de un puzle. El granito es un ejemplo. <strong>Microcristalina.</strong> Cristales muy pequeños que todavía se aprecian a simple vista, como en la aplita. <strong>Vítrea.</strong> Masa homogénea sin cristales, como la obsidiana."],
 ["Tamaño y disposición","La textura <strong>porfídica</strong> tiene cristales grandes rodeados de material de grano muy fino o de aspecto vítreo. El material que rodea esos cristales se llama <strong>matriz</strong>. La <strong>vacuolar</strong> conserva huecos de burbujas de gas, como en la pumita y en algunas lavas solidificadas."],
 ["4.2. Tipos de rocas magmáticas · volcánicas","<strong>Pumita o piedra pómez.</strong> Vidrio volcánico espumoso, con muchas vacuolas y poca densidad. Puede flotar en el agua. <strong>Andesita.</strong> Suele ser gris o violácea. Tiene composición similar a la diorita, aunque se forma en la superficie. <strong>Obsidiana.</strong> Vidrio volcánico compacto y negro. Al romperse deja superficies curvas, llamadas fractura concoidea, y bordes cortantes. <strong>Basalto.</strong> Es oscuro y denso. A veces tiene vacuolas. Es característico de la corteza oceánica."],
 ["4.2. Tipos de rocas magmáticas · plutónicas y filonianas","<strong>Granito.</strong> Presenta cuarzo, feldespatos y micas visibles. <strong>Diorita.</strong> Roca oscura moteada de blanco, con plagioclasas y anfíboles. <strong>Sienita.</strong> Suele ser rosada o anaranjada, con abundante ortosa y sin cuarzo. <strong>Gabro.</strong> Roca oscura, cuyos minerales principales son piroxenos y plagioclasas. <strong>Pegmatita.</strong> Es filoniana y tiene una composición similar a la del granito, con cristales grandes de feldespato y mica."]
 ],
 esquema:["Enfriamiento lento","Más tiempo para crecer","Cristales habitualmente mayores"],
 ejemplo:"Dos muestras son negras. Una tiene brillo de vidrio y rotura curva: <strong>obsidiana</strong>. La otra es densa y oscura y puede presentar vacuolas: <strong>basalto</strong>. El color solo es una pista."
},
{
 id:"meta", titulo:"Metamorfismo", paginas:"296–299",
 idea:"Una roca puede cambiar sus minerales, su <strong>textura</strong> o su <strong>estructura</strong> por la presión o la temperatura. Durante el metamorfismo, la roca sigue en <strong>estado sólido</strong>.",
 bloques:[
 ["5.1. Factores del metamorfismo","<strong>Presión litostática.</strong> Es la presión debida al peso de las capas superiores. Reduce la porosidad y puede aumentar la densidad. <strong>Temperatura.</strong> Favorece las reacciones entre minerales y facilita la deformación. <strong>Esfuerzos dirigidos.</strong> Se deben al empuje de las placas. Pueden comprimir y orientar minerales o triturar la roca en una falla. <strong>Presencia de agua.</strong> El agua lleva <strong>iones disueltos</strong>. Estos pueden reaccionar con los minerales de la roca."],
 ["5.2. Cambios físicos · cambios en el aspecto de la roca","El <strong>color</strong> puede variar al cambiar los minerales y pueden aparecer bandas o vetas. La <strong>densidad</strong> puede aumentar si disminuyen los poros. La <strong>tenacidad</strong> es la resistencia a romperse. Aumenta si los granos quedan más unidos. La <strong>textura</strong> puede cambiar cuando crecen los cristales. Ese crecimiento se llama <strong>blastesis</strong>. La <strong>estructura</strong> cambia cuando los minerales se orientan y forman láminas o bandas."],
 ["5.3. Tipos de metamorfismo",tiposMetamorfismo],
 ["Serie regional · del ambiente sedimentario al magmático",serieRegionalCuaderno],
 ["6.1. Estructuras de las rocas metamórficas",estructurasMetamorficas],
 ["6.2. Tipos de rocas metamórficas · cómo reconocerlas","<strong>Pizarra.</strong> Se origina a partir de rocas arcillosas y se separa en láminas finas y paralelas. <strong>Esquisto.</strong> Presenta una foliación ondulada o irregular y suele brillar por sus micas. <strong>Gneis o neis.</strong> Muestra bandas claras y oscuras y puede tener cristales grandes de feldespato. <strong>Cuarcita.</strong> Procede de una arenisca rica en cuarzo y es muy dura. <strong>Mármol.</strong> Procede de una caliza y tiene estructura granoblástica. <strong>Corneana.</strong> Se forma por <strong>metamorfismo de contacto</strong>, cuando el magma calienta la roca que lo rodea. <strong>Brecha de falla y milonita.</strong> Pueden formarse por <strong>metamorfismo dinámico</strong>, cuando la roca se deforma o se tritura en una falla."]
 ],
 esquema:serie,
 ejemplo:"Si se observa una franja de roca transformada alrededor de un <strong>plutón</strong>, la pista decisiva es su cercanía al foco de calor: <strong>metamorfismo</strong> de contacto."
},
{
 id:"ciclo", titulo:"Silicatos y ciclo", paginas:"300–301",
 idea:"Los <strong>silicatos</strong> dominan en las rocas ígneas y metamórficas. El ciclo explica cómo una roca puede transformarse siguiendo distintos caminos.",
 bloques:[
 ["Qué es un silicato","Los <strong>silicatos</strong> son minerales con silicio y oxígeno como componentes fundamentales."],
 ["7. Los minerales de las rocas magmáticas y metamórficas · olivino y granates","El <strong>olivino</strong> es un silicato de magnesio y hierro. Es característico de la peridotita, una roca del manto, y también aparece en algunos basaltos. Es el ejemplo magmático que destacó Belén. Los <strong>granates</strong> forman un grupo de silicatos de composición variable. Pueden originarse en condiciones metamórficas de media y alta presión."],
 ["Del sedimento a la roca","Las rocas expuestas pueden originar <strong>sedimentos</strong> mediante meteorización, erosión, transporte y depósito. La <strong>diagénesis</strong> transforma esos sedimentos en rocas sedimentarias."],
 ["8. El ciclo de las rocas · cómo se transforman",[
  ...caminosCicloRocas,
  "<strong>El ciclo continúa.</strong> Si una roca vuelve a quedar expuesta en la superficie, puede volver a dar sedimentos. Las rocas pueden seguir distintos caminos."
 ]]
 ],
 esquema:["Roca expuesta","Sedimentos","Diagénesis","Roca sedimentaria"],
 ejemplo:"<strong>Granito</strong> → sedimentos mediante <strong>meteorización</strong> y <strong>erosión</strong> → <strong>arenisca</strong> mediante <strong>diagénesis</strong> → <strong>cuarcita</strong> mediante <strong>metamorfismo</strong>."
},
{
 id:"esfuerzos", titulo:"Los esfuerzos tectónicos. Pliegues y fallas", paginas:"302–303",
 idea:"En un <strong>pliegue</strong> las capas se curvan. En una <strong>falla</strong> se rompen y se desplazan.",
 bloques:[
 ["Qué son un pliegue y una falla","En un <strong>pliegue</strong>, las capas se curvan sin romperse. En una <strong>falla</strong>, hay fractura y desplazamiento relativo."],
 ["9.1. Los pliegues · elementos geométricos","La <strong>charnela</strong> es la zona de mayor curvatura y los <strong>flancos</strong> quedan a ambos lados. El <strong>plano axial</strong> pasa por las charnelas de las capas. El <strong>núcleo</strong> es la zona más interna. El <strong>buzamiento</strong> es el ángulo del estrato con la horizontal. La <strong>vergencia</strong> es el ángulo menor entre el plano axial y la vertical."],
 ["Fallas · elementos principales","En una <strong>falla</strong>, los bloques se desplazan por el <strong>plano de falla</strong>, que es la superficie de rotura. Los bloques se llaman <strong>labios</strong>. El labio hundido queda más bajo y el levantado, más alto respecto al otro. El <strong>salto de falla</strong> es el desplazamiento total de los bloques. El <strong>buzamiento</strong> es el ángulo menor entre el plano de falla y la horizontal."]
 ],
 esquema:["Pliegue · las capas se curvan","Falla · las capas se rompen y se desplazan"],
 ejemplo:"Si puedes seguir la misma capa a ambos lados de una fractura y ves que ha quedado desplazada, estás ante una <strong>falla</strong>."
}
];

// Cada opción incluye la explicación que se muestra al elegirla.
const preguntas = [
 ["magma","Una lámina ígnea atraviesa los estratos. ¿Qué estructura es?",1,["Plutón","Dique","Colada de lava"],["El plutón es una masa generalmente ovoide o abovedada.","El dique ocupa una fractura y corta las estructuras previas.","La colada es lava extendida por la superficie."]],
 ["magma","¿Por dónde circula el magma entre la cámara y la abertura?",2,["Colada","Cráter","Chimenea"],["La colada se extiende sobre la superficie.","El cráter es la abertura de salida.","La chimenea es el conducto que comunica el interior con la superficie."]],
 ["magma","Un piroclasto mide 15 mm. ¿Cómo se clasifica?",0,["Lapilli","Ceniza","Bomba"],["El lapilli mide entre 2 y 64 mm.","La ceniza mide menos de 2 mm.","En la tabla de tamaños las bombas superan los 64 mm."]],
 ["magma","Si aumenta el contenido en sílice, en condiciones comparables, ¿qué cabe esperar?",1,["Menor viscosidad","Mayor viscosidad","Que no cambie la viscosidad"],["Un magma más rico en sílice tiende a fluir con más dificultad.","La mayor proporción de sílice suele incrementar la resistencia a fluir.","La composición sí afecta a la viscosidad."]],
 ["magma","¿Por qué aparecen burbujas cuando asciende el magma?",2,["Aumenta la presión","Se forman cristales de inmediato","Disminuye la presión"],["Al ascender disminuye la presión y se facilita la salida de gases disueltos.","Las burbujas contienen gas. La cristalización es un proceso distinto.","Con menos presión parte de los gases deja de estar disuelta y se expande."]],
 ["igneas","Muestra negra, brillante, sin cristales y con fractura curva.",0,["Obsidiana","Gabro","Pumita"],["La fractura concoidea y el aspecto de vidrio compacto identifican la obsidiana.","El gabro es plutónico y presenta cristales.","La pumita se reconoce por su aspecto espumoso y sus numerosos huecos."]],
 ["igneas","¿Qué textura describirías si ves cristales grandes en una matriz muy fina?",2,["Vítrea","Vacuolar","Porfídica"],["Una roca enteramente vítrea carece de cristales; el ejemplo sí presenta cristales grandes.","En la textura vacuolar el rasgo clave serían las cavidades de gas.","La combinación de cristales grandes y matriz fina caracteriza la textura porfídica."]],
 ["igneas","Se ven cristales de cuarzo, feldespato y mica a simple vista. Encajan como las piezas de un puzle.",1,["Andesita","Granito","Basalto"],["La andesita es volcánica y puede presentar una matriz fina.","La composición y los cristales visibles apuntan a granito plutónico.","El basalto es una roca volcánica oscura, normalmente de grano fino."]],
 ["igneas","Cristales muy grandes de feldespato y mica, en un filón.",0,["Pegmatita","Sienita","Cuarcita"],["El emplazamiento filoniano y los cristales grandes encajan con la pegmatita.","La sienita de la tabla es plutónica y rica en ortosa, pero la pista del filón favorece pegmatita.","La cuarcita se forma por metamorfismo de rocas ricas en cuarzo."]],
 ["igneas","¿Qué pista distingue la textura vacuolar?",1,["Bandas alternas de minerales","Huecos de antiguas burbujas","Superficie compacta con fractura curva"],["Las bandas son una pista típica del gneis.","Los huecos conservan el molde de burbujas de gas.","La fractura curva y el aspecto compacto son pistas de la obsidiana."]],
 ["meta","La roca encajante se transforma en una aureola junto a una intrusión.",2,["Dinámico","Regional","De contacto"],["El dinámico se concentra en zonas de falla.","El regional actúa en áreas extensas, por ejemplo durante la formación de montañas.","La intrusión aporta calor a la roca inmediata y genera una aureola de contacto."]],
 ["meta","¿Qué proceso explica la aparición de cristales nuevos o de mayor tamaño durante el metamorfismo?",0,["Blastesis","Diagénesis","Anatexia"],["Blastesis es el crecimiento de cristales en el metamorfismo.","La diagénesis transforma sedimentos en rocas sedimentarias.","La anatexia implica fusión parcial."]],
 ["meta","Roca con bandas mineralógicas claras y oscuras.",1,["Pizarra","Gneis","Mármol"],["La pizarra se separa típicamente en láminas finas, sin el bandeado grueso descrito.","El bandeado mineralógico es característico del gneis.","El mármol suele presentar un mosaico de granos de calcita."]],
 ["meta","¿Por qué el granito de anatexia se clasifica como ígneo?",2,["Tiene foliación","Procede de compactar arcilla","Cristaliza a partir de un fundido"],["La foliación es una estructura metamórfica que no explica el origen del granito.","La compactación conserva el material en estado sólido.","La fusión parcial da un fundido que, al cristalizar, origina una roca ígnea."]],
 ["meta","En una zona de falla hay roca intensamente deformada y de grano reducido.",0,["Milonita","Corneana","Pumita"],["La deformación concentrada en la zona de falla es la pista de la milonita.","La corneana se asocia al calentamiento por contacto.","La pumita es volcánica y sus huecos proceden de burbujas."]],
 ["meta","Una caliza se transforma en un mosaico de granos de calcita.",1,["Cuarcita","Mármol","Esquisto"],["La cuarcita suele proceder de arenisca rica en cuarzo.","La recristalización de calcita en una caliza produce mármol.","El esquisto suele mostrar foliación marcada por minerales como las micas."]],
 ["ciclo","¿Qué mineral de hierro y magnesio es característico de la peridotita?",0,["Olivino","Ortosa","Moscovita"],["El olivino de hierro y magnesio es común en las peridotitas del manto.","La ortosa es feldespato potásico.","La moscovita es mica blanca y se exfolia en láminas."]],
 ["ciclo","¿Qué transformación convierte sedimentos en roca sedimentaria?",2,["Magmatismo","Metamorfismo","Diagénesis"],["El magmatismo genera fundidos.","El metamorfismo transforma rocas preexistentes en estado sólido.","La diagénesis incluye procesos como la compactación y la cementación."]],
 ["ciclo","Un cristal se identifica como granate. ¿Qué descripción encaja?",1,["Es un feldespato potásico","Pertenece a un grupo de silicatos de composición variable","Es siempre olivino recristalizado"],["El feldespato potásico del tema es la ortosa.","Los granates son un grupo con composición variable y pueden aparecer durante el metamorfismo.","El nombre granate designa un grupo mineral propio y no determina un precursor único."]],
 ["esfuerzos","Hay una fractura y la misma capa queda desplazada a ambos lados. ¿Qué estructura es?",0,["Falla","Pliegue","Plano axial"],["Una fractura con desplazamiento es una falla.","En un pliegue las capas se curvan sin romperse.","El plano axial pasa por las charnelas de un pliegue."]],
 ["esfuerzos","¿Cómo se llama la superficie por la que se desplazan los bloques de una falla?",1,["Charnela","Plano de falla","Núcleo"],["La charnela es la zona de mayor curvatura de un pliegue.","El plano de falla es la superficie por la que se desplazan los bloques.","El núcleo es la parte más interna del pliegue."]],
 ["esfuerzos","¿Por dónde pasa el plano axial de un pliegue?",2,["Por el plano de falla","Por los labios de falla","Por las charnelas de las capas"],["El plano de falla es la superficie de rotura.","Los labios son los bloques a cada lado de una falla.","El plano axial pasa por las charnelas de las capas plegadas."]],
 ["magma","En el bloque de la p. 288, ¿qué favorece el magmatismo en la subducción?",1,["La cizalla en una falla transformante","El agua que aporta la placa que subduce","La compactación de sedimentos en superficie"],["La cizalla corresponde a la sección de esfuerzos tectónicos del diagrama.","El aporte de agua facilita la fusión de materiales en la zona de subducción.","La compactación por sí sola no explica el magmatismo que muestra el esquema."]],
 ["igneas","¿Qué rasgo de una roca describe principalmente su textura?",0,["Tamaño y forma de sus granos","Profundidad a la que se encontró","Número de capas que corta"],["El tamaño y la forma de los cristales describen la textura en la p. 292.","La profundidad de un hallazgo actual no describe sus granos.","Las capas que atraviesa una intrusión ayudan a identificar su emplazamiento."]],
 ["meta","¿Qué roca asocias al calentamiento alrededor de un plutón?",1,["Milonita","Corneana","Pizarra"],["La milonita se asocia a deformación intensa en una falla.","La corneana es típica del metamorfismo de contacto.","La pizarra se usa en el capítulo como ejemplo de metamorfismo regional de bajo grado."]],
 ["meta","Los cristales encajan como piezas de un puzle y apuntan en distintas direcciones. ¿Qué estructura encaja?",2,["Foliación","Porfídica","Granoblástica"],["La foliación implica una disposición planar.","Porfídica describe cristales grandes en una matriz fina.","La estructura granoblástica se parece a un mosaico, como el de la cuarcita."]],
 ["esfuerzos","¿Cómo se llama la zona de mayor curvatura de un pliegue?",1,["Flanco","Charnela","Salto"],["Los flancos quedan a ambos lados de la zona más curvada.","La charnela es la zona de máxima curvatura del pliegue.","El salto mide el desplazamiento de los bloques de una falla."]],
 ["esfuerzos","¿Qué se mide al determinar el salto de una falla?",2,["La curvatura de una capa","El espesor de los bloques","El desplazamiento relativo de los bloques"],["La curvatura ayuda a reconocer un pliegue.","El espesor describe cuánto mide el bloque, no cuánto se movió.","El salto expresa cuánto se desplazaron los bloques uno respecto al otro."]],
 ["esfuerzos","¿Cómo se llaman los bloques situados a ambos lados del plano de una falla?",0,["Labios","Flancos","Charnelas"],["Los labios son los bloques separados por el plano de falla.","Los flancos son los lados de un pliegue.","Las charnelas son las zonas de mayor curvatura de las capas."]]
];
