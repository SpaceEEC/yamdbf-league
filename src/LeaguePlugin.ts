import { Util } from 'discord.js';
import { join } from 'path';
import { inspect } from 'util';
import { Client, IPlugin, Lang, Logger, Plugin, PluginConstructor } from 'yamdbf';

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
	 * Name of this plugin
	 * @readonly
	 */
	public readonly name: string = 'League';
	/**
	 * Reference to the RiotAPI class instance
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
	 * Initializes this plugin
	 * @returns {Promise<void>}
	 */
	public async init(): Promise<void>
	{
		await this.api.init();

		Lang.loadCommandLocalizationsFrom(join(__dirname, 'localization'));
		Lang.loadLocalizationsFrom(join(__dirname, 'localization'));

		this.client.commands.registerExternal(new LeagueCommand(this));
	}
}
