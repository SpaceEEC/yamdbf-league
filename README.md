# yamdbf-league
A YAMDBF league plugin which allows users to easily retrieve their and others champion masteries from [League of Legends](https://leagueoflegends.com).

# Installing
- Install the package via `npm` (requires `git` to be installed):
```
npm i -S SpaceEEC/yamdbf-league
```
> Note: YAMDBF 3.0.0 is required to use this plugin since plugin support has been added with 3.0.0.

- Add it to your client's plugins, here a small example:
```ts
import { Client } from 'yamdbf';
import { League } from 'yamdbf-league';

const client: Client = new Client({
	plugins: [League('riot-api-token')],
});
```
> Note: This plugin's build method is being exported as `League`, and `default`.

# Commands

## Champion Mastery
> The default region is, if not specified otherwise, `euw`.

`<prefix>league [Region] <Summoner> [Page | Champion]`
> Aliased with `lol`, `leagueChamps` and `lolChamps`.

### Pages
For Example: `<prefix>league euw test 2` will display the second page (champions 11-20) of the summoner `test` in the `euw` region with the following information (per champion):
- Champion Level
- Champion Mastery Score

### Indiviual Champions
For example `<prefix> league euw test lux`
will display stats about `Lux` from `test` in the `euw` region, showing the fllowing information:
- Champion Mastery Level
- Points / Tokens required until next level (if applicable)
- Whether a chest has been granted

## Live game

`<prefix>lolGame [Region] <Summoner>`
> Aliased with `leagueGame`, `lolLive` and `leagueLive`.

For example: `<prefix> league euw test`

Will display the following current game's information (if ingame) of the summoner `test` in the `euw` region:
- Played Map
- Queue Type
- Current Time
- Picked Champions
- Banned Champions (if applicable)
# Configuring
> Note: You can use the exported type `LeaguePluginOptions`.

You can pass the plugin as second parameter an options object, here a full example of this:

```ts
import { Client, PluginConstructor } from 'yamdbf';
import { League, LeaguePluginOptions, Region } from 'yamdbf-league';

const options: LeaguePluginOptions = {
	defaultRegion: Region.NA,
	emojis: {
		level4: '<:level4:335427521078231051>',
		level5: '<:level5:335427521900445696>',
		level6: '<:level6:335427522332459008>',
		level7: '<:level7:335427524429348866>',
	},
	maxCacheSize: 50,
};

const league: PluginConstructor = League('riot-api-token', options);

const client: Client = new Client({
	plugins: [league],
});
```
> Note: Every key is optional, see the explanation further down for more info.

## defaultRegion
> Note: You can use the exported enum type `Region`.

This option defaults to `'euw1'` (or enum `Region.EUW`).

For example with the exported enum for the north american region:
```ts
import { LeaguePluginOptions, Region } from 'yamdbf-league';

const options: LeaguePluginOptions = {
	defaultRegion: Region.NA,
}
```
You can find the enum and it's string representations [here](src/types/Region.ts).

You should be able to use all valid hosts, that can be found [here](https://developer.riotgames.com/regional-endpoints.html). (Might require a login)

## maxCacheSize
This option defaults to `100`.

The maximum amount of summoners to cache across all regions to not unnecessarily query the api multiple times for just one summoner.

## emojis
A key value object structured the following way:
```ts
{
	level4: 'replaceString',
	level5: 'replaceString',
	level6: 'replaceString',
	level7: 'replaceString',
}
```
>Note: Every key is optional; You may want to have a trailing space if you don't use an emoji.

The passed strings will be used to replace the `Level n` (where n is 4-7) representation of champion masteries.

I use that with custom emojis to display the loading screen mastery badges instead of the plain string, to give you an idea what to do with this.
You are free to replace them with whatever you want.