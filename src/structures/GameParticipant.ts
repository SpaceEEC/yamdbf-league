import { RiotAPI } from '../RiotAPI';
import { Champion } from '../structures/Champion';
import { CurrentGameParticipant, Mastery, Rune } from '../types';
import { BaseSummoner } from './BaseSummoner';
import { CurrentGame } from './CurrentGame';
import { SummonerSpell } from './SummonerSpell';

/**
 * Represents a participant in a game
 */
export class GameParticipant extends BaseSummoner
{
	/**
	 * Reference to the game this participant belongs to
	 * @readonly
	 */
	public readonly game: CurrentGame;

	/**
	 * Whether this participant is a bot
	 * @readonly
	 */
	public readonly bot: boolean;
	/**
	 * The played champion
	 * @readonly
	 */
	public readonly champion: Champion;
	/**
	 * Currently "equipped" masteries
	 * @readonly
	 */
	public readonly masteries: Mastery[];
	/**
	 * Currently equipped runes
	 * @readonly
	 */
	public readonly runes: Rune[];
	/**
	 * The first spell this participant has
	 * @readonly
	 */
	public readonly spell1: SummonerSpell;
	/**
	 * The second spell this participant has
	 * @readonly
	 */
	public readonly spell2: SummonerSpell;
	/**
	 * The ID of the team this participant belongs to
	 * @readonly
	 */
	public readonly teamId: number;

	/**
	 * Instantiates a new GameParticipant
	 * @param {RiotAPI} api
	 * @param {CurrentGame} game
	 * @param {CurrentGameParticipant} data
	 */
	public constructor(api: RiotAPI, game: CurrentGame, data: CurrentGameParticipant)
	{
		super(api, data);

		this.game = game;

		this.bot = data.bot;
		this.champion = api.champions.get(data.championId);
		this.masteries = data.masteries;
		this.runes = data.runes;
		this.spell1 = null; // api.summonerSpells.get(data.spell1Id);
		this.spell2 = null; // api.summonerSpells.get(data.spell2Id);
		this.teamId = data.teamId;
	}
}
