'use strict';

var fs = require('fs');
const { Kafka } = require('kafkajs')

var commandArgs = process.argv.slice(2);

const kafkaHost = commandArgs[0] || 'localhost:9092';
const kafkaTopic = commandArgs[1] || 'UsersignedupAPI-0.1.1-user-signedup';
const KafkaCert = commandArgs[2] || null;

console.log("Connecting to " + kafkaHost + ' on topic ' + kafkaTopic);

var kafka = null;

// Initialize Kafka consumer with or without ssl depending on Cert presence.
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

const consumer = kafka.consumer({ groupId: 'kafkajs-client' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: kafkaTopic, fromBeginning: false })
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        JSON.stringify(JSON.parse(message.value.toString()), null, 2)
      );
    },
  });
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))