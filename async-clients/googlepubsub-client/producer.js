'use strict';

import { PubSub } from '@google-cloud/pubsub';

var commandArgs = process.argv.slice(2);

const pubsubProject = commandArgs[0] || 'cloud-quotegame';
const pubsubTopic = commandArgs[1] || 'user-signups';
const pubsubKeyFile = commandArgs[2] || '/Users/lbroudoux/Development/google-cloud-creds/cloud-quotegame/googlecloud-service-account.json'

console.log("Connecting to " + pubsubProject + ' on topic ' + pubsubTopic);

const pubsub = new PubSub({
  projectIf: pubsubProject,
  keyFilename: pubsubKeyFile
});

const topic = pubsub.topic(pubsubTopic);

const getRandomId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const createMessage = id => ({
  id: `${id}`,
  sendAt: `${Date.now()}`,
  fullName: "Laurent Broudoux",
  //sendAt: Date.now(),
  //displayName: "Laurent Broudoux",
  email: "laurent@microcks.io",
  age: 43
})

setInterval(() => {
  var msg = createMessage(getRandomId());
  console.log('Sending ' + JSON.stringify(msg));
  const data = Buffer.from(JSON.stringify(msg));
  topic.publishMessage({data});
}, 3000);
