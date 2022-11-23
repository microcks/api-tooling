'use strict';

const amqplib = require('amqplib/callback_api');

var commandArgs = process.argv.slice(2);

const amqpHost = commandArgs[0] || 'amqp://microcks:microcks@localhost:5672';
const amqpTopic = commandArgs[1] || 'user/signedup';
const amqpExch = commandArgs[2] || null;
const amqpUser = commandArgs[3] || 'microcks'
const amqpPassword = commandArgs[4] || 'microcks';
const amqpCert = commandArgs[5] || null;

console.log("Connecting to " + amqpHost + ' on destination ' + amqpTopic);

function cb(err, ok) {
  if (err) throw err;
}

const createMessage = () => ({
  displayName: "John Doe",
  //name: "John Doe",
  email: "john@doe.com"
})

amqplib.connect(amqpHost, (err, conn) => {
  if (err) throw err;

  // Sender
  conn.createChannel((err, ch) => {
    if (err) throw err;

    if (amqpExch != null) {
      ch.assertExchange(amqpTopic, amqpExch, { durable: false }, cb);
      setInterval(() => {
        var msg = createMessage();
        console.log('Publishing ' + JSON.stringify(msg));
        ch.publish(amqpTopic, amqpExch, Buffer.from(JSON.stringify(msg)));
      }, 3000);
    } else {
      ch.assertQueue(amqpTopic, { durable: false, noAck: true }, cb);
      setInterval(() => {
        var msg = createMessage();
        console.log('Sending ' + JSON.stringify(msg));
        ch.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
      }, 3000);
    }
  });
});