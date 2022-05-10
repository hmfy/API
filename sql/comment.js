module.exports = {
	async add (knex, { content, createTime, USER_ADDRESS, USER_LAT, USER_LNG }) {
		const result = await knex('Comment').insert({
			Content: content,
			CreateTime: createTime,
			Address: USER_ADDRESS,
			lng: USER_LNG,
			lat: USER_LAT
		}).returning('ID')
		return [{ ID: result[0] }]
	},
	async list(knex, { USER_ADDRESS }) {
		const [{total}] = await knex('Comment').count('* as total')
		const list = await knex.select({
			id: 'ID',
			content: 'content',
			createTime: 'createTime',
			author: USER_ADDRESS
		}).from('Comment').orderBy('ID', 'desc')
		return {
			total: total,
			list: list
		}
	}
}
