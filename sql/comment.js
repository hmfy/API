module.exports = {
	async add (knex, { content, createTime, USER_ADDRESS, USER_LAT, USER_LNG, USER_ID }) {
		const result = await knex('Comment').insert({
			Content: content,
			CreateTime: createTime,
			Address: USER_ADDRESS,
			lng: USER_LNG,
			lat: USER_LAT,
			creator: USER_ID,
		}).returning('ID')
		return [{ ID: result[0] }]
	},
	async list(knex) {
		const [{total}] = await knex('Comment').count('* as total')
		const list = await knex.select({
			id: 'ID',
			content: 'content',
			createTime: 'createTime',
			address: 'address',
			author: knex.select('name').from('User').where('ID', knex.ref('creator'))
		}).from('Comment').orderBy('ID', 'desc')
		return {
			total: total,
			list: list
		}
	}
}
