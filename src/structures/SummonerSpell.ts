import { Constants } from '../Constants';
import { SummonerSpellData } from '../types/SummonerSpellData';

const { summonerSpellIconURL } = Constants;

/**
 * Represents a summoner spell
 */
export class SummonerSpell
{
	/**
	 * The name of this summoner spell
	 * @readonly
	 */
	public readonly name: string;
	/**
	 * Image data of this summoner spell
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
	 * Key of this summoner spell
	 * (Full image name without extension?)
	 */
	public readonly key: string;
	/**
	 * The required summoner level
	 */
	public readonly summonerLevel: number;
	/**
	 * The ID of this summoner spell
	 */
	public readonly id: number;
	/**
	 * Small text describing this summoner spell
	 */
	public readonly description: string;

	/**
	 * Istantiates a new summoner spell
	 * @param {SummonerSpellData} data
	 */
	public constructor(data: SummonerSpellData)
	{
		this.description = data.description;
		this.id = Number(data.key);
		this.image = data.image;
		this.key = data.id;
		this.name = data.name;
		this.summonerLevel = data.summonerLevel;
	}

	/**
	 * Generates the url pointing to this summoner spell
	 * @readonly
	 */
	public get iconURL(): string
	{
		return summonerSpellIconURL(this.image.full);
	}
}
