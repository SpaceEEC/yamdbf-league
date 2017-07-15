import { Util } from 'discord.js';
import { Client, IPlugin, Plugin, PluginConstructor } from 'yamdbf';

import { LeagueCommand } from './commands/league';
import { RiotAPI } from './RiotAPI';
import { LeaguePluginOptions, Region } from './types';

export class LeaguePlugin extends Plugin implements IPlugin
{
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

	public readonly name: string = 'League';
	public readonly api: RiotAPI;
	public readonly client: Client;

	public constructor(client: Client, token: string, options: LeaguePluginOptions)
	{
		super();

		this.api = new RiotAPI(token, options);
		this.client = client;
	}

	public async init(): Promise<void>
	{
		await this.api.init();

		this.client.commands.registerExternal(this.client, new LeagueCommand(this));
	}
}
