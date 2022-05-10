const request = require('request')
const {getIP} = require("../utils/tools");
const { mapKey } = require('../config/config')
const execute = require('../utils/knex-parse')

module.exports = {
	async getAddress (req) {
		const ip = getIP(req)
		const { info } = await execute({ path: 'log.ip2address', url: '/noParse', ip: ip  })
		return new Promise(resolve => {
			if (!info) {
				let lng = null,
					lat = null,
					address = null;
				if (ip === '127.0.0.1') return resolve({ip, lng, lat, address: '上海市'})
				const getMapAPI = `https://restapi.amap.com/v3/ip?ip=${ip}&output=json&key=${mapKey}`
				return request(getMapAPI, (err, res) => {
					const {city, province, rectangle = ';'} = JSON.parse(res.body)
					if (city && typeof city === 'string') {
						address = province
						const [lngLat] = rectangle.split(';')
						if (lngLat) {
							([lng, lat] = lngLat.split(','))
						}
					}
					resolve({ip, lng, lat, address})
				})
			}
			resolve(info)
		})
	}
}
