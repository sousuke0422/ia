import 藍 from '../../ai';
import IModule from '../../module';
import MessageLike from '../../message-like';
import serifs from '../../serifs';
import * as seedrandom from 'seedrandom';

const omikujis = [
	'大大吉',
	'大吉',
	'吉',
	'中吉',
	'小吉',
	'末吉',
	'凶',
	'大凶'
];

const items = [
	'ドール', 'テディベア', 'ぬいぐるみ',
	'ナス', 'トマト',	'きゅうり',	'じゃがいも',
	'焼きビーフン', 'ポップコーン', 'チキンラーメン', '缶チューハイ',
	'腰', 'ニーソックス', 'カチューシャ',
	'パンジャンドラム', 'カチューシャ(兵器)',
	'寿司'
];

export default class FortuneModule implements IModule {
	public readonly name = 'fortune';

	private ai: 藍;

	public install = (ai: 藍) => {
		this.ai = ai;
	}

	public onMention = (msg: MessageLike) => {
		if (msg.includes(['占', 'うらな', '運勢', 'おみくじ'])) {
			const date = new Date();
			const seed = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}@${msg.userId}@${this.ai.account.id}`;
			const rng = seedrandom(seed);
			const omikuji = omikujis[Math.floor(rng() * omikujis.length)];
			const item = items[Math.floor(rng() * items.length)];
			msg.reply(`**${omikuji}🎉**\nラッキーアイテム: ${item}`, serifs.fortune.cw(msg.friend.name));
			return true;
		} else {
			return false;
		}
	}
}
