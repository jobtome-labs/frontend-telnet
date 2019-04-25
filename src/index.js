const net = require('net');
const winston = require('winston');
const { welcomeMessage, hiringMessages } = require('./strings');

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()]
});

const sockets = [];

function closeSocket(socket) {
  const i = sockets.indexOf(socket);
  if (i !== -1) {
    sockets.splice(i, 1);
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function write(text, socket) {
  try {
    socket.write(text);
    await sleep(100);
  } catch (e) {
    logger.info('', e);
  }
}

async function writeLine(line, socket) {
  try {
    socket.write('\n');
    for (const text of line.split('')) {
      await write(text, socket);
    }
  } catch (e) {
    logger.info('', e);
  }
}

async function newSocket(socket) {
  sockets.push(socket);
  socket.write(welcomeMessage);
  for (const message of hiringMessages) {
    await writeLine(message, socket);
  }
  socket.on('end', () => {
    closeSocket(socket);
  });
}

const server = net.createServer(newSocket);
server.listen(process.env.PORT || 8888, () => logger.info('server started'));
process.on('uncaughtException', e => logger.info('', e));
