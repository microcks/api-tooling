'use strict';

const amqplib = require('amqplib/callback_api');

var commandArgs = process.argv.slice(2);

const amqpHost = commandArgs[0] || 'amqp://microcks:microcks@localhost:5672';
const amqpTopic = commandArgs[1] || 'AccountService-1.1.0-user/signedup';
const amqpUser = commandArgs[2] || 'microcks'
const amqpPassword = commandArgs[3] || 'microcks';
const amqpCert = commandArgs[4] || null;

console.log("Connecting to " + amqpHost + ' on topic ' + amqpTopic);

function cb(err, ok) {
  if (err) throw err;
}

amqplib.connect(amqpHost, (err, conn) => {
  if (err) throw err;

  // Listener
  conn.createChannel( (err, ch) => {
    if (err) throw err;

    ch.checkExchange(amqpTopic, cb);
    ch.assertQueue('amqpjs-client', { durable: false, noAck: true }, cb);
    ch.bindQueue('amqpjs-client', amqpTopic, '');

    ch.consume('amqpjs-client', (msg) => {
      if (msg !== null) {
        console.log(
          JSON.stringify(JSON.parse(msg.content.toString()), null, 2)
        );
      }
    });
  });
  
});