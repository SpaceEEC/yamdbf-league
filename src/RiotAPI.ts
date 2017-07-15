import { Collection } from 'discord.js';
import { get, Result } from 'snekfetch';
import { Logger, logger } from 'yamdbf';

import { Constants } from './Constants';
import { Summoner } from './structures/Summoner';
import { Champion, Champions, LeaguePluginOptions, Realms, Region, SummonerData } from './types';

const { championDataSource, summonerByName, realmsSource } = Constants;

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
	public readonly champs: Collection<number, Champion> = new Collection<number, Champion>();
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
	 * Cache of already fetched summoners
	 * keyed as "region-queryname"
	 * @private
	 * @readonly
	 */
	private readonly _cache: Collection<string, Summoner> = new Collection<string, Summoner>();

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

		const { data }: Champions = await this.request<Champions>(championDataSource(this.options.defaultRegion));
		for (const champion of Object.values<Champion>(data))
		{
			this.champs.set(champion.id, champion);
		}

		this.logger.info('LeaguePlugin', 'Champions successfully cached for region:', this.options.defaultRegion);
	}

	/**
	 * Fetches a summoner by name.
	 * @param {string} name
	 * @returns {Promise<?Summoner>}
	 */
	public async getSummoner(region: Region, query: string): Promise<Summoner>
	{
		// I might run into duplicates if riot normalizes their queries differently or something
		if (this._cache.has(`${region}-${query.toLowerCase()}`))
		{
			this.logger.debug('LeaguePlugin', `From cache: "${region}-${query.toLowerCase()}"`);
			return Promise.resolve(this._cache.get(`${region}-${query.toLowerCase()}`));
		}

		const data: SummonerData = await this.request<SummonerData>(summonerByName(region, query))
			.catch((error: any) =>
			{
				if (error.status === 404) return null;
				throw error;
			});
		if (!data) return null;
		const summoner: Summoner = new Summoner(this, region, data);
		await summoner.init();

		this._cache.set(`${region}-${query.toLowerCase()}`, summoner);
		this.logger.debug(
			'LeaguePlugin',
			`Cached "${region}-${query.toLowerCase()}"; New cache count is: ${this._cache.size.toString()}`,
		);

		if (this._cache.size > this.options.maxCacheSize)
		{
			this._cache.delete(this._cache.firstKey());
			this.logger.debug('LeaguePlugin', 'Removing oldest entry from cache.');
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
			.then<any>((res: Result) => res.body);
	}
}
