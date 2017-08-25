import { Constants } from '../Constants';
import { RiotAPI } from '../RiotAPI';
import { ChampionData } from '../types/ChampionData';

/**
 * Champion class to provide additional functionality
 */
export class Champion
{
	/**
	 * Blurb of this champion, generic text.
	 * With html tags, because riot can.
	 * @readonly
	 */
	public readonly blurb: string;
	/**
	 * The ID of this champion
	 * @readonly
	 */
	public readonly id: number;
	/**
	 * Image data
	 * @readonly
	 */
	public readonly image: {
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
	};
	/**
	 * Generic info about this champion
	 * @readonly
	 */
	public readonly info: {
		attack: number,
		defense: number,
		magic: number,
		difficulty: number,
	};
	/**
	 * Internally used name for this champion
	 * @readonly
	 */
	public readonly internalName: string;
	/**
	 * The name of this champion
	 * @readonly
	 */
	public readonly name: string;
	/**
	 * The partype
	 * ex. 'Mana'
	 * @readonly
	 */
	public readonly partype: string;
	/**
	 * Riot is apparently not really a fan of proper casing
	 * @readonly
	 */
	public readonly stats: {
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
	};
	/**
	 * Array of tags
	 * ex. 'Fighter', 'Tank', etc
	 * @readonly
	 */
	public readonly tags: string[];
	/**
	 * The title text of this champion
	 * @readonly
	 */
	public readonly title: string;
	/**
	 * Game version this champion data is for
	 * @readonly
	 */
	public readonly version: string;

	/**
	 * Reference to riot api class
	 * @private
	 * @readonly
	 */
	private readonly _api: RiotAPI;

	/**
	 * Instantiates a new champion
	 * @param {ChampionData} data
	 */
	public constructor(data: ChampionData)
	{
		this.blurb = data.blurb;
		// yes
		this.id = Number(data.key);
		this.image = data.image;
		this.info = data.info;
		// yes
		this.internalName = data.id;
		this.name = data.name;
		this.partype = data.partype;
		this.stats = data.stats;
		this.tags = data.tags;
		this.title = data.title;
		this.version = data.version;
	}

	/**
	 * URL pointing to the icon of the champion this mastery belongs to
	 * @readonly
	 */
	public get IconURL(): string
	{
		return Constants.championIconURL(this.image.full);
	}
}
