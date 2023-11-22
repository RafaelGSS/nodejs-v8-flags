const http = require('http');
const assert = require('assert')

const server = http.createServer((req, res) => {
  const largeDataArray = [];
  for (let i = 0; i < 1e5; i++) {
    largeDataArray.push({
      id: i,
      data: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    });
  }
  assert.ok(largeDataArray.length);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('Hello world');
});

console.log('Listening...')
server.listen(3000);
