import { Util } from 'discord.js';
import { inspect } from 'util';
import { Client, IPlugin, Logger, Plugin, PluginConstructor } from 'yamdbf';

import { LeagueCommand } from './commands/league';
import { RiotAPI } from './RiotAPI';
import { LeaguePluginOptions, Region } from './types';

/**
 * LeaguePlugin that allows users to easily see their and other champion masteries.
 */
export class LeaguePlugin extends Plugin implements IPlugin
{
	/**
	 * Static build method to pass token and options to the LeagePlugin
	 * @param {string} token Riot API token
	 * @param {LeaguePluginOptions} [options] See README or TS type for more info
	 * @returns {PluginConstructor} Pass this to the clientoption's plugins array
	 */
	public static build(token: string, options: LeaguePluginOptions = {}): PluginConstructor
	{
		options = Util.mergeDefault({
			defaultRegion: Region.EUW,
			maxCacheSize: 100,
		}, options);
		// tslint:disable-next-line:max-classes-per-file
		return class extends LeaguePlugin
		{
			public constructor(client: Client)
			{
				super(client, token, options);
			}
		};
	}

	/**
	 * This' name plugin
	 * @readonly
	 */
	public readonly name: string = 'League';
	/**
	 * Reference to RiotAPI class instance
	 * @readonly
	 */
	public readonly api: RiotAPI;
	/**
	 * Reference to the client
	 * @readonly
	 */
	public readonly client: Client;

	/**
	 * Instantiates this plugin
	 * @param {Client} client
	 * @param {string} token
	 * @param {LeaguePluginOptions} options
	 * @protected
	 */
	protected constructor(client: Client, token: string, options: LeaguePluginOptions)
	{
		super();

		this.api = new RiotAPI(token, options);
		this.client = client;
	}

	/**
	 * Initiates this plugin
	 * @returns {Promise<void>}
	 */
	public async init(): Promise<void>
	{
		try
		{
			await this.api.init();

			this.client.commands.registerExternal(this.client, new LeagueCommand(this));
		}
		catch (error)
		{
			Logger.instance().error('LeaguePlugin', 'Initiating failed:', inspect(error, true, Infinity, true));
		}
	}
}
