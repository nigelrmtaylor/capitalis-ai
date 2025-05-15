import { PostGraphileAmberPreset } from 'postgraphile/presets/amber';
import { makePgService } from 'postgraphile/adaptors/pg';
import { pool } from './db.mjs';
//import KafkaPlugin from './plugins/kafka-entity-subscription.js';
import ForumMesssagesPlugin from "./plugins/forum-messages-plugin.js";
import MeaningOfLifePlugin from "./plugins/meaning-of-life-plugin.js";

/** @type {GraphileConfig.Preset} */
const preset = {
  extends: [PostGraphileAmberPreset],
  plugins: [
    ForumMesssagesPlugin,MeaningOfLifePlugin
  ],
  grafserv: { 
    port: 5678,
    websockets: true, // <-- this is the correct option!
    graphiqlPath: '/graphiql',
    graphiql: true,
    graphiqlOnGraphQLGET: false,
    subscriptions: true,

  },
  grafast: {
    explain: true
  },
  pgServices: [
    makePgService({
      pool,
      // List of database schemas:
      schemas: ['public', 'capitalis', 'rocher', 'core'],
      // Enable LISTEN/NOTIFY:
      pubsub: true,
    }),
  ],
};

export default preset;
