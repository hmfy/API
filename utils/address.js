const request = require('request')
const {getIP} = require("../utils/tools");
const {mapKey} = require('../config/config')
const execute = require('../utils/knex-parse')

//经纬度测算中心位置
function getCenter(xArr, yArr) {
	const poly = [];
	for (let i = 0; i < xArr.length; i++) {
		const pu = {
			x: parseFloat(xArr[i]),
			y: parseFloat(yArr[i]),
			z: 0
		};
		poly.push(pu);
	}
	const sortedLongitudeArray = poly.map(item => item.x).sort();
	const sortedLatitudeArray = poly.map(item => item.y).sort();
	const centerLongitude = ((parseFloat(sortedLongitudeArray[0]) + parseFloat(sortedLongitudeArray[sortedLongitudeArray.length - 1])) / 2).toFixed(14);
	const centerLatitude = ((parseFloat(sortedLatitudeArray[0]) + parseFloat(sortedLatitudeArray[sortedLatitudeArray.length - 1])) / 2).toFixed(14);
	return {
		x: centerLongitude,
		y: centerLatitude
	};
}

module.exports = {
	async getAddress(req) {
		const ip = getIP(req)
		const {info} = await execute({path: 'log.ip2address', url: '/noParse', ip: ip})
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
						const [lngLat, lngLat2] = rectangle.split(';')
						if (lngLat && lngLat2) {
							const [_lng, _lat] = lngLat.split(',')
							const [__lng, __lat] = lngLat2.split(',')
							const { x, y } = getCenter([_lng, __lng], [_lat, __lat])
							lng = x
							lat = y
						}
					}
					resolve({ip, lng, lat, address})
				})
			}
			resolve(info)
		})
	}
}
