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
		return `https://${region}.api.riotgames.com/lol/`;
	}

	/**
	 * Returns the URL to fetch the realms from.
	 * @param {Region} region desired region
	 * @returns {string}
	 * @static
	 */
	public static realmsSource(region: Region): string
	{
		return `${Constants.host(region)}static-data/v3/realms`;
	}

	/**
	 * Returns the URL to fetch champion data from
	 * @param {Region} region desired region
	 * @returns {string}
	 * @static
	 */
	public static championDataSource(region: Region): string
	{
		return `${Constants.host(region)}static-data/v3/champions?tags=image`;
	}

	/**
	 * Returns the URL to fetch a summoner by their name.
	 * @param {Region} region desired region
	 * @param {string} name
	 * @returns {string}
	 */
	public static summonerByName(region: Region, name: string): string
	{
		return `${Constants.host(region)}summoner/v3/summoners/by-name/${encodeURIComponent(name)}`;
	}

	/**
	 * Returns the URL to fetch the total mastery level of a summoner by their id.
	 * @param {Region} region desired region
	 * @param {number} id
	 * @returns {string}
	 * @static
	 */
	public static totalMasteryLevel(region: Region, id: number): string
	{
		return `${Constants.host(region)}champion-mastery/v3/scores/by-summoner/${id}`;
	}

	/**
	 * Returns URL to fetch all masteries from a summoner by their id.
	 * @param {Region} region desired region
	 * @param {number} id
	 * @returns {string}
	 * @static
	 */
	public static allMasteries(region: Region, id: number): string
	{
		return `${Constants.host(region)}champion-mastery/v3/champion-masteries/by-summoner/${id}`;
	}

	/**
	 * Returns the request url to fetch one specific mastery of a summoner.
	 * @param {Region} region desired region
	 * @param {number} userId
	 * @param {number} champId
	 * @returns {string}
	 * @static
	 */
	public static oneMastery(region: Region, userId: number, champId: number): string
	{
		return `${Constants.host(region)}champion-mastery/v3/champion-masteries/by-summoner/${userId}/by-champion/${champId}`;
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
}
