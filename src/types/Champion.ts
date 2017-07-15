export type Champion = {
	version: string,
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
	title: string,
	image: {
		full: string,
		group: string,
		sprite: string,
		h: number,
		w: number,
		y: number,
		x: number,
	},
};
