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
// Create a simple subscriber and iterate over messages matching the subscription.
const sub = nc.subscribe(natsTopic);

(async () => {
  for await (const m of sub) {
    console.log(
        JSON.stringify(JSON.parse(sc.decode(m.data)), null, 2)
    );
  }
})();