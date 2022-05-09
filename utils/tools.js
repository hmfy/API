module.exports = {
	parseResult (result, args) {
		const { url = '' } = args
		if (result instanceof Array) {
			return {
				list: result, err: null
			}
		} else {
			const { error, list, total } = result
			const { pageSize, pageNo  } = args

			if (error) return { err: error, list: [] }

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
			} else {
				return {
					list: [],
					err: `无效的url ${url}`
				}
			}
		}
	}
}
