/**
 * Mastery data, returned from the Riot API
 */
export type MasteryData =
	{
		/**
		 * Champion ID
		 */
		championId: number,
		/**
		 * Champion mastery level
		 */
		championLevel: number,
		/**
		 * Champion mastery points
		 */
		championPoints: number,
		/**
		 * Points achieved since the last level was reached
		 */
		championPointsSinceLastLevel: number,
		/**
		 * Points that have to be achieved before the next level can/will be unlocked
		 */
		championPointsUntilNextLevel: number,
		/**
		 * Whether the chest was granted for this champion
		 */
		chestGranted: boolean,
		/**
		 * Timestamp of the last time since champion was played
		 */
		lastPlayTime: number,
		/**
		 * ID of the summoner relevant to this mastery
		 */
		playerId: number,
		/**
		 * Tokens earned (no clue how this is being used actually)
		 */
		tokensEarned: number,
	};
