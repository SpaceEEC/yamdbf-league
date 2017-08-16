import { Mastery, Rune } from './';

export type CurrentGameParticipant =
	{
		/**
		 * Icon ID of this participant
		 */
		profileIconId: number,
		/**
		 * ID of this played champion
		 */
		championId: number,
		/**
		 * Summoner name of this participant
		 */
		summonerName: string,
		/**
		 * Currently equipped runes
		 */
		runes: Rune[],
		/**
		 * Whether this participant is a bot
		 */
		bot: boolean,
		/**
		 * The ID of the team this participant is
		 */
		teamId: number,
		/**
		 * The ID of the second spell this participant has equipped
		 */
		spell2Id: number,
		/**
		 * "equipped" masteries
		 */
		masteries: Mastery[],
		/**
		 * The ID of the first spell this participant has equipped
		 */
		spell1Id: number,
		/**
		 * Summoner ID of the participant
		 */
		summonerId: number,
	};
