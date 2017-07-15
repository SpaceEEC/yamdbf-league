import { Constants } from '../Constants';
import { RiotAPI } from '../RiotAPI';
import { MasteryData, Region, SummonerData } from '../types';
import { ChampionMastery } from './ChampionMastery';

const { profileIconURL, oneMastery, allMasteries, totalMasteryLevel } = Constants;

/**
 * Represents a League of Legends summoner
 */
export class Summoner
{
	/**
	 * Account id of this summoner
	 * @readonly
	 */
	public readonly accountdId: number;
	/**
	 * Id of this summoner
	 * @readonly
	 */
	public readonly id: number;
	/**
	 * Name of this summoner
	 * @readonly
	 */
	public readonly name: string;
	/**
	 * Profile icon id of this summoner
	 * (See also get profileIconURL)
	 * @readonly
	 */
	public readonly profileIconId: number;
	/**
	 * Summoner level of this summoner
	 * @readonly
	 */
	public readonly level: number;
	/**
	 * Timestamp of the last update of this summoner
	 * @readonly
	 */
	public readonly updatedTimestamp: number;

	/**
	 * Total mastery level of this summoner
	 */
	public masteryLevel: number;
	/**
	 * Champion masteries of this summoner
	 * @readonly
	 */
	public readonly masteries: ChampionMastery[] = [];

	/**
	 * The region this summoner belongs to
	 * @readonly
	 */
	public readonly region: Region;

	/**
	 * Reference to the RiotAPI class' instance
	 * @private
	 * @readonly
	 */
	private readonly _api: RiotAPI;

	/**
	 * Instantiates a new Summoner.
	 * @param {RiotAPI} api
	 * @param {Region} region
	 * @param {SummonerData} data
	 */
	public constructor(api: RiotAPI, region: Region, data: SummonerData)
	{
		this._api = api;
		this.region = region;

		this.accountdId = data.accountId;
		this.id = data.id;
		this.name = data.name;
		this.profileIconId = data.profileIconId;
		this.level = data.summonerLevel;
		this.updatedTimestamp = data.revisionDate;
	}

	/**
	 * Initiates this summoner by fetching additional data, such as champion masteries and mastery level.
	 * @returns {Promise<void>}
	 */
	public async init(): Promise<void>
	{
		const [masteryLevel, masteries]: [number, MasteryData[]] = await Promise.all([
			this._api.request<number>(totalMasteryLevel(this.region, this.id)),
			this._api.request<MasteryData[]>(allMasteries(this.region, this.id)),
		]);

		this.masteryLevel = masteryLevel;
		for (const mastery of masteries)
		{
			this.masteries.push(new ChampionMastery(this._api, this, mastery));
		}
	}

	/**
	 * Gets or fetches the requested champion's mastery info.
	 * @param {number} id champion id
	 * @returns {Promise<ChampionMastery>}
	 */
	public async getChampionMastery(id: number): Promise<ChampionMastery>
	{
		let mastery: ChampionMastery = this.masteries.find((_mastery: ChampionMastery) => _mastery.id === id);
		if (mastery)
		{
			this._api.logger.debug('LeaguePlugin', `From cache: "${this.region}-${this.name}: ${mastery.name}"`);
			return Promise.resolve(mastery);
		}

		const data: MasteryData = await this._api.request<MasteryData>(oneMastery(this.region, this.id, id));
		mastery = new ChampionMastery(this._api, this, data);

		this.masteries.push(mastery);
		this.masteries.sort((a: ChampionMastery, b: ChampionMastery) => a.points - b.points);

		this._api.logger.debug('LeaguePlugin', `Cached: "${this.region}-${this.name}: ${mastery.name}"`);
		return mastery;
	}

	/**
	 * Gets the requested page
	 * @param {number} page
	 * @returns {object}
	 */
	public page(page: number): { masteries: ChampionMastery[], maxPages: number, page: number }
	{
		const maxPages: number = Math.ceil(this.masteries.length / 10);
		if (page < 1) page = 1;
		if (page > maxPages) page = maxPages;
		const startIndex: number = (page - 1) * 10;
		return {
			masteries: this.masteries.slice(startIndex, startIndex + 10),
			maxPages,
			page,
		};
	}

	/**
	 * The url pointing to the icon of this summoner
	 * @readonly
	 */
	public get profileIconURL(): string
	{
		return this.profileIconId
			? profileIconURL(this.profileIconId)
			: null;
	}

	/**
	 * Date object of the last update of this summoner
	 * @readonly
	 */
	public get updatedAt(): Date
	{
		return new Date(this.updatedTimestamp);
	}
}
