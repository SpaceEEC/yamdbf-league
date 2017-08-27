import { Collection } from 'discord.js';
import { Logger, logger } from 'yamdbf';

import { Constants } from '../Constants';
import { RiotAPI } from '../RiotAPI';
import { CurrentGameInfo, MasteryData, Region, SummonerData } from '../types';
import { BaseSummoner } from './BaseSummoner';
import { ChampionMastery } from './ChampionMastery';
import { CurrentGame } from './CurrentGame';
import { GameParticipant } from './GameParticipant';

const { masteryByChampionId, allMasteriesBySummonerId, totalMasteryLevelById, currentGameBySummonerId } = Constants;

/**
 * Represents a League of Legends summoner
 */
export class Summoner extends BaseSummoner
{
	/**
	 * Account id of this summoner
	 * @readonly
	 */
	public readonly accountdId: number;
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
	 * Whether champion mastery data has already been fetched for this summoner
	 */
	public isMasteryDataFetched: boolean = false;

	/**
	 * Reference to the logger singleton instance
	 * @private
	 * @readonly
	 */
	@logger private readonly logger: Logger;
	/**
	 * ID of the current game this Summoner participates in
	 * @readonly
	 * @private
	 */
	private _currentGame: number;

	/**
	 * Instantiates a new Summoner.
	 * @param {RiotAPI} api
	 * @param {Region} region
	 * @param {SummonerData} data
	 */
	public constructor(api: RiotAPI, region: Region, data: SummonerData)
	{
		super(api, data);

		this.region = region;

		this.accountdId = data.accountId;
		this.level = data.summonerLevel;
		this.updatedTimestamp = data.revisionDate;
	}

	/**
	 * Fetches all champion data of this champion.
	 * @returns {Promise<void>}
	 */
	public async fetchAllChampionMasteryData(): Promise<void>
	{
		const [masteryLevel, masteries]: [number, MasteryData[]] = await Promise.all([
			this.api.request<number>(totalMasteryLevelById(this.region, this.id)),
			this.api.request<MasteryData[]>(allMasteriesBySummonerId(this.region, this.id)),
		]);

		this.masteryLevel = masteryLevel;
		for (const mastery of masteries)
		{
			this.masteries.push(new ChampionMastery(this.api, this, mastery));
		}

		this.isMasteryDataFetched = true;
	}

	/**
	 * Gets or fetches the requested champion's mastery info.
	 * @param {number} id champion id
	 * @returns {Promise<?ChampionMastery>}
	 */
	public async fetchChampionMastery(id: number): Promise<ChampionMastery>
	{
		let mastery: ChampionMastery = this.masteries.find((_mastery: ChampionMastery) => _mastery.champion.id === id);
		if (mastery)
		{
			this.logger.debug('LeaguePlugin', `Champion mastery from cache: "${this.region}-${this.name}: ${mastery.name}"`);
			return mastery;
		}

		const data: MasteryData = await this.api.request<MasteryData>(masteryByChampionId(this.region, this.id, id))
			.catch((error: any) =>
			{
				if (error.status === 404) return null;
				throw error;
			});
		if (!data) return null;

		mastery = new ChampionMastery(this.api, this, data);

		this.masteries.push(mastery);
		this.masteries.sort((a: ChampionMastery, b: ChampionMastery) => a.points - b.points);

		this.logger.debug('LeaguePlugin', `Cached champion mastery: "${this.region}-${this.name}: ${mastery.name}"`);
		return mastery;
	}

	/**
	 * Gets or fetches the currently played game info of this summoner.
	 * Is null when the summoner is not currently in a game.
	 * @returns {Promise<?CurrentGame>}
	 */
	public async fetchCurrentGame(): Promise<CurrentGame>
	{
		let currentGame: CurrentGame;
		if (this._currentGame)
		{
			currentGame = this.api.currentGames.get(this._currentGame);
			if (currentGame)
			{
				this.logger.debug('LeaguePlugin',
					`Current game from cache "${this.region}-${this.name}: ${currentGame.mapName}`);
				return currentGame;
			}
			this._currentGame = null;
		}
		else
		{
			for (const game of this.api.currentGames.values())
			{
				for (const participant of game.participants)
				{
					if (participant.id === this.id)
					{
						this._currentGame = game.id;
						this.logger.debug('LeaguePlugin',
							`Current game from cache "${this.region}-${this.name}: ${currentGame.mapName}`);
						return currentGame;
					}
				}
			}
		}

		const data: CurrentGameInfo = await this.api.request<CurrentGameInfo>(currentGameBySummonerId(this.region, this.id))
			.catch((error: any) =>
			{
				if (error.status === 404) return null;
				throw error;
			});
		if (!data) return null;

		currentGame = new CurrentGame(this.api, data);
		this.api.currentGames.set(currentGame.id, currentGame);
		this._currentGame = currentGame.id;
		// Delete from cache after 5 minutes
		setTimeout(() => this.api.currentGames.delete(currentGame.id), 3e5);

		return currentGame;
	}

	/**
	 * Gets the requested page of champion masteries
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
	 * Date object of the last update of this summoner
	 * @readonly
	 */
	public get updatedAt(): Date
	{
		return new Date(this.updatedTimestamp);
	}
}
