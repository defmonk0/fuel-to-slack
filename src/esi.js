const request = require("request-promise-native");

const baseRequestHeaders = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"User-Agent": process.env.user_agent,
};

const checkCache = (type, id) => {
	if (cache[type][id] !== undefined && cache[type][id] !== null) {
		let p = new Promise(resolve => {
			resolve(cache[type][id]);
		});

		return p;
	}

	return null;
};

const saveCache = (type, id, p) => {
	p.then(data => {
		cache[type][id] = data;
	});
};

let cache = {
	structures: {},
	systems: {},
	types: {},
};

const esi = {
	getStructures: (cid, token) => {
		console.log("Getting structures from ESI: " + cid + ".");

		let h = baseRequestHeaders;
		h["Authorization"] = "Bearer " + token;

		let options = {
			headers: h,
			json: true,
			method: "GET",
			timeout: 10000,
			url:
				"https://esi.evetech.net/latest/corporations/" +
				cid +
				"/structures/?datasource=tranquility",
		};

		let p = request(options);
		return p;
	},

	getStructure: (sid, token) => {
		console.log("Getting structure from ESI: " + sid + ".");

		let h = baseRequestHeaders;
		h["Authorization"] = "Bearer " + token;

		let options = {
			headers: h,
			json: true,
			method: "GET",
			timeout: 10000,
			url:
				"https://esi.evetech.net/latest/universe/structures/" +
				sid +
				"/?datasource=tranquility",
		};

		let p = request(options);
		return p;
	},

	getSystem: sid => {
		let check = checkCache("systems", sid);
		if (check !== null) {
			return check;
		}

		console.log("Getting system from ESI: " + sid + ".");

		let h = baseRequestHeaders;

		let options = {
			headers: h,
			json: true,
			method: "GET",
			timeout: 10000,
			url:
				"https://esi.evetech.net/latest/universe/systems/" +
				sid +
				"/?datasource=tranquility",
		};

		let p = request(options);
		saveCache("systems", sid, p);

		return p;
	},

	getType: tid => {
		let check = checkCache("types", tid);
		if (check !== null) {
			return check;
		}

		console.log("Getting type from ESI: " + tid + ".");

		let h = baseRequestHeaders;

		let options = {
			headers: h,
			json: true,
			method: "GET",
			timeout: 10000,
			url:
				"https://esi.evetech.net/latest/universe/types/" +
				tid +
				"/?datasource=tranquility",
		};

		let p = request(options);
		saveCache("types", tid, p);

		return p;
	},
};

module.exports = esi;
