import { Realms, Region } from './types';
/**
 * Static constants class, to generate urls centralized at one place
 * @static
 */
export class Constants
{
	/**
	 * Current game version
	 * @static
	 */
	public static realms: Realms;

	/**
	 * Root url to make requests too.
	 * @param {Region} region desired region
	 * @returns {string}
	 * @static
	 */
	public static host(region: Region): string
	{
		return `https://${region}.api.riotgames.com/lol`;
	}

	// region source

	/**
	 * Returns the URL to fetch the realms from.
	 * @param {Region} region desired region
	 * @returns {string}
	 * @static
	 */
	public static realmsSource(region: Region): string
	{
		return `${Constants.host(region)}/static-data/v3/realms`;
	}

	/**
	 * Returns the URL to fetch champion data from
	 * @returns {string}
	 * @static
	 */
	public static championDataSource(): string
	{
		return `${Constants.realms.cdn}/${Constants.realms.n.champion}/data/en_US/champion.json`;
	}

	/**
	 * Returns the URL to fetch summoner spell data from
	 * @param {Region} region desired region
	 * @returns {string}
	 * @static
	 */
	public static summonerSpellDataSource(region: Region): string
	{
		return `${Constants.realms.cdn}/${Constants.realms.n.summoner}/data/en_US/summoner.json`;
	}

	// region endregion

	// region data

	/**
	 * Returns the URL to fetch a summoner by their name.
	 * @param {Region} region desired region
	 * @param {string} name
	 * @returns {string}
	 */
	public static summonerByName(region: Region, name: string): string
	{
		return `${Constants.host(region)}/summoner/v3/summoners/by-name/${encodeURIComponent(name)}`;
	}

	/**
	 * Returns the URL to fetch the total mastery level of a summoner by their id.
	 * @param {Region} region desired region
	 * @param {number} summonerId
	 * @returns {string}
	 * @static
	 */
	public static totalMasteryLevelById(region: Region, summonerId: number): string
	{
		return `${Constants.host(region)}/champion-mastery/v3/scores/by-summoner/${summonerId}`;
	}

	/**
	 * Returns URL to fetch all masteries from a summoner by their id.
	 * @param {Region} region desired region
	 * @param {number} summonerId
	 * @returns {string}
	 * @static
	 */
	public static allMasteriesBySummonerId(region: Region, summonerId: number): string
	{
		return `${Constants.host(region)}/champion-mastery/v3/champion-masteries/by-summoner/${summonerId}`;
	}

	/**
	 * Returns the request url to fetch one specific mastery of a summoner.
	 * @param {Region} region desired region
	 * @param {number} summonerId
	 * @param {number} championId
	 * @returns {string}
	 * @static
	 */
	public static masteryByChampionId(region: Region, summonerId: number, championId: number): string
	{
		return [
			`${Constants.host(region)}/champion-mastery/v3/`,
			`champion-masteries/by-summoner/${summonerId}/by-champion/${championId}`,
		].join('');
	}

	/**
	 * Returns the request url to fetch the current game of a summoner by id.
	 * @param {Region} region
	 * @param {number} summonerId
	 * @returns {string}
	 * @static
	 */
	public static currentGameBySummonerId(region: Region, summonerId: number): string
	{
		return `${Constants.host(region)}/spectator/v3/active-games/by-summoner/${summonerId}`;
	}

	// endregion data

	// region cdn

	/**
	 * Generates the url to the summoner spell icon by file name.
	 * @param {string} file file name
	 * @returns {string}
	 * @static
	 */
	public static summonerSpellIconURL(file: string): string
	{
		// summoner version?
		return `${Constants.realms.cdn}/${Constants.realms.n.summoner}/img/spell/${file}`;
	}

	/**
	 * Generates the url to the summoner profile icon by icon id.
	 * @param {number} id
	 * @returns {string}
	 * @static
	 */
	public static profileIconURL(id: number): string
	{
		return `${Constants.realms.cdn}/${Constants.realms.n.profileicon}/img/profileicon/${id}.png`;
	}

	/**
	 * Generates the url to the champion icon by filename.
	 * @param {string} file
	 * @returns {string}
	 * @static
	 */
	public static championIconURL(file: string): string
	{
		return `${Constants.realms.cdn}/${Constants.realms.n.champion}/img/champion/${file}`;
	}

	/**
	 * Generates the url to the map icon by its id.
	 * @param {number} mapId
	 * @returns {string}
	 * @static
	 */
	public static mapIconURL(mapId: number): string
	{
		return `${Constants.realms.cdn}/${Constants.realms.n.map}/img/map/map${mapId}.png`;
	}

	// endregion cdn
}
