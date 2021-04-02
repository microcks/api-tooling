'use strict';

var fs = require('fs');
const { Kafka } = require('kafkajs')
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')

var commandArgs = process.argv.slice(2);

const kafkaHost = commandArgs[0] || 'localhost:9092';
const kafkaTopic = commandArgs[1] || 'UsersignedupAPI-0.1.1-user-signedup';
const kafkaRegistry = commandArgs[2] || 'http://localhost:8888'
const kafkaCert = commandArgs[3] || null;

console.log("Connecting to " + kafkaHost + ' on topic ' + kafkaTopic + ", using regsitry " + kafkaRegistry);

var kafka = null;

// Initialize Kafka consumer with or without ssl depending on Cert presence.
if (kafkaCert != null) {
  kafka = new Kafka({
    clientId: 'my-app',
    brokers: [kafkaHost],
    ssl: {
      rejectUnauthorized: false,
      ca: [fs.readFileSync(kafkaCert, 'utf-8')]
    },
  });
} else {
  kafka = new Kafka({
    clientId: 'my-app',
    brokers: [kafkaHost]
  })
}

const registry = new SchemaRegistry({ host: kafkaRegistry })

const consumer = kafka.consumer({ groupId: 'kafkajs-client' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: kafkaTopic, fromBeginning: false })
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      const decodedValue = await registry.decode(message.value)
      console.log(
        JSON.stringify(JSON.parse(decodedValue.toString()), null, 2)
      );
    },
  });
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))