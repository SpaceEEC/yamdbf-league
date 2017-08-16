import { RiotAPI } from '../RiotAPI';
import { CurrentGameInfo } from '../types/CurrentGameInfo';
import { BannedChampion, CurrentGameParticipant, GameMap, GameMode, QueueType, Region } from '../types/index';
import { Champion } from './Champion';
import { GameParticipant } from './GameParticipant';

/**
 * Represents a game that is currently being played in League of Legends.
 */
export class CurrentGame
{
	/**
	 * Array of banned champions
	 * @readonly
	 */
	public readonly bannedChampions: {
		champion: Champion,
		pickTurn: number,
		teamId: number,
	}[];
	/**
	 * Played game mode
	 * @readonly
	 */
	public readonly gameMode: string;
	/**
	 * ID of this game
	 */
	public readonly id: number;
	/**
	 * Played map
	 */
	public readonly mapId: GameMap;
	/**
	 * String representation of mapId
	 */
	public readonly mapName: string;
	/**
	 * Array of participants
	 */
	public readonly participants: GameParticipant[];
	/**
	 * Type of the queue
	 */
	public readonly queueType: QueueType;
	/**
	 * Region this game takes place in
	 * @readonly
	 */
	public readonly region: Region;
	/**
	 * Timestamp this game started
	 * @readonly
	 */
	public readonly startedTimestamp: number;

	/**
	 * Reference to the RiotAPI class' instance
	 * @readonly
	 * @private
	 */
	private readonly _api: RiotAPI;

	/**
	 * Instantiates a new game
	 * @param {CurrentGameInfo} gameInfo
	 */
	public constructor(api: RiotAPI, gameInfo: CurrentGameInfo)
	{
		this._api = api;

		this.bannedChampions = [];
		this.gameMode = gameInfo.gameMode[0].toUpperCase() + gameInfo.gameMode.substr(1).toLowerCase();
		this.id = gameInfo.gameId;
		this.mapId = gameInfo.mapId;
		this.participants = [];
		this.queueType = gameInfo.gameQueueConfigId;
		this.region = gameInfo.platformId;
		this.startedTimestamp = gameInfo.gameStartTime;

		const bannedChamps: Set<number> = new Set<number>();
		for (const { championId, pickTurn, teamId } of gameInfo.bannedChampions)
		{
			if (bannedChamps.has(championId)) continue;
			bannedChamps.add(championId);
			this.bannedChampions.push(
				{
					champion: this._api.champions.get(championId),
					pickTurn,
					teamId,
				},
			);
		}

		this.mapName = GameMap[this.mapId].split('_').map((word: string) =>
			word[0].toUpperCase() + word.substr(1).toLowerCase()).join(' ');

		for (const participant of gameInfo.participants)
		{
			this.participants.push(new GameParticipant(this._api, this, participant));
		}
	}

	/**
	 * How long the game is already running in seconds
	 * @readonly
	 */
	public get gameLength(): number
	{
		return Math.round((Date.now() - this.startedTimestamp) / 1000);
	}
}
