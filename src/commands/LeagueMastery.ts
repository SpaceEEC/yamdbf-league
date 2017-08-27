import { RichEmbed } from 'discord.js';
import { Command, CommandDecorators, Lang, Message, Middleware, ResourceLoader, Util } from 'yamdbf';

import { LeaguePlugin } from '../LeaguePlugin';
import { LocalizationStrings as S } from '../localization/LocalizationStrings';
import { Champion } from '../structures/Champion';
import { ChampionMastery } from '../structures/ChampionMastery';
import { Summoner } from '../structures/Summoner';
import { Region } from '../types';

const {
	aliases,
	clientPermissions,
	desc,
	group,
	guildOnly,
	localizable,
	name,
	usage,
	using,
} = CommandDecorators;
const { expect, resolve } = Middleware;

@aliases('lol', 'leagueChamps', 'lolChamps')
@clientPermissions('SEND_MESSAGES', 'EMBED_LINKS')
@desc('Displays generic information about the specified summoner\'s champs.')
@name('league')
@group('league')
@guildOnly
@usage('<prefix>league [Region] <Summoner> [Page | Champion]')
export class LeagueMasteryCommand extends Command
{
	private readonly plugin: LeaguePlugin;

	public constructor(plugin: LeaguePlugin)
	{
		super();
		this.plugin = plugin;
	}

