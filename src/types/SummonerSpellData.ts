import { DataMixing, GameMode } from './';

export type SummonerSpellData =
	{
		/**
		 * The required summoner level
		 */
		summonerLevel: number;
		/**
		 * Small text describing this summoner spell
		 */
		description: string;
		/**
		 * Tooltip of how this spell appears in game (even with html tags!)
		 */
		tooltip: string;
		maxrank: number;
		cooldown: number[];
		cooldownBurn: string;
		cost: number[];
		costburn: string;
		effect: number[][];
		effectBurn: string[];
		vars: {
			link: string,
			coeff: number,
			key: string,
		}[];
		modes: GameMode[];
		costType: string;
		maxammo: string;
		range: number[];
		rangeBurn: string;
		resource: string;
	} & DataMixing<string>;
