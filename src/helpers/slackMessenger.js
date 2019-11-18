const moment = require("moment");
const Slack = require("slack-node");

const setupExp = data => {
	let exp_date = new Date(data.fuel_expires);
	let exp_ts = exp_date.getTime() / 1000;
	let exp_simp = data.fuel_expires
		.replace(/-/gi, "")
		.replace(/:/gi, "")
		.replace(/Z/gi, "");

	let countdown = encodeURI(
		"https://www.timeanddate.com/countdown/generic?p0=211&iso=" +
			exp_simp +
			"&msg=" +
			data.structure.name
	);

	let exp_formatted =
		"<!date^" +
		exp_ts +
		"^{date_pretty} at {time}^" +
		countdown +
		"|" +
		data.fuel_expires +
		">";

	return [exp_date, exp_formatted];
};

const setupName = name => {
	let s_name = name;
	s_name = s_name.split(" - ");
	s_name.shift();
	s_name = s_name.join(" - ");
	return s_name;
};

const slackMessenger = {
	prep: data => {
		let [exp_date, exp_formatted] = setupExp(data);
		let exp_moment = moment(exp_date);
		let name_formatted = setupName(data.structure.name);

		let message = {
			fields: [
				{
					title: "Structure",
					value: name_formatted,
					short: true,
				},
				{
					title: "System",
					value: data.system.name,
					value:
						"<http://evemaps.dotlan.net/system/" +
						data.system.system_id +
						"/|" +
						data.system.name +
						">",
					short: true,
				},
				{
					title: "Expires At",
					value: exp_formatted,
					short: true,
				},
			],
			title: "Fuel expiring " + exp_moment.fromNow() + ".",
			thumb_url:
				"https://images.evetech.net/types/" +
				data.structure.type_id +
				"/render?size=128",
			fallback:
				"Fuel in " +
				data.structure.name +
				" runs out on " +
				exp_formatted +
				".",
			color: "warning",
			footer:
				"<https://github.com/defmonk0/fuel-to-slack|fuel-to-slack: github@defmonk0>",
		};

		return message;
	},

	send: attachments => {
		console.log("Attempting to send a slack message: " + JSON.stringify(attachments));

		let slack = new Slack();
		slack.setWebhook(process.env.slack_hook_url);

		let p = new Promise(resolve => {
			slack.webhook(
				{
					attachments: attachments,
					channel: process.env.slack_channel,
				},
				response => {
					resolve(response);
				}
			);
		});

		return p;
	},
};

module.exports = slackMessenger;
