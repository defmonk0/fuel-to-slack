var environmentVariables = require("./environmentVariables.json");

var setEnvironmentVariables = function() {
	process.env.channel = environmentVariables.channel;
	process.env.queueID = environmentVariables.queueID;
	process.env.slackHookURL = environmentVariables.slackHookURL;
	process.env.watchFor = environmentVariables.watchFor;
};

module.exports = setEnvironmentVariables;
