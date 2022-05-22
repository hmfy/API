module.exports = {
	async add(knex, {articleID, title, content, createTime, address, type, tags, USER_ADDRESS, USER_LNG, USER_LAT}) {
		if (articleID) {
			// 有文章ID则更新
			await knex('Article').update({
				Title: title,
				Content: content,
				CreateTime: createTime,
				// Tag: tags,
			}).where('ID', articleID)
		} else {
			await knex('Article').insert({
				Title: title,
				Content: content,
				CreateTime: createTime,
				Address: USER_ADDRESS,
				lng: USER_LNG,
				lat: USER_LAT,
				Type: type,
				Tag: tags,
				Creator: 1,
			})
		}
	},
	async getTag(knex) {
		const tagsList = await knex('Article').where('type', 1).distinct('tag').whereNotNull('tag')
		if (tagsList.length) {
			const tagList = tagsList.reduce((prev, { tag: tags }) => {
				return prev.concat(tags.split(','))
			}, [])
			return [...new Set(tagList)].map(tag => ({ tag }))
		}
		return tagsList
	},
	async list(knex, {pageSize, pageNo}) {
		const [{total}] = await knex('Article').where('type', 1).count('* as total')
		const result = await knex.select({
			id: 'ID',
			title: 'title',
			content: 'content',
			createTime: 'createTime',
			address: 'address',
			type: 'type'
		}).from('Article')
			.limit(pageSize)
			.offset((pageNo - 1) * pageSize)
			.where('type', 1)
			.orderBy('ID', 'desc')
		return {
			total: total,
			list: result
		}
	},
	async detail(knex, {ID}) {
		const prevInfo = knex.select('title', 'ID').from('Article').where('ID', '>', ID).where('type', 1).orderBy('ID', 'asc').limit(1)
		const nextInfo = knex.select('title', 'ID').from('Article').where('ID', '<', ID).where('type', 1).orderBy('ID', 'desc').limit(1)
		const curInfo = knex.select({
			id: 'ID',
			title: 'title',
			content: 'content',
			createTime: 'createTime',
			address: 'address',
			tags: 'tag',
			type: 'type',
			see: knex('ReadHistory as rh').where('rh.ArticleID', knex.ref('at.ID')).count('*')
		}).from('Article as at').where('ID', ID)
		const [ prevRes, curRes, nextRes ] = await Promise.all([prevInfo, curInfo, nextInfo])
		return curRes.map(ele => {
			const { title: prevTitle = '', ID: prevID = 0 } = prevRes.length ? prevRes[0] : []
			const { title: nextTitle = '', ID: nextID = 0 } = nextRes.length ? nextRes[0] : []
			return {
				...ele,
				prevTitle: prevTitle ,
				nextTitle: nextTitle,
				prevID: prevID,
				nextID: nextID
			}
		})
	},
	async near(knex) {
		return knex.select({
			id: 'ID',
			title: 'title'
		}).from('Article').where('type', 1).limit(6).orderBy('ID', 'desc');
	},
	async hot(knex) {
		return knex.select('t.id', 't.title').from(
			knex.select({
				id: 'ID',
				title: 'title',
				see: knex('ReadHistory as rh').where('rh.ArticleID', knex.ref('at.ID')).count('*')
			}).from('Article as at')
				.where('type', 1).as('t')
		)
			.orderBy('t.see', 'desc')
			.limit(6)
	},
	async log(knex) {
		return await knex.select({
			id: 'ID',
			title: 'title',
			content: 'content',
			createTime: 'createTime',
			address: 'address',
			type: 'type',
		}).from('Article').where('type', 2).orderBy('CreateTime', 'asc')
	},
	async delArticle (knex, { articleID }) {
		await knex('Article').where('id', articleID).del()
	}
}
