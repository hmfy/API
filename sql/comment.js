module.exports ={
	async add (knex, { content, createTime, address }) {
		const result = await knex('Comment').insert({
			Content: content,
			CreateTime: createTime,
			Address: address
		}).returning('ID')
		return [{ ID: result[0] }]
	},
	async list(knex) {
		const [{total}] = await knex('Comment').count('* as total')
		const list = await knex.select({
			id: 'ID',
			content: 'content',
			createTime: 'createTime',
			author: 'address'
		}).from('Comment').orderBy('ID', 'desc')
		return {
			total: total,
			list: list
		}
	}
}
