/**
 * Champion returned as part of Champions data from the Riot API
 */
export type Champion = {
	/**
	 * Actual ID
	 */
	id: number,
	/**
	 * Internal Name
	 */
	key: string,
	/**
	 * External name
	 * The name used in the client etc
	 */
	name: string,
	/**
	 * Title text of this champion
	 */
	title: string,
	/**
	 * Image data
	 */
	image: {
		/**
		 * Full image file name
		 */
		full: string,
		/**
		 * The group this kind of data belongs to
		 */
		group: 'champion',
		/**
		 * Full sprite file name
		 */
		sprite: string,
		h: number,
		w: number,
		y: number,
		x: number,
	},
};
