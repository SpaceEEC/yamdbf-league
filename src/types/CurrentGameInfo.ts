import { BannedChampion, CurrentGameParticipant, GameMap, GameMode, GameType, QueueType, Region } from './';

export type CurrentGameInfo =
	{
		/**
		 * The ID of the game
		 */
		gameId: number,
		/**
		 * The game start time represented in epoch milliseconds
		 */
		gameStartTime: number,
		/**
		 * The ID of the platform on which the game is being played
		 */
		platformId: Region,
		/**
		 * The game mode
		 */
		gameMode: GameMode,
		/**
		 * The ID of the map
		 */
		mapId: GameMap,
		/**
		 * The game type
		 */
		gameType: GameType,
		/**
		 * Banned champion information
		 */
		bannedChampions: BannedChampion[],
		/**
		 * The observer information
		 */
		observers:
		{
			/**
			 * Key used to decrypt the spectator grid game data for playback
			 */
			encryptionKey: string,
		},
		/**
		 * The participant information
		 */
		participants: CurrentGameParticipant[],
		/**
		 * The amount of time in seconds that has passed since the game started
		 */
		gameLength: number,
		/**
		 * The queue type
		 */
		gameQueueConfigId: QueueType,
	};
