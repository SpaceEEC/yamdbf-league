/**
 * Bundled data returned from the Riot API
 */
export type BundledData<T> = {
	/**
	 * The type of this request's response
	 */
	type: string,
	/**
	 * Format of this bundled data
	 */
	format?: string,
	/**
	 * Version of this bundled data
	 */
	version: string,
	/**
	 * K/V data object holding the requested data
	 */
	data: {
		[key: string]: T,
	},
};
