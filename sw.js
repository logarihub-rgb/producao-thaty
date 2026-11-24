const C='producao-thaty-v4';
const ARQ=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ARQ.map(x=>new Request(x,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.startsWith('producao-thaty-')).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // abre do celular na hora e atualiza por trás para a próxima vez
  const K=u.origin+u.pathname;e.respondWith(caches.match(K).then(m=>{const rede=fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(K,cp))}return r}).catch(()=>m||caches.match('index.html'));if(m){e.waitUntil(rede);return m}return rede}));
});

/* ===== Notificações ===== */
async function lerAuth(k){const c=await caches.open('pt-auth');const r=await c.match('/__'+k);return r?r.text():''}
async function gravarAuth(k,v){const c=await caches.open('pt-auth');await c.put('/__'+k,new Response(String(v)))}
const ICONE='icon-192.png';
self.addEventListener('push',e=>{
  e.waitUntil((async()=>{
    let mostrou=0;
    try{
      const api=await lerAuth('api'),pin=await lerAuth('pin'),since=Number(await lerAuth('since')||0);
      if(api&&pin){
        const r=await fetch(api,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'notifs',pin,since})});
        const j=await r.json();
        const ns=(j.notifs||[]).slice(-5);
        let max=since;
        for(const n of ns){await self.registration.showNotification(n.titulo,{body:n.corpo,tag:n.id,icon:ICONE,badge:ICONE,data:{url:'./#financeiro'}});mostrou++;if(n.quando>max)max=n.quando}
        if(max>since)await gravarAuth('since',max);
      }
    }catch(err){}
    if(!mostrou){
      const abertas=await self.registration.getNotifications();
      if(!abertas.length)await self.registration.showNotification('Produção Thaty',{body:'Novo pedido de pagamento. Toque para ver.',tag:'pt-geral',icon:ICONE,data:{url:'./#financeiro'}});
    }
  })());
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const alvo=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{
    for(const w of ws){if('focus' in w){w.navigate&&w.navigate(alvo).catch(()=>{});return w.focus()}}
    return clients.openWindow(alvo);
  }));
});
