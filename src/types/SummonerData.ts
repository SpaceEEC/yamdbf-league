/**
 * Summoner data returned from the Riot API
 */
export type SummonerData =
	{
		/**
		 * Account ID
		 */
		accountId: number,
		/**
		 * ID
		 */
		id: number,
		/**
		 * Name
		 */
		name: string,
		/**
		 * Profile icon ID
		 */
		profileIconId: number,
		/**
		 * Timestamp of the last update of this summoner profile
		 */
		revisionDate: number,
		/**
		 * Level
		 */
		summonerLevel: number,
	};
