'use strict';

var fs = require('fs');
const path = require('path')
const { Kafka } = require('kafkajs')
const { SchemaRegistry, readAVSCAsync, COMPATIBILITY: { NONE } } = require('@kafkajs/confluent-schema-registry')

var commandArgs = process.argv.slice(2);

const kafkaHost = commandArgs[0] || 'localhost:9092';
const kafkaTopic = commandArgs[1] || 'users';
const kafkaRegistry = commandArgs[2] || 'http://localhost:8889'
const kafkaCert = commandArgs[3] || null;

console.log("Connecting to " + kafkaHost + ' on topic ' + kafkaTopic + ", using registry " + kafkaRegistry);

var kafka = null;

// Initialize Kafka producer with or without ssl depending on Cert presence.
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

const producer = kafka.producer()

const getRandomId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const createMessage = id => ({
  key: `${id}`,
  value: {
    // Bad value: name is undefined in Avro schema in Microcks.
    //name: "Laurent Broudoux",
    // Good value: fullName is defined in Avro schema in Microcks.
    fullName: "Laurent Broudoux",
    email: "laurent@microcks.io",
    age: 41
  }
})

const run = async () => {
  //const schema = await readAVSCAsync(path.join(__dirname, 'user-signedup-bad.avsc'))
  const schema = await readAVSCAsync(path.join(__dirname, 'user-signedup.avsc'))
  // Compatibility specification is required for auto-registration if does not exist
  //const { id } = await registry.register(schema, { subject: kafkaTopic + '-value' })
  const { id } = await registry.register(schema, { subject: kafkaTopic + '-value', compatibility: NONE })

  const sendMessage = async () => {
    var message = createMessage(getRandomId());
    var encodedValue = await registry.encode(id, message.value);
    const encodedMessage = {
      key: message.key,
      value: encodedValue
    }
    return producer.send({
        topic: kafkaTopic,
        messages: [
          encodedMessage
        ]
      })
      .then(console.log)
      .catch(e => console.error(`[example/producer] ${e.message}`, e))
  }

  await producer.connect()
  setInterval(sendMessage, 5000)
}

run().catch(e => console.error(`[example/producer] ${e.message}`, e))