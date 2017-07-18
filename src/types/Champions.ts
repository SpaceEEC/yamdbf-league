import { Champion } from './';
/**
 * Champions object returned from the Riot API
 */
export type Champions = {
	/**
	 * The type of this request's response
	 */
	type: 'champion',
	/**
	 * Champion data version
	 */
	version: string,
	/**
	 * K/V data object holding the champion data
	 */
	data: {
		[id: number]: Champion,
	},
};
