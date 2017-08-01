/**
 * Champion returned as part of Champions data from the Riot API
 */
export type Champion = {
	/**
	 * Game version, this champion data is for
	 */
	version: string,
	/**
	 * Internal Name
	 */
	id: string,
	/**
	 * Actual ID
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
	 * Blurb of this champion, generic text.
	 * With html tags, because riot can.
	 */
	blurb: string,
	info: {
		attack: number,
		defense: number,
		magic: number,
		difficutly: number,
	}
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
	/**
	 * Array of tags
	 * ex. "Figther", "Tank", etc
	 */
	tags: string[],
	/**
	 * The partype
	 * ex. "Mana"
	 */
	partype: string,
	/**
	 * Be warned, no proper casing inbound.
	 */
	stats: {
		hp: number,
		hpperlevel: number,
		mp: number,
		mpperlevel: number,
		movespeed: number,
		armor: number,
		spellblock: number,
		spellblockperlevel: number,
		attackrange: number,
		hpregen: number,
		hpregenperlevel: number,
		mpregen: number,
		mprgenperlevel: number,
		crit: number,
		critperlevel: number,
		attackdamage: number,
		attackdamageperlevel: number,
		attackspeedoffset: number,
		attackspeedperlevel: number,
	},
};
