'use strict';

var fs = require('fs');
const url = require('url');
const WebSocket = require('ws');

var commandArgs = process.argv.slice(2);

const wsHost = commandArgs[0] || 'localhost:8081';
const wsPath = commandArgs[1] || '/api/ws/User+signed-up+WebSocket+API/0.1.9/user/signedup';
const wsCert = commandArgs[2] || null;

console.log("Connecting to " + wsHost + ' on path ' + wsPath);

var ws = null;

// Initialize WS Client consumer with or without ssl depending on Cert presence.
if (wsCert != null) {
  if (wsHost.indexOf(':443') != -1) {
    ws = new WebSocket('wss://' + wsHost + wsPath);
  } else {
    ws = new WebSocket('ws://' + wsHost + wsPath);
  }
} else {
  ws = new WebSocket('wss://' + wsHost + wsPath, {
    rejectUnauthorized: false,
    ca: [fs.readFileSync(wsCert, 'utf-8')]
  });
}

ws.on('open', function open() {
  console.log('WebSocket is opened');
});
ws.on('error', function(err) {
  console.log(err);
});
ws.on('message', function incoming(data) {
  console.log(
    JSON.stringify(JSON.parse(data), null, 2)
  );
});