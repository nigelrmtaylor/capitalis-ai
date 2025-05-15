import { postgraphile } from 'postgraphile';
import config from './graphile.config.mjs';

let pgl;

try {
  pgl = await postgraphile(config);
} catch (error) {
  console.error('\nPostGraphile Initialization Error:');
  console.error('  Failed to initialize PostGraphile');
  console.error(`  Error details: ${error.message}`);
  if (error.stack) {
    console.error('  Stack trace:', error.stack);
  }
  process.exit(1);
}

export { pgl };