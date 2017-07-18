import { Region } from './';

/**
 * LeaguePluginOptions to customize certain things.
 */
export type LeaguePluginOptions = {
	/**
	 * Optional strings to replace `Level n`, thought to be used for custom emojis
	 */
	emojis?: {
		/**
		 * The text that will replace `Level 4`
		 */
		level4?: string,
		/**
		 * The text that will replace `Level 5`
		 */
		level5?: string,
		/**
		 * The text that will replace `Level 6`
		 */
		level6?: string,
		/**
		 * The text that will replace `Level 7`
		 */
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
