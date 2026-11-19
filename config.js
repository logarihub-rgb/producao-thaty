window.PT_API = "https://script.google.com/macros/s/AKfycbwrhYfCqIEP1yZ51kV1y3GWsMO9fbbWRCta7S-y-e-cfkTrMXH2B5S3I2TGyL_D4_37/exec";
/* Link pessoal: ?k=CHAVE entra direto, sem PIN */
(function(){
  try {
    var k = new URLSearchParams(location.search).get('k');
    if (!k) return;
    localStorage.setItem('pt_pin', k);
    var base = location.href.split('?')[0].split('#')[0];
    var m = {name:'Produção Thaty ✨', short_name:'Produção', start_url: base + '?k=' + encodeURIComponent(k), scope: base, display:'standalone', orientation:'portrait', background_color:'#fdf9fa', theme_color:'#fbf0f4', lang:'pt-BR',
      icons:[{src: base+'icon-192.png', sizes:'192x192', type:'image/png'},{src: base+'icon-512.png', sizes:'512x512', type:'image/png'},{src: base+'icon-maskable-512.png', sizes:'512x512', type:'image/png', purpose:'maskable'}]};
    var url = URL.createObjectURL(new Blob([JSON.stringify(m)], {type:'application/manifest+json'}));
    var l = document.querySelector('link[rel=manifest]'); if (l) l.href = url;
  } catch(e){}
})();
