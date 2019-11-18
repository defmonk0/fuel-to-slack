const esi = require("./esi");
const oAuthEve = require("./oAuthEve");

const alertRanges = require("./helpers/alertRanges");
const slackMessenger = require("./helpers/slackMessenger");

const checkFuel = async function(callback) {
	console.log("Checking structures for fuel.");

	let auth = new oAuthEve(
		process.env.client_id,
		process.env.client_secret,
		process.env.refresh
	);

	let structs = await esi.getStructures(98586118, await auth.getToken());
	let flagged = structs.filter(s => {
		if (s.fuel_expires === undefined) {
			return false;
		}

		let now = Math.floor(Date.now() / 1000);
		let expires = new Date(s.fuel_expires).getTime() / 1000;
		let diff = expires - now;

		return alertRanges.containsTime(process.env.alert_ranges, diff);
	});

	let promises = [];
	let requested = {
		structure: {},
		system: {},
		type: {},
	};

	for (let i in flagged) {
		let stid = flagged[i]["structure_id"];
		let syid = flagged[i]["system_id"];
		let tyid = flagged[i]["type_id"];

		if (requested.structure[stid] == undefined) {
			requested.structure[stid] = true;
			promises.push(
				esi.getStructure(stid, await auth.getToken()).then(res => {
					flagged[i]["structure"] = res;
				})
			);
		}

		if (requested.system[syid] == undefined) {
			requested.system[syid] = true;
			promises.push(
				esi.getSystem(syid).then(res => {
					flagged[i]["system"] = res;
				})
			);
		}

		if (requested.type[tyid] == undefined) {
			requested.type[tyid] = true;
			promises.push(
				esi.getType(tyid).then(res => {
					flagged[i]["type"] = res;
				})
			);
		}
	}

	await Promise.all(promises);

	messages = [];
	for (let f of flagged) {
		messages.push(slackMessenger.prep(f));
	}

	await slackMessenger.send(messages);
	console.log("Completed fuel check.");

	// callback();
};

module.exports = checkFuel;
