'use strict';

var fs = require('fs');
const { Kafka } = require('kafkajs')

var commandArgs = process.argv.slice(2);

const kafkaHost = commandArgs[0] || 'localhost:9092';
const kafkaTopic = commandArgs[1] || 'UsersignedupAPI-0.1.2-user-signedup';
const KafkaCert = commandArgs[2] || null;

console.log("Connecting to " + kafkaHost + ' on topic ' + kafkaTopic);

var kafka = null;

// Initialize Kafka producer with or without ssl depending on Cert presence.
if (KafkaCert != null) {
  kafka = new Kafka({
    clientId: 'my-app',
    brokers: [kafkaHost],
    ssl: {
      rejectUnauthorized: false,
      ca: [fs.readFileSync(KafkaCert, 'utf-8')]
    },
  });
} else {
  kafka = new Kafka({
    clientId: 'my-app',
    brokers: [kafkaHost]
  })
}

const producer = kafka.producer()

const getRandomId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const createMessage = id => ({
  key: `${id}`,
  value: JSON.stringify({
    id: `${id}`,
    sendAt: `${Date.now()}`,
    //sendAt: Date.now(),
    fullName: "Laurent Broudoux",
    email: "laurent@microcks.io",
    age: 41
  })
})

const sendMessage = () => {
  var message = createMessage(getRandomId());
  return producer.send({
      topic: kafkaTopic,
      messages: [
        message
      ]
    })
    .then(console.log)
    .catch(e => console.error(`[example/producer] ${e.message}`, e))
}

const run = async () => {
  await producer.connect()
  setInterval(sendMessage, 5000)
}

run().catch(e => console.error(`[example/producer] ${e.message}`, e))