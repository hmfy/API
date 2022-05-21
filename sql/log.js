module.exports = {
	async setAddress (knex, { USER_IP, USER_LNG, USER_LAT, USER_ADDRESS, articleID = null }) {
		await knex('ReadHistory').insert({
			IP: USER_IP,
			ArticleID: articleID,
			CreateTime: Date.now(),
			lng: USER_LNG,
			lat: USER_LAT,
			address: USER_ADDRESS
		})
	},
	async ip2address (knex, { USER_IP, articleID, lessTime = 24 * 60 * 60 * 1000 }) {
		if (!USER_IP) return {
			expires: true,
			info: null
		}
		const res = await knex.select('createTime', 'address', 'lng', 'lat').from('ReadHistory')
			.where('IP', USER_IP)
			.where(builder => {
				if (articleID) {
					builder.where('articleID', articleID)
				}
			})
			.orderBy('ID', 'desc')
		if (res.length) {
			const compare = Date.now() - res[0].createTime
			const { address, lng, lat } = res[0]
			let expires = false
			if (compare > lessTime) {
				// 期限内的
				expires = true
			}
			return {
				expires,
				info: {
					ip: USER_IP,
					lng: lng,
					lat: lat,
					address: address
				}
			}
		} else {
			return {
				expires: true,
				info: null
			}
		}
	}
}
