import { investingModules } from './investing';
import { tradingModules } from './trading';
import { fundamentalModules } from './fundamental';

export const COURSES_DATA = {
  investing: { modules: investingModules },
  trading: { modules: tradingModules },
  fundamental: { modules: fundamentalModules }
};
