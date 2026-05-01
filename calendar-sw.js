const CACHE = 'lifequest-v1';
const ASSETS = ['./calendar.html', './calendar-manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  /* Agent HTTP API — /api/* */
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(handleAgentAPI(url, e.request));
    return;
  }

  /* Cache-first for app assets */
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

async function handleAgentAPI(url, request) {
  const path = url.pathname.replace('/api/', '');
  const clients = await self.clients.matchAll();

  /* Read data from the first open client via postMessage */
  const data = await new Promise((resolve) => {
    if (!clients.length) { resolve(null); return; }
    const mc = new MessageChannel();
    mc.port1.onmessage = e => resolve(e.data);
    clients[0].postMessage({type: 'api-read'}, [mc.port2]);
    setTimeout(() => resolve(null), 1000);
  });

  if (!data) {
    return jsonResponse({error: 'App nicht geöffnet — bitte calendar.html im Browser öffnen'}, 503);
  }

  const today = new Date().toISOString().slice(0, 10);

  if (path === 'status') {
    return jsonResponse({ok: true, version: '1.0.0', player: data.player.name});
  }
  if (path === 'player') {
    return jsonResponse(data.player);
  }
  if (path === 'today') {
    return jsonResponse({
      date: today,
      events: data.events.filter(e => e.date === today),
      quests: data.quests.filter(q => !q.completed)
    });
  }
  if (path === 'events') {
    const date = url.searchParams.get('date');
    return jsonResponse(date ? data.events.filter(e => e.date === date) : data.events);
  }
  if (path === 'quests') {
    const filter = url.searchParams.get('filter');
    let list = data.quests;
    if (filter === 'active') list = list.filter(q => !q.completed);
    if (filter === 'daily') list = list.filter(q => q.type === 'daily');
    if (filter === 'done') list = list.filter(q => q.completed);
    return jsonResponse(list);
  }
  if (path === 'reminders') {
    return jsonResponse(data.events.filter(e => e.type === 'reminder' && !e.completed));
  }
  if (path === 'achievements') {
    return jsonResponse(data.achievements);
  }

  return jsonResponse({error: 'Unbekannter API-Pfad: ' + path}, 404);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
  });
}

/* Listen for data requests from handleAgentAPI */
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'api-read') {
    /* Retrieve data from localStorage via client */
    e.ports[0].postMessage(null);
  }
});
