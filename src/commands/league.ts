import { RichEmbed } from 'discord.js';
import { Command, Message, Util } from 'yamdbf/bin';
import {
	aliases,
	clientPermissions,
	desc,
	group,
	guildOnly,
	name,
	usage,
	using,
} from 'yamdbf/bin/command/CommandDecorators';
import { expect } from 'yamdbf/bin/command/middleware/Expect';
import { resolve } from 'yamdbf/bin/command/middleware/Resolve';

import { LeaguePlugin } from '../LeaguePlugin';
import { ChampionMastery } from '../structures/ChampionMastery';
import { Summoner } from '../structures/Summoner';
import { Champion, Region } from '../types';

@aliases('lol')
@clientPermissions('SEND_MESSAGES', 'EMBED_LINKS')
@desc('Displays generic information about the specified summoner\'s champs.')
@name('league')
@group('league')
@guildOnly
@usage('<prefix>league [Region] <Summoner> [Page | Champion]')
export class LeagueCommand extends Command
{
	private readonly plugin: LeaguePlugin;

	public constructor(plugin: LeaguePlugin)
	{
		super();
		this.plugin = plugin;
	}

	// tslint:disable:only-arrow-functions no-shadowed-variable
	@using(expect({ '<Summoner> ': 'String' }))
	@using(function(message: Message, args: string[]): [Message, [string, string, Champion | number]]
	{
		if (args.length === 1)
		{
			return [message, [this.plugin.api.options.defaultRegion, args[0], 1]];
		}

		if (args.length === 2)
		{
			let region: string = Region[args[0].toUpperCase() as any];
			// [Region, Summoner]
			if (region) return [message, [region, args[1], 1]];

			if (Object.values(Region).includes(args[0].toLowerCase()))
			{
				// [Region, Summoner]
				return [message, [args[0].toLowerCase(), args[1], 1]];
			}
			else if (!isNaN(parseInt(args[1])))
			{
				// [Summoner, Page]
				return (resolve({
					'<Region>': 'String',
					'<Summoner>': 'String',
					// tslint:disable-next-line:object-literal-sort-keys
					'<Page>': 'Number',
				})).call(this, message, [this.plugin.api.options.defaultRegion, args[0], args[1]]);
			}
			else if (this.plugin.api.champs.find((_champion: Champion) =>
				_champion.name.toLowerCase() === args[1].toLowerCase()))
			{
				const champ: Champion = this.plugin.api.champs.find((_champion: Champion) =>
					_champion.name.toLowerCase() === args[1].toLowerCase());
				// [Summoner, Champion]
				return [message, [this.plugin.api.options.defaultRegion, args[0], champ]];
			}
			else
			{
				throw new Error(`\`${args[0]}\` is not a valid region as well as \`${args[1]}\` is not a valid champion or page.\n`
					+ 'You have to specify either `[Region] <Summoner>` or `<Summoner> [Page | Champion]`');
			}
		}

		let region: string = Region[args[0].toUpperCase() as any];
		if (!region)
		{
			if (Object.values(Region).includes(args[0].toLowerCase()))
			{
				region = args[0].toLowerCase();
			}
			else
			{
				throw new Error(`Error: in arg \`<Region>\`: \`${args[0]}\` could not be resolved to a valid Region.\n`
					+ `Valid regions are ${Object.keys(Region).map((key: string) => `\`${key}\``).join(', ')}.`);
			}
		}

		if (!isNaN(parseInt(args[2])))
		{
			return (resolve({
				'<Region>': 'String',
				'<Summoner>': 'String',
				// tslint:disable-next-line:object-literal-sort-keys
				'<Page>': 'Number',
			})).call(this, message, [this.plugin.api.options.defaultRegion, args[1], args[2]]);
		}
		else if (this.plugin.api.champs.find((_champion: Champion) =>
			_champion.name.toLowerCase() === args[1].toLowerCase()))
		{
			const champ: Champion = this.plugin.api.champs.find((_champion: Champion) =>
				_champion.name.toLowerCase() === args[1].toLowerCase());
			return [message, [this.plugin.api.options.defaultRegion, args[1], champ]];
		}
		else
		{
			throw new Error(
				`Error: in arg \`<Page|Champion>\`: \`${args[2]}\` could not be resolved to a champion or page number.`,
			);
		}
	})
	// tslint:enable:only-arrow-functions no-shadowed-variable
	public async action(message: Message, [region, query, input]: [Region, string, number | Champion]): Promise<void>
	{
		const summoner: Summoner = await this.plugin.api.getSummoner(region, query);
		if (!summoner)
		{
			return message.channel.send('Failed to find a summoner by that name.')
				.then(() => undefined);
		}

		if (typeof input !== 'number') return this.champion(message, input, summoner);
		return this.page(message, input, summoner);
	}

	private async champion(message: Message, champion: Champion, summoner: Summoner): Promise<void>
	{
		const mastery: ChampionMastery = await summoner.getChampionMastery(champion.id);
		if (!mastery)
		{
			return message.channel.send(
				'Could not find any information about that champ from this user, maybe they never played it?',
			).then(() => undefined);
		}

		const strings: string[] = [
			mastery.title,
			'',
			`${mastery.levelRepresentation} Total points: \`${mastery.points.toLocaleString()}\``,
		];

		if (mastery.level < 5)
		{
			strings.push(`Points until next level: \`${mastery.pointsUntilNextLevel.toLocaleString()}\``);
		}
		else if (mastery.level < 7)
		{
			const requiredTokens: number = mastery.level === 5 ? 2 : 3;
			strings.push(`Tokens \`${mastery.tokensEarned}\`/\`${requiredTokens}\``);
		}
		strings.push(`Chest granted: ${mastery.chestGranted ? '`✅`' : '`❌`'}`);

		const embed: RichEmbed = new RichEmbed()
			.setAuthor(`${summoner.name} - ${mastery.name}`, summoner.profileIconURL)
			.setThumbnail(mastery.iconURL)
			.setDescription(strings)
			.setFooter('Last played at')
			.setTimestamp(mastery.lastPlayedAt);

		return message.channel.send({ embed })
			.then(() => undefined);
	}

	private page(message: Message, requestedPage: number, summoner: Summoner): Promise<void>
	{
		const { masteries, maxPages, page }: { masteries: ChampionMastery[], maxPages: number, page: number } =
			summoner.page(requestedPage);

		let i: number = (page - 1) * 10;
		const champs: string[] = masteries
			.map((mastery: ChampionMastery) => `\`${Util.padRight(`${++i}.`, 3)}\u200b\` ${mastery}`);

		champs.push('', `Page \`${page}\` of \`${maxPages}\``);

		const embed: RichEmbed = new RichEmbed()
			.setAuthor(`${summoner.name} - Level ${summoner.level}`, summoner.profileIconURL)
			.setThumbnail(summoner.profileIconURL)
			.setDescription([
				`Total champion mastery level: \`${summoner.masteryLevel}\``,
			])
			.addField(page === 1
				? `Top 10 Champs`
				: `Champs ${(page - 1) * 10 + 1} - ${(page - 1) * 10 + 10}`
			, champs)
			.setFooter('Last updated at')
			.setTimestamp(summoner.updatedAt);

		return message.channel.send({ embed })
			.then(() => undefined);
	}
}
