import { RichEmbed } from 'discord.js';
import { Command, CommandDecorators, Message, Middleware, ResourceLoader, Time, Util } from 'yamdbf';

import { Constants } from '../Constants';
import { LeaguePlugin } from '../LeaguePlugin';
import { LocalizationStrings as S } from '../localization/LocalizationStrings';
import { Champion } from '../structures/Champion';
import { CurrentGame } from '../structures/CurrentGame';
import { Summoner } from '../structures/Summoner';
import { Region } from '../types';

const { mapIconURL } = Constants;

const {
	aliases,
	clientPermissions,
	desc,
	name,
	group,
	guildOnly,
	usage,
	localizable,
	using,
} = CommandDecorators;
const { expect, resolve } = Middleware;

@aliases('leagueGame', 'lolGame', 'lol-game', 'lollive', 'lol-live', 'leagueLive', 'league-live')
@clientPermissions('SEND_MESSAGES', 'EMBED_LINKS')
@desc('Displays the current game of a summoner')
@name('league-game')
@group('league')
@guildOnly
@usage('<prefix>league-game [Region] <Summoner>')
export class LeagueGameCommand extends Command
{
	private readonly plugin: LeaguePlugin;

	public constructor(plugin: LeaguePlugin)
	{
		super();
		this.plugin = plugin;
	}

	// tslint:disable:only-arrow-functions no-shadowed-variable object-literal-sort-keys
	@using(expect({ '<Summoner>': 'String' }))
	@localizable
	@using(async function(
		this: LeagueGameCommand,
		message: Message,
		[res, first, second]: [ResourceLoader, string, string],
	): Promise<[Message, [ResourceLoader, CurrentGame]]>
	{
		let region: string = this.plugin.api.options.defaultRegion;
		if (second)
		{
			region = Region[first.toUpperCase() as any];
			if (!region)
			{
				if (!Object.values(Region).includes(first.toLowerCase()))
				{
					throw new Error(
						res(S.EXPECT_ERR_INVALID_OPTION,
							{
								name: '<Region>',
								arg: first,
								usage: this.usage,
								type: Object.keys(Region).map((key: string) => `\`${key}\``).join(', '),
							},
						),
					);
				}

				region = first.toLowerCase();
			}
		}

		const summoner: Summoner = await this.plugin.api.getSummoner(region as Region, second || first);
		if (!summoner)
		{
			throw new Error(res(S.PLUGIN_LEAGUE_NO_SUMMONER_FOUND));
		}

		const currentGame: CurrentGame = await summoner.getCurrentGame();
		if (!currentGame)
		{
			throw res(S.PLUGIN_LEAGUE_SUMMONER_NOT_INGAME);
		}

		return [message, [res, currentGame]];
	})
	// tslint:enable:only-arrow-functions no-shadowed-variable object-literal-sort-keys
	public async action(message: Message, [res, currentGame]: [ResourceLoader, CurrentGame]): Promise<void>
	{
		let blueNameLength: number = 0;
		let redNameLength: number = 0;
		for (const { champion: { name: championName }, teamId } of currentGame.participants)
		{
			if (teamId === 100)
			{
				if (blueNameLength < championName.length)
				{
					blueNameLength = championName.length;
				}
			}
			else if (redNameLength < championName.length)
			{
				redNameLength = championName.length;
			}
		}

		const blueParticipants: string[] = [];
		const redParticipants: string[] = [];
		for (const { name: summonerName, champion: { name: championName }, teamId } of currentGame.participants)
		{
			let target: string[];
			let paddedString: string;

			if (teamId === 100)
			{
				target = blueParticipants;
				paddedString = Util.padRight(championName, blueNameLength);
			}
			else
			{
				target = redParticipants;
				paddedString = Util.padRight(championName, redNameLength);
			}

			const participantString: string = `\`${target.length + 1}. ${paddedString}\u200b\` ${summonerName}`;

			target.push(participantString);
		}

		const blueBans: string[] = [];
		const redBans: string[] = [];
		if (currentGame.bannedChampions.length)
		{
			let team1BanStringLength: number = 0;
			let team2BanStringLength: number = 0;
			for (const { champion: { name: championName }, teamId } of currentGame.bannedChampions)
			{

				if (teamId === 100)
				{
					if (team1BanStringLength < championName.length) team1BanStringLength = championName.length;
				}
				else
				{
					if (team2BanStringLength < championName.length) team2BanStringLength = championName.length;
				}
			}

			for (const { teamId, champion: { name: championName }, pickTurn } of currentGame.bannedChampions)
			{
				let target: string[];
				let paddedString: string;
				if (teamId === 100)
				{
					target = blueBans;
					paddedString = Util.padRight(championName, team1BanStringLength);
				}
				else
				{
					target = redBans;
					paddedString = Util.padRight(championName, team2BanStringLength);
				}

				const banString: string = `\`${target.length + 1} ${paddedString}\u200b\``;

				target.push(banString);
			}

		}

		const embed: RichEmbed = new RichEmbed()
			.setThumbnail(mapIconURL(currentGame.mapId))
			.setTitle(`${currentGame.mapName} - ${currentGame.gameMode}`)
			.setDescription(`**${this._formatDuration(currentGame.gameLength)}**`)
			.addField(res(S.PLUGIN_LEAGUE_PICKS_BLUE), blueParticipants.join('\n'), true)
			.setFooter(res(S.PLUGIN_LEAGUE_EMBED_GENERATED_AT))
			.setTimestamp();

		if (blueBans.length || redBans.length)
		{
			embed.addField(res(S.PLUGIN_LEAGUE_BANS_BLUE),
				blueBans.join('\n') || res(S.PLUGIN_LEAGUE_NO_CHAMPIONS_BANNED), true)
				.addField(res(S.PLUGIN_LEAGUE_PICKS_RED),
				redParticipants.join('\n') || '\u200b', true)
				.addField(res(S.PLUGIN_LEAGUE_BANS_RED),
				redBans.join('\n') || res(S.PLUGIN_LEAGUE_NO_CHAMPIONS_BANNED), true);
		}
		else
		{
			embed.addField(res(S.PLUGIN_LEAGUE_PICKS_RED), redParticipants.join('\n'), true);
		}

		return message.channel.send({ embed })
			.then(() => undefined);
	}

	private _formatDuration(seconds: number): string
	{
		const hours: number = Math.floor(seconds / 3600);
		const minutes: number = Math.floor(seconds % 3600 / 60);

		return [
			hours ? `${hours}:` : '',
			`${hours ? `0${minutes}`.slice(-2) : minutes}:`,
			`0${Math.floor(seconds % 60)}`.slice(-2),
		].join('');
	}
}
