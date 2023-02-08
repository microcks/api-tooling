'use strict';

import { PubSub } from '@google-cloud/pubsub';

var commandArgs = process.argv.slice(2);

const pubsubProject = commandArgs[0] || 'cloud-quotegame';
const pubsubTopic = commandArgs[1] || 'UsersignedupAPI-0.1.20-user-signedup';
const pubsubKeyFile = commandArgs[2] || '/Users/lbroudoux/Development/google-cloud-creds/cloud-quotegame/googlecloud-service-account.json'
const pubsubSub = commandArgs[3] || 'gpubsub-client-echo'

console.log("Connecting to " + pubsubProject + ' on topic ' + pubsubTopic + ' with sub ' + pubsubSub);

const pubsub = new PubSub({
  projectIf: pubsubProject,
  keyFilename: pubsubKeyFile
});

const topic = pubsub.topic(pubsubTopic);

// Creates a subscription on that new topic
const [subscription] = await topic.createSubscription(pubsubSub);

// Receive callbacks for new messages on the subscription
subscription.on('message', message => {
  console.log(JSON.stringify(JSON.parse(message.data.toString()), null, 2));
});

// Receive callbacks for errors on the subscription
subscription.on('error', error => {
  console.error('Received error:', error);
  process.exit(1);
});