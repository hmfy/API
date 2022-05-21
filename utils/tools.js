module.exports = {
	parseResult(result = {}, args = {}) {
		const {url = ''} = args
		if (!(result instanceof Array)) {
			const {error, list, total} = result
			const {pageSize, pageNo} = args

			if (error) return {err: error, list: []}

			if (url.includes('/execute')) {
				return {
					list: list,
					err: null
				}
			} else if (url.includes('/pageQuery')) {
				return {
					pageSize: pageSize,
					pageNo: pageNo,
					total: total || list.length,
					list: list,
					err: null
				}
			} else if (url.includes('/noParse')) {
				return result
			} else {
				return {
					list: [],
					err: `无效的url ${url}`
				}
			}
		} else {
			return {
				list: result, err: null
			}
		}
	},
	getIP(req) {
		let ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || '';
		const [IP = ''] = ip.split(',')
		return IP.substr(IP.lastIndexOf(':') + 1, IP.length);
	},

	uuid() {
		const s = [];
		const hexDigits = "0123456789abcdef";
		for (let i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		return s.join("");
	}
}
