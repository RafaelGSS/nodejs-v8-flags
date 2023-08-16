const http = require('http');

const largeDataArray = [];
for (let i = 0; i < 100000; i++) {
  largeDataArray.push({
    id: i,
    data: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  });
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(largeDataArray));
});

console.log('Listening...')
server.listen(3000);
