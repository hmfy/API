const express = require('express')
const knex = require('../utils/knex')
const { user } = require('../utils/tools')
const router = express.Router()
const { setToken, getDecrypt } = require('../utils/verify')
const { setUserInfo } = require('../redis')

/* GET home page. */
router.post('/', (req, res) => res.send('user home!'))
router.post('/login', async (req, res) => {
	let { username, password } = req.body
	username = getDecrypt(username)
	password = getDecrypt(password)
	const result = await knex.select('password', 'ID', 'name').from('User').where('user', username)
	if (result.length) {
		const { password: truePaw, ID, name } = result[0]
		if (truePaw === password) {
			// 密码正确
			const { token, expiresTime } = setToken(ID)
			// 保存登录信息
			await setUserInfo({
				userID: ID,
				token,
				expiresTime
			})
			return res.send({
				code: 200,
				err: null,
				msg: '登陆成功！',
				tokenInfo: { token, expiresTime },
				userInfo: { name, ID }
			})
		}
	}
	// 密码错误
	res.send({
		err: '账号或密码有误！'
	})
})

module.exports = router
