const net = require('net');
const { welcomeMessage, hiringMessages } = require('./strings');

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function write(text, socket) {
  socket.write(text);
  await sleep(100);
}

async function writeLine(line, socket) {
  socket.write('\n');
  for (const text of line.split('')) {
    await write(text, socket);
  }
}

async function newSocket(socket) {
  socket.write(welcomeMessage);
  for (const message of hiringMessages) {
    await writeLine(message, socket);
  }
}

const server = net.createServer(newSocket);

server.listen(8888);
