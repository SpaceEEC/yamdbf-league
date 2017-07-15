import { Region } from './';

/**
 * LeaguePluginOptions to customize certain things.
 */
export type LeaguePluginOptions = {
	/**
	 * Optional emoji strings to use custom emoji badges instead of raw strings
	 */
	emojis?: {
		level4?: string,
		level5?: string,
		level6?: string,
		level7?: string,
	},
	/**
	 * Region where to default requests without specified region to
	 * Defaults to `Region.EUW` / `euw1`
	 */
	defaultRegion?: Region,
	/**
	 * Max amounts of summoners to cache across all regions
	 * Defaults to `100`
	 */
	maxCacheSize?: number,
};
