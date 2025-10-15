fetch('/api/track-proxy', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    session_id: 'seed-1',
    persona: 'everyday_female',
    category: 'water',
    outcome: 'win'
  })
}).then(r => r.json()).then(console.log).catch(console.error);
