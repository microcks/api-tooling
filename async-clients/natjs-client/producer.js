'use strict';

import { connect, StringCodec } from "nats";

var commandArgs = process.argv.slice(2);

const natsHost = commandArgs[0] || 'localhost:4222';
const natsTopic = commandArgs[1] || 'UsersignedupAPI-0.1.30-user/signedup';
const natsUser = commandArgs[2] || 'microcks'
const natsPassword = commandArgs[3] || 'microcks';
const natsCert = commandArgs[4] || null;

console.log("Connecting to " + natsHost + ' on topic ' + natsTopic);

const nc = await connect({
  servers: natsHost,
  user: natsUser,
  pass: natsPassword
});

// Create a codec
const sc = StringCodec();

const getRandomId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const createMessage = id => ({
  id: `${id}`,
  sendAt: `${Date.now()}`,
  //sendAt: Date.now(),
  fullName: "Laurent Broudoux",
  email: "laurent@microcks.io",
  age: 41
})

setInterval(() => {
  var msg = createMessage(getRandomId());
  console.log('Sending ' + JSON.stringify(msg));
  nc.publish(natsTopic, sc.encode(JSON.stringify(msg)));
}, 3000);