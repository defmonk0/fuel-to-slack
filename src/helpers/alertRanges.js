const alertRanges = {
	containsTime: (ranges, ts) => {
		if (typeof ranges === "string") {
			ranges = JSON.parse(ranges);
		}

		for (let range of ranges) {
			let start = range[0];
			let end = range[1];

			if (ts <= start && ts > end) {
				return true;
			}
		}

		return false;
	},
};

module.exports = alertRanges;
