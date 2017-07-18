/**
 * All sort of meta data, mostly current version numbers.
 */
export type Realms = {
	/**
	 * Legacy script mode
	 * unnecessary
	 */
	lg: string,
	/**
	 * Latest change of dragon magic
	 * unnecessary
	 */
	dd: string,
	/**
	 * Default language for this realm
	 * unnecessary
	 */
	l: string,
	/**
	 * Latest changed version of each data type
	 */
	n: {
		/**
		 * Current summoner version
		 */
		summoner: string,
		/**
		 * Current map version
		 * unnecessary
		 */
		map: string,
		/**
		 * Current champion version
		 */
		champion: string,
		/**
		 * Current language verion
		 * unnecessary
		 */
		language: string,
		/**
		 * Current mastery version
		 * unnecessary
		 */
		mastery: string,
		/**
		 * Current sticker version
		 * unnecessary
		 */
		sticker: string,
		/**
		 * Current item verion
		 * unnecessary
		 */
		item: string,
		/**
		 * Current rune verions
		 * unnecessary
		 */
		rune: string,
		/**
		 * Current profile icon version
		 */
		profileicon: string,
	},
	/**
	 * Max profile icon number below 500
	 * unnecessary
	 */
	profileiconmax: number,
	/**
	 * Curret realm version
	 */
	v: string,
	/**
	 * Base cdn url
	 */
	cdn: string,
	/**
	 * Latest version of dragon magic's css file
	 * unnecessary
	 */
	css: string,
};
