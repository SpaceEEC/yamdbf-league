import { Constants } from '../Constants';
import { RiotAPI } from '../RiotAPI';
import { MasteryData } from '../types';
import { Summoner } from './Summoner';

/**
 * Represents a champion mastery
 */
export class ChampionMastery
{
	/**
	 * Champion id
	 * @readonly
	 */
	public readonly id: number;
	/**
	 * Champion level
	 * @readonly
	 */
	public readonly level: number;
	/**
	 * Total mastery points this champion has
	 * @readonly
	 */
	public readonly points: number;
	/**
	 * Points earned since the last level
	 * @readonly
	 */
	public readonly pointsSinceLestLevel: number;
	/**
	 * Points needed to earn the next level
	 * @readonly
	 */
	public readonly pointsUntilNextLevel: number;
	/**
	 * Whether the champion has been granted the chest already for this season
	 * @readonly
	 */
	public readonly chestGranted: boolean;
	/**
	 * When the champ this mastery belongs was last played as a timestamp
	 * @readonly
	 */
	public readonly lastPlayedTimestamp: number;
	/**
	 * How much tokens currently have been earned
	 * @readonly
	 */
	public readonly tokensEarned: number;

	/**
	 * Reference to the summoner this mastery belongs to
	 * @readonly
	 */
	public readonly summoner: Summoner;
	/**
	 * Reference to the RiotAPI class' instance
	 * @private
	 * @readonly
	 */
	private readonly _api: RiotAPI;

	/**
	 * Instantiates a new Mastery class.
	 * @param {RiotAPI} api
	 * @param {Summoner} summoner
	 * @param {MasteryData} data
	 */
	public constructor(api: RiotAPI, summoner: Summoner, {
		championId,
		championLevel,
		championPoints,
		championPointsSinceLastLevel,
		championPointsUntilNextLevel,
		chestGranted,
		lastPlayTime,
		tokensEarned }: MasteryData)
	{
		this._api = api;
		this.summoner = summoner;

		this.id = championId;
		this.level = championLevel;
		this.points = championPoints;
		this.pointsSinceLestLevel = championPointsSinceLastLevel;
		this.pointsUntilNextLevel = championPointsUntilNextLevel;
		this.chestGranted = chestGranted;
		this.lastPlayedTimestamp = lastPlayTime;
		this.tokensEarned = tokensEarned;
	}

	/**
	 * Name of the champion
	 * @readonly
	 */
	public get name(): string
	{
		return this._api.champs.get(this.id).name;
	}
	/**
	 * Title of the champion
	 * @readonly
	 */
	public get title(): string
	{
		return this._api.champs.get(this.id).title;
	}

	/**
	 * When the champ this mastery belongs was last played as a Date object
	 * @readonly
	 */
	public get lastPlayedAt(): Date
	{
		return new Date(this.lastPlayedTimestamp);
	}

	/**
	 * URL pointing to the icon of the champion this mastery belongs to
	 * @readonly
	 */
	public get iconURL(): string
	{
		return Constants.championIconURL(this._api.champs.get(this.id).image.full);
	}

	/**
	 * Champion level either as emoji or null
	 * @readonly
	 */
	public get levelEmoji(): string
	{
		if (!this._api.options.emojis) return null;

		let level: string;
		switch (this.level)
		{
			case 4:
				level = this._api.options.emojis.level4;
				break;
			case 5:
				level = this._api.options.emojis.level5;
				break;
			case 6:
				level = this._api.options.emojis.level6;
				break;
			case 7:
				level = this._api.options.emojis.level7;
				break;
		}

		return level || null;
	}
}
