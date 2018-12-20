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

		this.versionCheck();
		setInterval(this.versionCheck, 60 * 1000);
	}

	public versionCheck = () => {
		// バージョンチェック
		this.getVersion().then(fetched => {
			console.log(`Version fetched: ${JSON.stringify(fetched)}`);

			if (this.latest != null && fetched != null) {
				const serverChanged = this.latest.server !== fetched.server;
				const clientChanged = this.latest.client !== fetched.client;

				if (serverChanged || clientChanged) {
					const newServer = fetched.server.match(/^\d+\.\d+\.\d+$/)
						? `[${fetched.server}](https://github.com/syuilo/misskey/releases/tag/${fetched.server})`
						: fetched.server;

					let v = '';
					v += (serverChanged ? '**' : '') + `Server: ${this.latest.server} → ${newServer}\n` + (serverChanged ? '**' : '');
					v += (clientChanged ? '**' : '') + `Clinet: ${this.latest.client} → ${fetched.client}\n` + (clientChanged ? '**' : '');

					console.log(`Version changed: ${v}`);

					this.ai.post({ text: `【バージョンが変わりました】\n${v}` });
				} else {
					// 変更なし
				}
			}

			this.latest = fetched;
		}).catch(e => console.warn(e));
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
