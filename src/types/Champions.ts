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
	 * Form of this champion's collection
	 */
	format: 'standAloneComplex'
	/**
	 * Champion data version
	 */
	version: string,
	/**
	 * K/V data object holding the champion data
	 */
	data: {
		[internalName: string]: Champion,
	},
};
