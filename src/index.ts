import { PluginConstructor } from 'yamdbf';

import { LeaguePlugin } from './LeaguePlugin';
import { LeaguePluginOptions } from './types';

const league: (token: string, options?: LeaguePluginOptions) => PluginConstructor = LeaguePlugin.build;
export { league as League };
export { LeaguePlugin };
export { LeaguePluginOptions, Region } from './types';
export default league;
