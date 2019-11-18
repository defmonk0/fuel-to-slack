const checkFuel = require("./src/checkFuel");

exports.handler = (event, context, callback) => {
	console.log(
		"Environment: " +
			JSON.stringify({
				alert_ranges: process.env.alert_ranges,
				client_id: process.env.client_id,
				client_secret: process.env.client_secret,
				corp_id: process.env.corp_id,
				refresh: process.env.refresh,
				slack_channel: process.env.slack_channel,
				slack_hook_url: process.env.slack_hook_url,
				user_agent: process.env.user_agent,
			})
	);

	checkFuel(callback);
};
