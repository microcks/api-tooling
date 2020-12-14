'use strict';

var fs = require('fs');
var mqtt = require('mqtt')

var commandArgs = process.argv.slice(2);

const mqttHost = commandArgs[0] || 'mqtt://localhost:61616';
const mqttTopic = commandArgs[1] || 'StreetlightsAPI_1.0.0_smartylighting-streetlights-event-lighting-measured';
const mqttUser = commandArgs[2] || 'microcks';
const mqttPassword = commandArgs[3] || 'microcks';
const mqttCert = commandArgs[4] || null;

console.log("Connecting to " + mqttHost + ' on topic ' + mqttTopic);

var client = null;

// Initialize MQTT consumer with or without ssl depending on Cert presence.
if (mqttCert != null) {
  client = mqtt.connect(mqttHost, {
    username: mqttUser,
    password: mqttPassword,
    rejectUnauthorized: false,
    ca: [fs.readFileSync(mqttCert, 'utf-8')]
  });
} else {
  client = mqtt.connect(mqttHost, {
    username: mqttUser,
    password: mqttPassword
  });
}

client.on('connect', function () {
  client.subscribe(mqttTopic, function (err) {
    if (!err && err != null) {
      console.log(err);
    }
  })
})
  
client.on('message', function (topic, message) {
  console.log(
    JSON.stringify(JSON.parse(message.toString()), null, 2)
  );
})
