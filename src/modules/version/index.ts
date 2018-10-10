import 藍 from '../../ai';
import IModule from '../../module';
import MessageLike from '../../message-like';
//import serifs from '../../serifs';

/**
 * バージョン情報
 */
interface Version {
	/**
	 * サーバーバージョン(meta.version)
	 */
	server: string;
	/**
	 * クライアントバージョン(meta.clientVersion)
	 */
	client: string;
}

export default class VersionModule implements IModule {
	public readonly name = 'version';
	private ai: 藍;
	private latest?: Version;

	public install = (ai: 藍) => {
		this.ai = ai;
	}

	public onConnectionOpen = () => {
		// バージョンチェック
		this.getVersion().then(fetched => {
			console.log(`Version fetched: ${JSON.stringify(fetched)}`);

			if (this.latest != null && fetched != null) {
				if ((this.latest.server !== fetched.server) || (this.latest.client !== fetched.client)) {
					const v = `Server: ${this.latest.server} → ${fetched.server}\nClient: ${this.latest.client} → ${fetched.client}`

					console.log(`Version changed: ${v}`);

					this.wait(30 * 1000).then(() => {
						this.ai.post({ text: `バージョンが変わりました\n${v}` });
					});
				} else {
					// 変更なし
				}
			}

			this.latest = fetched;
		});
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

	/**
	 * バージョンを取得する
	 */
	private getVersion = (): Promise<Version> => {
		return this.ai.api('meta').then(meta => {
			return {
				server: meta.version,
				client: meta.clientVersion
			};
		});
	}

	private wait = (ms: number): Promise<void> => {
		return new Promise(resolve => {
			setTimeout(() => resolve(), ms);
		})
	}
}
