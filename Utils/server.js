const http = require('http');

exports.server = () => {
  const server = http.createServer((req, res) => {
    console.log("200 NEW REQ IN: " + new Date().toLocaleString());
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, world!\n');
  });

  server.listen(6800, () => {
    console.log('Server listening on port 3000');
  });
}
