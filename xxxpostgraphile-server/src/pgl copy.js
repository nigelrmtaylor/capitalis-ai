import { postgraphile } from 'postgraphile';
import preset from './graphile.config.mjs';

console.log('Creating PostGraphile instance with preset:', preset);

// Our PostGraphile instance:
export const pgl = postgraphile(preset, {
  enableQueryLog: true,
  extendedErrors: ['hint', 'detail', 'errcode'],
  showErrorStack: true,
  logTiming: true,
});
