import { PostGraphileAmberPreset } from 'postgraphile/presets/amber';
import { makePgService } from 'postgraphile/adaptors/pg';
import { pool } from './db.mjs';

/** @type {GraphileConfig.Preset} */
const preset = {
  extends: [PostGraphileAmberPreset],
  
  grafserv: { 
    port: 5678,
    graphiqlPath: '/graphiql',
    graphiql: true,
    graphiqlOnGraphQLGET: false
  },
  grafast: {
    explain: true
  },
  pgServices: [
    makePgService({
      pool,
      // List of database schemas:
      schemas: ['capitalis'],
      // Enable LISTEN/NOTIFY:
      pubsub: true,
    }),
  ],
};

export default preset;
