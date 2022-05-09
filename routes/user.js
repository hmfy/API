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
	const [ { password: truePaw, ID } ] = await knex.select('password', 'ID').from('User').where('user', username)
	if (truePaw === password) {
		// 密码正确
		res.send({
			err: null,
			msg: '登陆成功！',
			token: setToken(ID)
		})
	} else {
		// 密码错误
		res.send({
			err: '密码或密码有误！'
		})
	}
})

module.exports = router
