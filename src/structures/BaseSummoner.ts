import { Constants } from '../Constants';
import { RiotAPI } from '../RiotAPI';
import { CurrentGameParticipant } from '../types/CurrentGameParticipant';
import { SummonerData } from '../types/SummonerData';

const { profileIconURL } = Constants;

/**
 * Base summoner class to avoid code duplication
 * @abstract
 */
export abstract class BaseSummoner
{
	/**
	 * Profile icon id of this summoner
	 * (See also the iconURL getter)
	 * @readonly
	 */
	public readonly iconId: number;
	/**
	 * Name of this summoner
	 * @readonly
	 */
	public readonly name: string;
	/**
	 * Id of this summoner
	 * @readonly
	 */
	public readonly id: number;

	/**
	 * Reference to the RiotAPI class' instance
	 * @protected
	 * @readonly
	 */
	protected readonly api: RiotAPI;

	/**
	 * @param {RiotAPI} api
	 * @param {SummonerData|CurrentGameParticipant} data
	 * @protected
	 */
	protected constructor(api: RiotAPI, data: SummonerData | CurrentGameParticipant)
	{
		this.api = api;

		this.iconId = data.profileIconId;

		if (this.isSummonerData(data))
		{
			this.id = data.id;
			this.name = data.name;
		}
		else
		{
			this.id = data.summonerId;
			this.name = data.summonerName;
		}
	}

	/**
	 * Typeguard method because typescript apparently fails to determine that in an if statement
	 * @param {SummonerData|CurrentGameParticipant}
	 * @returns {boolean}
	 * @private
	 */
	private isSummonerData(data: SummonerData | CurrentGameParticipant): data is SummonerData
	{
		return typeof (data as SummonerData).id !== 'undefined';
	}

	/**
	 * The url pointing to the icon of this summoner
	 * @readonly
	 */
	public get iconURL(): string
	{
		return this.iconId
			? profileIconURL(this.iconId)
			: null;
	}
}
