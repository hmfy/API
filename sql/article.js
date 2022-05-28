module.exports = {
	async add(knex, {articleID, title, content, createTime, type, tags, USER_ADDRESS, USER_LNG, USER_LAT, USER_ID}) {
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
				Creator: USER_ID,
			})
		}
	},
	async getTag(knex, {USER_ID}) {
		const tagsList = await knex('Article').where('type', 1)
			.distinct('tag').whereNotNull('tag')
			.where(builder => {
				if (USER_ID) {
					builder.where('creator', USER_ID)
				} else {
					builder.where('open', 1) // 只开发我写的
				}
			})
		if (tagsList.length) {
			const tagList = tagsList.reduce((prev, { tag: tags }) => {
				return prev.concat(tags.split(','))
			}, [])
			return [...new Set(tagList)].map(tag => ({ tag }))
		}
		return tagsList
	},
	async list(knex, {pageSize, pageNo, USER_ID}) {
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
			.where(builder => {
				if (USER_ID) {
					builder.where('creator', USER_ID)
				} else {
					builder.where('open', 1) // 只开发我写的
				}
			})
			.orderBy('ID', 'desc')
		return {
			total: total,
			list: result
		}
	},
	async detail(knex, {ID, USER_ID}) {
		const prevInfo = knex.select('title', 'ID').from('Article')
			.where('ID', '>', ID).where('type', 1)
			.where(builder => {
				if (USER_ID) {
					builder.where('creator', USER_ID)
				} else {
					builder.where('open', 1) // 只开发我写的
				}
			})
			.orderBy('ID', 'asc').limit(1)
		const nextInfo = knex.select('title', 'ID').from('Article')
			.where('ID', '<', ID).where('type', 1)
			.where(builder => {
				if (USER_ID) {
					builder.where('creator', USER_ID)
				} else {
					builder.where('open', 1) // 只开发我写的
				}
			})
			.orderBy('ID', 'desc').limit(1)
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
	async near(knex, {USER_ID}) {
		return knex.select({
			id: 'ID',
			title: 'title'
		}).from('Article').where('type', 1)
			.where(builder => {
				if (USER_ID) {
					builder.where('creator', USER_ID)
				} else {
					builder.where('open', 1) // 只开发我写的
				}
			})
			.limit(6).orderBy('ID', 'desc');
	},
	async hot(knex, {USER_ID}) {
		return knex.select('t.id', 't.title').from(
			knex.select({
				id: 'ID',
				title: 'title',
				creator: 'creator',
				open: 'open',
				see: knex('ReadHistory as rh').where('rh.ArticleID', knex.ref('at.ID')).count('*')
			}).from('Article as at')
				.where(builder => {
					if (USER_ID) {
						builder.where('creator', USER_ID)
					} else {
						builder.where('open', 1) // 只开发我写的
					}
				})
				.where('type', 1).as('t')
		)
			.orderBy('t.see', 'desc')
			.limit(6)
	},
	async log(knex, {USER_ID}) {
		return await knex.select({
			id: 'ID',
			title: 'title',
			content: 'content',
			createTime: 'createTime',
			address: 'address',
			type: 'type',
		}).from('Article').where('type', 2)
			.where(builder => {
				if (USER_ID) {
					builder.where('creator', USER_ID)
				} else {
					builder.where('open', 1) // 只开发我写的
				}
			}).orderBy('CreateTime', 'asc')
	},
	async delArticle (knex, { articleID, USER_ID }) {
		await knex('Article').where('id', articleID).where(builder => {
			if (USER_ID) {
				builder.where('creator', USER_ID)
			}
		}).del()
	}
}
