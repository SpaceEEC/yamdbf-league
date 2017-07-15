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

	@using(expect({ '<Summoner> ': 'String' }))
	// tslint:disable-next-line:only-arrow-functions no-shadowed-variable
	@using(function(message: Message, [inputRegion, query, pageOrChamp]: [string, string, string])
		: [Message, [string, string, number | Champion]]
	{
		if (!query)
		{
			query = inputRegion;
			inputRegion = this.plugin.api.options.defaultRegion;
		}
		else if (!pageOrChamp)
		{
			pageOrChamp = query;
			query = inputRegion;
			inputRegion = this.plugin.api.options.defaultRegion;
		}

		// tslint:disable-next-line:no-shadowed-variable wonderful string enums <.<
		let region: string = Region[inputRegion.toUpperCase() as any];
		if (!region)
		{
			if (Object.values(Region).includes(inputRegion))
			{
				region = inputRegion;
			}
			else
			{
				throw new Error(`Error: in arg \`<Region>\`: \`${inputRegion}\` could not be resolved to a valid Region.\n`
					+ `Valid regions are ${Object.keys(Region).map((key: string) => `\`${key}\``).join(', ')}.`);
			}
		}

		if (pageOrChamp)
		{
			if (!isNaN(parseInt(pageOrChamp)))
			{
				return resolve({ '<Region>': 'String', '<Summoner>': 'String', '<Page>': 'Number' })
					.call(this, message, [region, query, pageOrChamp]);
			}
			const champion: Champion =
				this.plugin.api.champs.find((_champion: Champion) => _champion.name.toLowerCase() === pageOrChamp.toLowerCase());
			if (champion) return [message, [region, query, champion]];

			throw new Error('Error: in arg `<Page|Champion>`: '
				+ `\`${pageOrChamp}\` could not be resolved to a champion or page number.`);
		}

		return [message, [region, query, 1]];
	})
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
