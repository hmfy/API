module.exports = {
	async a (knex) {
		return await knex.select('*').from('Article')
	}
}
