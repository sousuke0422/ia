import 藍 from '../../ai';
import IModule from '../../module';
import MessageLike from '../../message-like';
//import serifs from '../../serifs';

export default class VersionModule implements IModule {
	public readonly name = 'version';
	private ai: 藍;

	public install = (ai: 藍) => {
		this.ai = ai;
	}

	public onMention = (msg: MessageLike) => {
		if (msg.text == null) return false;

		const query = msg.text.match(/バージョン/);

		if (query == null) return false;

		this.ai.api('meta').then(meta => {
			msg.reply(`${meta.version}\n(Client: ${meta.clientVersion || '???'})みたいです。`)
		}).catch(() => {
			msg.reply(`取得失敗しました`)
		});

		return true;
	}
}
