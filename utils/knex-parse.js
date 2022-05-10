const knex = require('./knex');
const config = require('../config/config');
const {parseResult} = require("./tools");

async function execute({ path: filepath = '', ...args }) {
	const [isPath, api] = filepath.split('.')
	const path = config.sqlPath + '/' + isPath
	if (api) {
		try {
			const queryList = require(path + '.js')
			const query = queryList[api]

			if (args.url.includes('/pageQuery')) {
				const mustPrams = ['pageSize', 'pageNo']
				for (let item of mustPrams) {
					if (!args[item]) return parseResult({ error: `缺少必填参数${item}` })
				}
			}

			let result = await query(knex, args)
			return parseResult(result, args)
		} catch (err) {
			console.log(err)
			return parseResult({ error: err })
		}

	} else {
		return parseResult({ error: filepath + '接口不存在!' })
	}
}

module.exports = execute
