var checkFuel = require("../src/checkFuel");
var setEnvironmentVariables = require("./config/setEnvironmentVariables");

setEnvironmentVariables();

console.log(
	"Environment: " +
		JSON.stringify({
			channel: process.env.channel,
			queueID: process.env.queueID,
			slackHookURL: process.env.slackHookURL,
			watchFor: process.env.watchFor
				.split(",")
				.map(item => parseInt(item.trim())),
		})
);

function watch() {
	setTimeout(function() {
		checkFuel(watch);
	}, 10000);//3600000);
}

checkFuel(watch);
