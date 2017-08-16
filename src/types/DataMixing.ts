export type DataMixing<T> =
	{
		/**
		 * ID of this resource
		 */
		id: T,
		/**
		 * Key of this resource
		 */
		key: string,
		/**
		 * Name of this resource
		 */
		name: string,
		/**
		 * Image data of this resource
		 */
		image: {
			/**
			 * Full image file name
			 */
			full: string,
			/**
			 * The group this kind of data belongs to
			 */
			group: string,
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
