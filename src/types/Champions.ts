import { Champion } from './';

export type Champions = {
	type: string,
	version: string,
	data: {
		[id: number]: Champion,
	},
};
