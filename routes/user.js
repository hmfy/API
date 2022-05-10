const express = require('express')
const knex = require('../utils/knex')
const router = express.Router()
const { setToken, getDecrypt } = require('../utils/verify')

/* GET home page. */
router.post('/', (req, res) => res.send('user home!'))
router.post('/login', async (req, res) => {
	let { username, password } = req.body
	username = getDecrypt(username)
	password = getDecrypt(password)
	const result = await knex.select('password', 'ID').from('User').where('user', username)
	if (result.length) {
		const { password: truePaw, ID } = result[0]
		if (truePaw === password) {
			// 密码正确
			return res.send({
				err: null,
				msg: '登陆成功！',
				token: setToken(ID)
			})
		}
	}
	// 密码错误
	res.send({
		err: '账号或密码有误！'
	})
})

module.exports = router
