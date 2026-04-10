const http = require('http');
const next = require('next');
const app = next({ dev: true, dir: '.', hostname: '127.0.0.1', port: 3000 });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(3000, '127.0.0.1', () => {
    console.log('custom next server running on http://127.0.0.1:3000');
  });
}).catch((e) => {
  console.error('prepare failed', e);
  process.exit(1);
});
