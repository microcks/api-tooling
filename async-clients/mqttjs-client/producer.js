'use strict';

var fs = require('fs');
var mqtt = require('mqtt')

var commandArgs = process.argv.slice(2);

const mqttHost = commandArgs[0] || 'mqtt://localhost:1883';
const mqttTopic = commandArgs[1] || 'streetlights/event/lighting/measured';
const mqttUser = commandArgs[2] || 'microcks';
const mqttPassword = commandArgs[3] || 'microcks';
const mqttCert = commandArgs[4] || null;

console.log("Connecting to " + mqttHost + ' on topic ' + mqttTopic);

var client = null;

// Initialize MQTT publisher with or without ssl depending on Cert presence.
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

const createMessage = () => ({
  streetlightId: "devX",
  lumens: 900, 
  //location: "47.8509682604982, 0.11136576784773598",
  sentAt: `${new Date().toISOString()}`
})

const sendMessage = () => {
  var msg = createMessage();
  client.publish(mqttTopic, JSON.stringify(msg));
  console.log(msg);
}

client.on('error', function(err) { 
  console.error(err); 
})

client.on('connect', function () {
  setInterval(sendMessage, 3000)
})