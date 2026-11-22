(() => {
 const superficie = document.querySelector('main');
 const barra = document.querySelector('#barra-puntero');
 const panel = document.querySelector('#ajustes-puntero');
 const activar = document.querySelector('#activar-puntero');
 const abrirAjustes = document.querySelector('#abrir-ajustes-puntero');
 const lienzo = document.querySelector('#capa-puntero');
 const ctx = lienzo.getContext('2d');
 const esIPad = /iPad/i.test(navigator.userAgent)
  || (/^Mac/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
 const dibujaCon = tipo => tipo==='pen' || (tipo==='mouse' && !esIPad);
 const clave = 'geologia-puntero-v4';
 const ajustes = {modo:'line', estilo:'marker', borrado:'thin', adorno:'none', tinta:'solid', color:'#FFC9DE', ancho:23, opacidad:56, duracion:2.2};
 const tonos = [['Amarillo vainilla','#FFF1B7'],['Rosa pastel','#FFC9DE'],['Melocotón pastel','#FFDAC4'],['Menta pastel','#C9F4DD'],['Azul cielo','#C9EEFF'],['Lila pastel','#E8D8FC']];
 const adornos = {
  gold: {nombre:'Purpurina dorada', colores:['#b77903','#eebc3b','#ad7300']},
  silver: {nombre:'Purpurina plateada', colores:['#647387','#aebac7','#7586a1']},
  copper: {nombre:'Purpurina cobre', colores:['#9d4624','#cf815a','#e9a07a']},
  rainbow: {nombre:'Purpurina multicolor', colores:['#d52a73','#a26702','#007e88','#7c48be']},
  stars: {nombre:'Estrellitas', colores:['#a06b00','#ce8b09','#8053bd'], simbolo:'✦'},
  hearts: {nombre:'Corazoncitos', colores:['#c62b64','#d95b86','#a64391'], simbolo:'♥'}
 };
 const tintas = {
  rainbow: {nombre:'Arcoíris brillante', colores:['#b62725','#d58e09','#bdac0f','#188943','#007d82','#22388b','#802671','#b62725'], paso:54},
  iridescent: {nombre:'Tornasol', colores:['#292453','#68aca7','#759daa','#46284f','#292453'], paso:105},
  ruby: {nombre:'Rojo rubí', colores:['#440914','#771624','#460613','#a11b2b','#440914'], paso:85},
  emerald: {nombre:'Verde esmeralda', colores:['#06343b','#087c75','#134b54','#004239','#06343b'], paso:60},
  rose: {nombre:'Oro rosa con purpurina', colores:['#a24d58','#dd9197','#cb727d','#a24d58'], paso:36},
  gold: {nombre:'Dorado con purpurina', colores:['#ad6900','#e0b316','#c48a08','#ad6900'], paso:36},
  silver: {nombre:'Plateado con purpurina', colores:['#5d6d88','#a2aec0','#7889a3','#5d6d88'], paso:36},
  copper: {nombre:'Cobre con purpurina', colores:['#773710','#bf7239','#a84e20','#773710'], paso:36},
  hearts: {nombre:'Rojo con corazoncitos', colores:['#9d152b','#d22442','#af1933','#9d152b'], paso:38, adorno:'hearts'},
  stars: {nombre:'Amarillo dorado con estrellitas', colores:['#b57b00','#e6b716','#cb9200','#b57b00'], paso:36, adorno:'stars'}
 };
 for (const tinta of Object.values(tintas)) {
  tinta.canales=tinta.colores.map(color=>color.slice(1).match(/../g).map(canal=>parseInt(canal,16)));
 }
 const simbolosTinta = {
  hearts: {colores:['#b61432','#d5233e','#a7112d'], simbolo:'♥'},
  stars: {colores:['#a77400','#d29b00','#bc8400'], simbolo:'✦'}
 };
 try {
  const anteriores = JSON.parse(localStorage.getItem(clave) || '{}');
  for (const campo of Object.keys(ajustes)) {
   if (typeof anteriores[campo] === typeof ajustes[campo]) ajustes[campo] = anteriores[campo];
  }
 } catch {}
 panel.innerHTML = `<fieldset><legend>Modo</legend>
 <label><input name="modo" type="radio" value="dot"> Punto</label>
 <label><input name="modo" type="radio" value="line"> Trazo</label></fieldset>
 <label>Estilo del rastro <select name="estilo"><option value="fine">Láser fino</option><option value="solid">Continuo</option><option value="dots">Punteado</option><option value="dashes">Discontinuo</option><option value="glow">Luminoso</option><option value="marker">Subrayador</option></select></label>
 <label>Cómo se borra <select name="borrado"><option value="auto">Según el estilo</option><option value="smooth">Suave, todo a la vez</option><option value="tail">Desde el principio, como una cola</option><option value="thin">Se afina hasta desaparecer</option><option value="cut">De golpe</option><option value="keep">Mantener en la vista actual</option></select></label>
 <div id="efectos-laser-fino" hidden>
 <label>Tinta del trazo <select name="tinta"><option value="solid">Color liso</option>${Object.entries(tintas).map(([valor,{nombre}])=>`<option value="${valor}">${nombre}</option>`).join('')}</select></label>
 <label>Adorno del rastro <select name="adorno"><option value="none">Sin adorno</option>${Object.entries(adornos).map(([valor,{nombre}])=>`<option value="${valor}">${nombre}</option>`).join('')}</select></label>
 </div>
 <label>Color libre <input name="color" type="color"></label>
 <fieldset><legend>Tonos pastel</legend><div class="paleta-puntero">${tonos.map(([nombre,color])=>`<button type="button" aria-label="${nombre}" title="${nombre}" data-tono="${color}" style="--tono:${color}"></button>`).join('')}</div></fieldset>
 <div id="medidas-laser-fino" hidden>
 <label>Tamaño <input name="ancho" type="range" min="4" max="45" step="1"><output data-valor="ancho"></output></label>
 <label>Opacidad <input name="opacidad" type="range" min="10" max="100" step="1"><output data-valor="opacidad"></output></label>
 <label>Duración del rastro <input name="duracion" type="range" min=".2" max="8" step=".1"><output data-valor="duracion"></output></label>
 </div>
 <div class="muestra-puntero"><span>Texto de ejemplo del subrayador</span></div>
 <button type="button" id="borrar-rastro">Borrar trazos</button>
 <p>${esIPad ? 'Dibuja con el Apple Pencil y usa el dedo para desplazarte o tocar los botones.' : 'Haz clic y arrastra con el trackpad o el ratón para dibujar.'}</p>`;

 let activo = false;
 let cuadro = 0;
 let punto;
 let trazos = [];
 let trazo;
 let gesto;
 let suprimirClic = false;
 let temporizadorClic;
 const duracion = () => ajustes.duracion * 1000;
 const limitar = (n,min=0,max=1) => Math.max(min,Math.min(max,n));
 const efectosDisponibles = () => ajustes.modo==='line' && ajustes.estilo==='fine';
 function actualizarAjustes() {
  for (const campo of panel.querySelectorAll('[name]')) {
   const valor = ajustes[campo.name];
   if (campo.type === 'radio') campo.checked = campo.value === valor;
   else if (campo.type === 'checkbox') campo.checked = valor;
   else campo.value = valor;
  }
  for (const [nombre,unidad] of [['ancho','px'],['opacidad','%'],['duracion','s']]) {
   panel.querySelector(`[data-valor="${nombre}"]`).value = ajustes[nombre]+' '+unidad;
  }
  panel.querySelectorAll('[data-tono]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tono.toLowerCase()===ajustes.color.toLowerCase())));
  const usarEfectos=efectosDisponibles();
  panel.querySelector('#efectos-laser-fino').hidden=!usarEfectos;
  panel.querySelector('#medidas-laser-fino').hidden=!usarEfectos;
  const tinta=usarEfectos ? tintas[ajustes.tinta] : undefined;
  const muestra = panel.querySelector('.muestra-puntero');
  muestra.style.setProperty('--color-muestra',tinta ? `linear-gradient(90deg,${tinta.colores.join(',')})` : ajustes.color);
  muestra.style.setProperty('--altura-muestra',ajustes.ancho+'px');
  muestra.style.setProperty('--opacidad-muestra',ajustes.opacidad/100);
  lienzo.classList.toggle('multiplicar',ajustes.modo==='line' && ajustes.estilo==='marker');
 }
 function cambiar(nombre,valor) {
  ajustes[nombre] = valor;
  try {localStorage.setItem(clave,JSON.stringify(ajustes));} catch {}
  trazo=punto=undefined;
  trazos=trazos.filter(paso=>paso.config.borrado==='keep');
  if(activo) pedirCuadro();
  actualizarAjustes();
 }
 panel.addEventListener('input',e=>{
  const c = e.target;
  if (!c.name) return;
  cambiar(c.name,c.type==='checkbox'?c.checked:c.type==='range'?Number(c.value):c.value);
 });
 panel.addEventListener('click',e=>{
  if(e.target.closest('#borrar-rastro')) limpiar();
  const tono=e.target.closest('[data-tono]');
  if(tono) cambiar('color',tono.dataset.tono);
 });
 function limpiar() {
  cancelAnimationFrame(cuadro);
  cuadro=0;
  trazos=[];
  trazo=punto=undefined;
  const anterior=gesto;
  gesto=undefined;
  if(anterior && superficie.hasPointerCapture(anterior.id)) superficie.releasePointerCapture(anterior.id);
  suprimirClic=false;
  clearTimeout(temporizadorClic);
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,lienzo.width,lienzo.height);
 }
 function activarPuntero(valor) {
  activo=valor;
  activar.setAttribute('aria-pressed',String(activo));
  lienzo.hidden=!activo;
  limpiar();
 }
 activar.onclick=()=>activarPuntero(!activo);
 function mostrarAjustes(mostrar) {
  panel.hidden=!mostrar;
  abrirAjustes.setAttribute('aria-expanded',String(mostrar));
 }
 abrirAjustes.onclick=()=>mostrarAjustes(panel.hidden);
 document.addEventListener('click',e=>{
  if(!panel.hidden && !barra.contains(e.target)) mostrarAjustes(false);
 });
 function pedirCuadro() {
  if(!cuadro) cuadro=requestAnimationFrame(dibujar);
 }
 function circulo(x,y,radio) {
  ctx.beginPath();
  ctx.arc(x,y,radio,0,2*Math.PI);
  ctx.fill();
 }
 function dibujarAdornos(puntos,alpha,factor,adorno,ancho) {
  ctx.globalAlpha=alpha;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  const paso=Math.max(9,ancho*.65);
  for(const [i,p] of puntos.entries()) {
   const inicio=puntos[i-1] || p;
   const longitud=p.distancia-inicio.distancia;
   const primera=i===0 ? Math.ceil(inicio.distancia/paso) : Math.floor(inicio.distancia/paso)+1;
   const ultima=Math.floor(p.distancia/paso);
   for(let n=primera;n<=ultima;n++) {
    const avance=longitud ? (n*paso-inicio.distancia)/longitud : 0;
    const lado=n%2===0 ? 1 : -1;
    const desvio=lado*ancho*factor*(.32+(n%5)*.08);
    const dx=longitud ? (p.x-inicio.x)/longitud : 1;
    const dy=longitud ? (p.y-inicio.y)/longitud : 0;
    const x=inicio.x+(p.x-inicio.x)*avance-dy*desvio;
    const y=inicio.y+(p.y-inicio.y)*avance+dx*desvio;
    const radio=Math.min(3,1.5+(n%4)*.5)*factor;
    ctx.fillStyle=adorno.colores[n%adorno.colores.length];
    if(adorno.simbolo){
     ctx.font=`${Math.max(1,radio*3.6)}px sans-serif`;
     ctx.fillText(adorno.simbolo,x,y);
    }else circulo(x,y,radio);
   }
  }
 }
 function colorTinta(tinta,distancia) {
  const posicion=distancia/tinta.paso;
  const indice=Math.floor(posicion);
  const fraccion=posicion-indice;
  const inicio=tinta.canales[indice%(tinta.canales.length-1)];
  const fin=tinta.canales[indice%(tinta.canales.length-1)+1];
  return `rgb(${inicio.map((canal,i)=>Math.round(canal+(fin[i]-canal)*fraccion)).join(',')})`;
 }
 function trazarTinta(puntos,tinta,alpha) {
  const ancho=ctx.lineWidth;
  for(let i=0;i<puntos.length;i++) {
   const fin=puntos[i];
   const inicio=puntos[i-1] || fin;
   const largo=fin.distancia-inicio.distancia;
   const gradiente=largo>0 ? ctx.createLinearGradient(inicio.x,inicio.y,fin.x,fin.y) : null;
   if(gradiente){
    gradiente.addColorStop(0,colorTinta(tinta,inicio.distancia));
    for(let d=(Math.floor(inicio.distancia/tinta.paso)+1)*tinta.paso;d<fin.distancia;d+=tinta.paso) {
     gradiente.addColorStop((d-inicio.distancia)/largo,colorTinta(tinta,d));
    }
    gradiente.addColorStop(1,colorTinta(tinta,fin.distancia));
   }
   ctx.strokeStyle=gradiente || colorTinta(tinta,fin.distancia);
   ctx.beginPath();
   ctx.moveTo(inicio.x,inicio.y);
   ctx.lineTo(fin.x+(largo>0?0:.01),fin.y);
   ctx.stroke();
  }
  ctx.shadowBlur=0;
  // Motas blancas y oscuras dentro de la tinta. La posición depende de la distancia recorrida.
  for (let i=1;i<puntos.length;i++) {
   const inicio=puntos[i-1],fin=puntos[i];
   const largo=fin.distancia-inicio.distancia;
   if(!largo) continue;
   for(let n=Math.floor(inicio.distancia/2.4)+1;n*2.4<=fin.distancia;n++){
    const avance=(n*2.4-inicio.distancia)/largo;
    const sesgo=(((n*37)%19)/18-.5)*ancho*.63;
    const x=inicio.x+(fin.x-inicio.x)*avance-(fin.y-inicio.y)/largo*sesgo;
    const y=inicio.y+(fin.y-inicio.y)*avance+(fin.x-inicio.x)/largo*sesgo;
    const tamano=Math.min(ancho*.19,.55+(n%4)*.24);
    ctx.globalAlpha=alpha*(n%5===0?.26:.64);
    ctx.fillStyle=n%5===0?'#28150e':'#fff9e8';
    circulo(x,y,tamano/2);
   }
  }
 }
 function linea(puntos,alpha,factor,distancia,config) {
  if(alpha<=0 || factor<=0) return;
  const {ancho,estilo,color}=config;
  const tinta=tintas[config.tinta];
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.strokeStyle=color;
  ctx.lineWidth=(estilo==='fine'?Math.max(1.5,ancho*.36):ancho)*factor;
  ctx.lineCap=estilo==='marker'?'square':'round';
  ctx.lineJoin='round';
  if((estilo==='fine'&&!tinta)||estilo==='glow'){
   ctx.shadowColor=tinta?.colores[0] || color;
   ctx.shadowBlur=ancho*factor*(estilo==='fine'?.35:1);
  }
  if(estilo==='dots'||estilo==='dashes'){
   ctx.setLineDash([estilo==='dots'?.15:ancho*1.65,ancho*1.7]);
   ctx.lineDashOffset=-distancia;
  }
  if(tinta) trazarTinta(puntos,tinta,alpha);
  else {
   ctx.beginPath();
   ctx.moveTo(puntos[0].x,puntos[0].y);
   if(puntos.length===1) ctx.lineTo(puntos[0].x+.01,puntos[0].y);
   for(const p of puntos.slice(1)) ctx.lineTo(p.x,p.y);
   ctx.stroke();
   if(estilo==='fine'){
    ctx.shadowBlur=0;
    ctx.strokeStyle='#fff';
    ctx.lineWidth=Math.max(.5*factor,ctx.lineWidth*.40);
    ctx.stroke();
   }
  }
  ctx.shadowBlur=0;
  const simbolos=simbolosTinta[tinta?.adorno];
  if(simbolos) dibujarAdornos(puntos,alpha,factor,simbolos,ancho);
  const adorno=adornos[config.adorno];
  if(adorno && config.adorno!==tinta?.adorno) dibujarAdornos(puntos,alpha,factor,adorno,ancho);
  ctx.restore();
 }
 function destellosEnLaPunta() {
  const tinta=tintas[trazo?.config.tinta];
  if(!gesto||!tinta) return;
  const punta=trazo.puntos.at(-1);
  const {ancho,opacidad}=trazo.config;
  const fase=Math.floor(punta.distancia/3);
  for(let i=0;i<7;i++){
   const angulo=(fase+i*2.4)*.91;
   const radio=ancho*(.35+(i%4)*.18);
   const lado=.85+(i%3)*.55;
   ctx.globalAlpha=opacidad/100*(.28+(i%3)*.20);
   ctx.fillStyle=tinta.colores[i%tinta.colores.length];
   circulo(punta.x+Math.cos(angulo)*radio,punta.y+Math.sin(angulo)*radio,lado/2);
  }
 }
 function dibujar(ahora) {
  cuadro=0;
  const caja=lienzo.getBoundingClientRect();
  if(!caja.width || !caja.height) return;
  const ratio=Math.min((devicePixelRatio||1)*(window.visualViewport?.scale||1),3);
  const ancho=Math.max(1,Math.round(caja.width*ratio));
  const alto=Math.max(1,Math.round(caja.height*ratio));
  if(lienzo.width!==ancho || lienzo.height!==alto) {
   lienzo.width=ancho;
   lienzo.height=alto;
  }
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,ancho,alto);
  // El lápiz y getBoundingClientRect usan las mismas coordenadas de pantalla.
  // Convierte esas coordenadas al espacio real del lienzo, incluso con zoom.
  const escalaX=ancho/caja.width, escalaY=alto/caja.height;
  ctx.setTransform(escalaX,0,0,escalaY,-caja.left*escalaX,-caja.top*escalaY);
  ctx.save();
  const opacidad=ajustes.opacidad/100;
  for(const paso of trazos){
   const {puntos,ultimo,config}=paso;
   const efecto=config.borrado==='auto'?(config.estilo==='fine'?'smooth':'tail'):config.borrado;
   const opacidadTrazo=config.opacidad/100;
   const duracionTrazo=config.duracion*1000;
   if(efecto==='keep') {
    linea(puntos,opacidadTrazo,1,0,config);
    continue;
   }
   if(efecto==='tail'){
    while(puntos.length>1 && ahora-puntos[1].tiempo>=duracionTrazo) puntos.shift();
    const grupos=new Map();
    for(let n=0;n<puntos.length;n++){
     const p=puntos[n];
     const alpha=Math.round(16*limitar((1-(ahora-p.tiempo)/duracionTrazo)/.45))/16;
     if(!alpha) continue;
     const previo=puntos[Math.max(0,n-1)];
     const grupo=grupos.get(alpha);
     if(grupo) grupo.puntos.push(p);
     else grupos.set(alpha,{puntos:previo===p?[p]:[previo,p],distancia:previo.distancia});
    }
    for(const [alpha,g] of grupos) linea(g.puntos,opacidadTrazo*alpha,1,g.distancia,config);
   }else{
    const edad=paso===trazo && gesto ? 0 : ahora-ultimo;
    const restante=limitar(1-edad/duracionTrazo);
    const alpha=efecto==='cut'?Number(restante>0):limitar(restante/.7);
    linea(puntos,opacidadTrazo*alpha,efecto==='thin'?alpha:1,0,config);
   }
  }
  trazos=trazos.filter(paso=>paso.config.borrado==='keep'||(paso===trazo && gesto)||ahora-paso.ultimo<paso.config.duracion*1000);
  if(trazo&&!trazos.includes(trazo)) trazo=undefined;
  destellosEnLaPunta();
  if(punto){
   const restante=punto.fijo?1:limitar(1-(ahora-punto.tiempo)/duracion());
   ctx.globalAlpha=opacidad*limitar(restante/.3);
   ctx.fillStyle=ajustes.color;
   ctx.shadowColor=ajustes.color;
   ctx.shadowBlur=8;
   ctx.strokeStyle='#fff';
   ctx.lineWidth=1.5;
   ctx.beginPath();
   ctx.arc(punto.x,punto.y,ajustes.ancho/2,0,Math.PI*2);
   ctx.fill();
   ctx.stroke();
   if(!restante) punto=undefined;
  }
  ctx.restore();
  if(trazos.some(paso=>paso.config.borrado!=='keep') || (punto&&!punto.fijo)) pedirCuadro();
 }
 function colocar(x,y,fijo=false) {
  const tiempo=performance.now();
  if(ajustes.modo==='dot') punto={x,y,tiempo,fijo};
  else {
   if(!trazo || (!gesto && tiempo-trazo.ultimo>=duracion())){
    const config={...ajustes};
    if(!efectosDisponibles()) {
     config.tinta='solid';
     config.adorno='none';
    }
    trazo={puntos:[],ultimo:tiempo,config};
    trazos.push(trazo);
   }
   const anterior=trazo.puntos.at(-1);
   const distancia=anterior?anterior.distancia+Math.hypot(x-anterior.x,y-anterior.y):0;
   if(!anterior || x!==anterior.x || y!==anterior.y) trazo.puntos.push({x,y,tiempo,distancia});
   trazo.ultimo=tiempo;
  }
  pedirCuadro();
 }
 function salir() {
  if(trazo?.config.borrado==='keep') pedirCuadro();
  trazo=undefined;
  if(punto?.fijo) {
   punto.fijo=false;
   punto.tiempo=performance.now();
   pedirCuadro();
  }
 }
 const controles='a,button,input,textarea,select,summary,label,[contenteditable]';
 document.addEventListener('pointerdown',e=>{
  if(!activo || gesto || !dibujaCon(e.pointerType) || e.button!==0 || barra.contains(e.target)) return;
  const control=e.target.closest(controles);
  if(control?.matches('textarea,select,[contenteditable],input:not([type=radio]):not([type=checkbox]):not([type=button]):not([type=submit])')) return;
  clearTimeout(temporizadorClic);
  suprimirClic=false;
  gesto={id:e.pointerId,x:e.clientX,y:e.clientY,sobreControl:Boolean(control)};
  if(!control) {
   e.preventDefault();
   superficie.setPointerCapture(e.pointerId);
   suprimirClic=true;
  }
  colocar(e.clientX,e.clientY,true);
 });
 // iPadOS distingue el lápiz del dedo en los eventos táctiles.
 // Cancela el desplazamiento del lápiz sin bloquear los gestos con el dedo.
 for(const tipo of ['touchstart','touchmove']) document.addEventListener(tipo,e=>{
  if(!gesto || (tipo==='touchstart' && gesto.sobreControl)) return;
  if(e.cancelable && Array.from(e.changedTouches).some(touch=>touch.touchType==='stylus')) e.preventDefault();
 },{passive:false});
 document.addEventListener('pointermove',e=>{
  if(!activo || gesto?.id!==e.pointerId) return;
  if(Math.hypot(e.clientX-gesto.x,e.clientY-gesto.y)>6) suprimirClic=true;
  colocar(e.clientX,e.clientY,true);
 });
 document.addEventListener('dragstart',e=>{if(gesto) e.preventDefault();});
 for(const tipo of ['pointerup','pointercancel','lostpointercapture']) document.addEventListener(tipo,e=>{
  if(gesto?.id!==e.pointerId) return;
  gesto=undefined;
  salir();
  temporizadorClic=setTimeout(()=>{suprimirClic=false;},0);
 });
 document.addEventListener('click',e=>{
  if(suprimirClic && e.detail>0 && (!e.pointerType || dibujaCon(e.pointerType))){e.preventDefault();e.stopPropagation();}
 },true);
 document.addEventListener('keydown',e=>{
  if(e.key!=='Escape') return;
  if(!panel.hidden) {
   mostrarAjustes(false);
   abrirAjustes.focus({preventScroll:true});
  }
  if(activo) limpiar();
 });
 window.addEventListener('blur',limpiar);
 for(const evento of ['resize','scroll','hashchange','beforeprint']) window.addEventListener(evento,limpiar);
 for(const evento of ['resize','scroll']) window.visualViewport?.addEventListener(evento,limpiar);
 barra.removeAttribute('hidden');
 actualizarAjustes();
})();
