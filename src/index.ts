import { PluginConstructor } from 'yamdbf';

import { LeaguePluginOptions } from './types';
import { LeaguePlugin } from './LeaguePlugin';

const league: (token: string, options?: LeaguePluginOptions) => PluginConstructor = LeaguePlugin.build;
export { league as League }
export { LeaguePlugin };
export { LeaguePluginOptions, Region } from './types';
export default league;
