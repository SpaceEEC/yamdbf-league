import { Collection } from 'discord.js';
import { get, Result } from 'snekfetch';
import { Logger, logger } from 'yamdbf';

import { Constants } from './Constants';
import { Champion } from './structures/Champion';
import { CurrentGame } from './structures/CurrentGame';
import { Summoner } from './structures/Summoner';
import { SummonerSpell } from './structures/SummonerSpell';
import {
	BundledData,
	ChampionData,
	LeaguePluginOptions,
	Realms,
	Region,
	SummonerData,
	// SummonerSpellData,
} from './types';

const { version }: { version: string} = require('../package.json');

const { championDataSource, summonerByName, realmsSource/*, summonerSpellDataSource*/ } = Constants;

/**
 * RiotAPI class which handles caching and requests to the riot api
 */
export class RiotAPI
{
	/**
	 * Collection of all available champs
	 * keyed under their internal ids
	 * @readonly
	 */
	public readonly champions: Collection<number, Champion> = new Collection<number, Champion>();
	/**
	 * Collection of summoner spells
	 * keyed under their ids
	 * @readonly
	 */
	// public readonly summonerSpells: Collection<number, SummonerSpell> = new Collection<number, SummonerSpell>();
	/**
	 * Options passed with the league plugin
	 */
	public readonly options: LeaguePluginOptions;

	/**
	 * Reference to the logger singleton
	 * @readonly
	 */
	@logger public readonly logger: Logger;

	/**
	 * Riot API token
	 * @private
	 * @readonly
	 */
	private readonly _token: string;

	/**
	 * Instantiates a new instance of the RiotAPI class
	 * @param {string} token
	 */
	public constructor(token: string, options: LeaguePluginOptions)
	{
		this._token = token;
		this.options = options;
	}

	/**
	 * Initiates the RiotAPI class.
	 * @returns {Promise<void>}
	 */
	public async init(): Promise<void>
	{
		Constants.realms = await this.request<Realms>(realmsSource(this.options.defaultRegion));
		this.logger.debug('LeaguePlugin', 'Using realm version', Constants.realms.v);

		const { data: championData }: BundledData<ChampionData> =
			await this.request<BundledData<ChampionData>>(championDataSource());
		for (const champion of Object.values<ChampionData>(championData))
		{
			const id: number = Number(champion.key);
			if (isNaN(id)) continue;
			this.champions.set(id, new Champion(champion));
		}

		// currently not being used
		/*const { data: summonerSpellData }: BundledData<SummonerSpellData> = await
			this.request<BundledData<SummonerSpellData>>(summonerSpellDataSource(this.options.defaultRegion));
		for (const summonerSpell of Object.values(summonerSpellData))
		{
			const id: number = Number(summonerSpell.key);
			if (isNaN(id)) continue;
			this.summonerSpells.set(id, new SummonerSpell(summonerSpell));
		}*/

		this.logger.info('LeaguePlugin', 'Champions successfully cached.');
	}

	/**
	 * Fetches a summoner by name.
	 * @param {string} name
	 * @returns {Promise<?Summoner>}
	 */
	public async getSummoner(region: Region, query: string): Promise<Summoner>
	{
		// I might run into duplicates if riot normalizes their queries differently or something
		if (Summoner.cache.has(`${region}-${query.toLowerCase()}`))
		{
			this.logger.debug('LeaguePlugin', `Summoner from cache: "${region}-${query.toLowerCase()}"`);
			return Summoner.cache.get(`${region}-${query.toLowerCase()}`);
		}

		const data: SummonerData = await this.request<SummonerData>(summonerByName(region, query))
			.catch((error: any) =>
			{
				if (error.status === 404) return null;
				throw error;
			});
		if (!data) return null;

		const summoner: Summoner = new Summoner(this, region, data);
		Summoner.cache.set(`${region}-${query.toLowerCase()}`, summoner);
		this.logger.debug(
			'LeaguePlugin',
			`Cached summoner "${region}-${query.toLowerCase()}"; New cache count is: ${Summoner.cache.size.toString()}`,
		);

		if (Summoner.cache.size > this.options.maxCacheSize)
		{
			Summoner.cache.delete(Summoner.cache.firstKey());
			this.logger.debug('LeaguePlugin', 'Removed oldest entry from cache summoner.');
		}

		return summoner;
	}

	/**
	 * Makes a request to the desired url and sets the X-Riot-Token header.
	 * Resolves with the received body.
	 * @param {string} url
	 * @returns {Promise<T>}
	 */
	public request<T = any>(url: string): Promise<T>
	{
		this.logger.debug('LeagePlugin', 'Requesting', url);
		return get(url)
			.set('X-Riot-Token', this._token)
			.set('User-Agent', `YAMDBF-League v${version} (https://github.com/SpaceEEC/yamdbf-league)`)
			.then<any>((res: Result) => res.body);
	}
}
