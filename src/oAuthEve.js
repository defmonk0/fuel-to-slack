const qs = require("querystring");
const request = require("request-promise-native");

const baseRequestHeaders = {
	"Content-Type": "application/json",
	"User-Agent": process.env.user_agent,
	"Accept": "application/json",
};

class oAuthEve {
	constructor(client_id, client_secret, refresh) {
		this.client_id = client_id;
		this.client_secret = client_secret;
		this.refresh = refresh;
		this.token = null;
		this.expires = 0;
	}

	getNewToken() {
		console.log("Getting new access token.");

		let authorization = this.client_id + ":" + this.client_secret;
		let buff = new Buffer.from(authorization);

		let h = {
			"Accept": "application/json",
			"Authorization": "Basic " + buff.toString("base64"),
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": process.env.user_agent,
		};

		let data = {
			grant_type: "refresh_token",
			refresh_token: this.refresh,
		};

		let options = {
			body: qs.encode(data),
			headers: h,
			json: true,
			method: "POST",
			timeout: 10000,
			url: "https://login.eveonline.com/v2/oauth/token",
		};

		let p = request(options);
		return p;
	}

	async getToken() {
		let now = Math.floor(Date.now() / 1000);

		if (this.expires < now + 60) {
			let res = await this.getNewToken();
			this.token = res.access_token;
			this.expires = now + res.expires_in;
		}

		return this.token;
	}
}

module.exports = oAuthEve;
