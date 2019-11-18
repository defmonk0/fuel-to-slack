const environmentVariables = require("./environmentVariables.json");

const setEnvironmentVariables = function() {
	process.env.alert_ranges = environmentVariables.alert_ranges;
	process.env.client_id = environmentVariables.client_id;
	process.env.client_secret = environmentVariables.client_secret;
	process.env.corp_id = environmentVariables.corp_id;
	process.env.refresh = environmentVariables.refresh;
	process.env.slack_channel = environmentVariables.slack_channel;
	process.env.slack_hook_url = environmentVariables.slack_hook_url;
	process.env.user_agent = environmentVariables.user_agent;
};

module.exports = setEnvironmentVariables;