	// tslint:disable:only-arrow-functions no-shadowed-variable object-literal-sort-keys
	@using(expect({ '<Summoner>': 'String' }))
	@using(async function(this: LeagueMasteryCommand, message: Message, args: string[])
		: Promise<[Message, [string, string, (Champion | number)]]>
	{
		const res: ResourceLoader = Lang.createResourceLoader(
			await message.guild.storage.settings.get('lang')
			|| this.client.defaultLang,
		);

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

			if (!isNaN(parseInt(args[1])))
			{
				// [Summoner, Page]
				return (resolve({
					'<Region>': 'String',
					'<Summoner>': 'String',
					'<Page>': 'Number',
				})).call(this, message, [this.plugin.api.options.defaultRegion, args[0], args[1]]);
			}

			const champion: Champion = this.plugin.api.champions.find((_champion: Champion) =>
				_champion.name.toLowerCase() === args[1].toLowerCase());
			if (champion)
			{
				// [Summoner, Champion]
				return [message, [this.plugin.api.options.defaultRegion, args[0], champion]];
			}

			throw new Error(
				res(S.PLUGIN_LEAGUE_RESOLVE_TWO_ARGS,
					{
						region: args[0],
						championOrPage: args[1],
					},
				),
			);
		}

		let region: string = Region[args[0].toUpperCase() as any];
		if (!region)
		{
			if (!Object.values(Region).includes(args[0].toLowerCase()))
			{
				throw new Error(
					res(S.EXPECT_ERR_INVALID_OPTION,
						{
							name: '<Region>',
							arg: args[0],
							usage: this.usage,
							type: Object.keys(Region).map((key: string) => `\`${key}\``).join(', '),
						},
					),
				);
			}

			region = args[0].toLowerCase();
		}

		if (!isNaN(parseInt(args[2])))
		{
			return (resolve({
				'<Region>': 'String',
				'<Summoner>': 'String',
				'<Page>': 'Number',
			})).call(this, message, [region, args[1], args[2]]);
		}

		const champion: Champion = this.plugin.api.champions.find((_champion: Champion) =>
			_champion.name.toLowerCase() === args[2].toLowerCase());
		if (champion)
		{
			return [message, [region, args[1], champion]];
		}

		throw new Error(
			res(S.PLUGIN_LEAGUE_RESOLVE_PAGE_OR_CHAMPION,
				{
					args: args[2],
				},
			),
		);
	})
	// tslint:enable:only-arrow-functions no-shadowed-variable object-literal-sort-keys
	@localizable
	public async action(message: Message, [res, region, query, input]
		: [ResourceLoader, Region, string, number | Champion])
		: Promise<void>
	{
		const summoner: Summoner = await this.plugin.api.fetchSummoner(region, query);
		if (!summoner)
		{
			return message.channel.send(res(S.PLUGIN_LEAGUE_NO_SUMMONER_FOUND))
				.then(() => undefined);
		}
		if (!summoner.isMasteryDataFetched) await summoner.fetchAllChampionMasteryData();

		if (typeof input !== 'number') return this.champion(res, message, input, summoner);
		return this.page(res, message, input, summoner);
	}

	private async champion(res: ResourceLoader, message: Message, champion: Champion, summoner: Summoner): Promise<void>
	{
		const mastery: ChampionMastery = await summoner.fetchChampionMastery(champion.id);
		if (!mastery)
		{
			return message.channel.send(res(S.PLUGIN_LEAGUE_NO_MASTERY_FOUND)).then(() => undefined);
		}

		const strings: string[] = [
			'',
			res(
				S.PLUGIN_LEAGUE_TOTAL_MASTERY_POINTS,
				{
					level: mastery.levelEmoji || res(S.PLUGIN_LEAGUE_LEVEL, { level: mastery.level.toString() }),
					points: mastery.points.toLocaleString(),
				},
			),
		];

		if (mastery.level < 5)
		{
			strings.push(
				res(S.PLUGIN_LEAGUE_MASTERY_POINTS_TO_NEXT_LEVEL,
					{
						points: mastery.pointsUntilNextLevel.toLocaleString(),
					},
				),
			);
		}
		else if (mastery.level < 7)
		{
			const requiredTokens: number = mastery.level === 5 ? 2 : 3;
			strings.push(
				res(
					S.PLUGIN_LEAGUE_CHAMPION_TOKEN_TO_NEXT_LEVEL,
					{
						current: mastery.tokensEarned.toString(),
						require: requiredTokens.toString(),
					},
				),
			);
		}
		strings.push(res(S.PLUGIN_LEAGUE_MASTERY_CHEST_GRANTED, { emoji: mastery.chestGranted ? '`✅`' : '`❌`' }));

		const embed: RichEmbed = new RichEmbed()
			.setAuthor(summoner.name, summoner.iconURL)
			.setTitle(`${mastery.name} - ${mastery.title}`)
			.setThumbnail(mastery.iconURL)
			.setDescription(strings)
			.setFooter(res(S.PLUGIN_LEAGUE_LAST_PLAYED))
			.setTimestamp(mastery.lastPlayedAt);

		return message.channel.send({ embed })
			.then(() => undefined);
	}

	private async page(res: ResourceLoader, message: Message, requestedPage: number, summoner: Summoner): Promise<void>
	{
		const { masteries, maxPages, page }: { masteries: ChampionMastery[], maxPages: number, page: number } =
			summoner.page(requestedPage);

		let i: number = (page - 1) * 10;
		const champs: string[] = [];
		for (const mastery of masteries)
		{
			const masteryString: string = res(S.PLUGIN_LEAGUE_MASTERY_PRESENTATION,
				{
					level: mastery.levelEmoji || res(S.PLUGIN_LEAGUE_LEVEL, { level: `${mastery.level} ` }),
					name: mastery.name,
					points: mastery.points.toLocaleString(),
				},
			);
			champs.push(`\`${Util.padRight(`${++i}.`, 3)}\u200b\` ${masteryString}`);
		}

		champs.push('', res(S.PLUGIN_LEAGUE_PAGE_INDICATOR,
			{
				currentPage: page.toString(),
				maxPage: maxPages.toString(),
			},
		));
		const embed: RichEmbed = new RichEmbed()
			.setAuthor(res(S.PLUGIN_LEAGUE_PAGE_AUTHOR,
				{
					level: summoner.level.toString(),
					name: summoner.name,
				},
			), summoner.iconURL)
			.setThumbnail(summoner.iconURL)
			.setDescription(res(S.PLUGIN_LEAGUE_TOTAL_MASTERY_LEVEL, { level: summoner.masteryLevel.toString() }))
			.addField(res(page === 1
				? S.PLUGIN_LEAGUE_CHAMPIONS_TOP_TEN
				: S.PLUGIN_LEAGUE_CHAMPIONS_FROM_TO,
				{
					from: ((page - 1) * 10 + 1).toString(),
					to: ((page - 1) * 10 + 10).toString(),
				},
			),
			champs)
			.setFooter(res(S.PLUGIN_LEAGUE_LAST_UPDATE))
			.setTimestamp(summoner.updatedAt);

		return message.channel.send({ embed })
			.then(() => undefined);
	}
}
