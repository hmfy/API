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
	}
}
