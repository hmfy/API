const { key, token } = require('../config/config');
const NodeRSA = require('node-rsa');
const jwt = require('jsonwebtoken');

module.exports = {
	generateKey () {
		const NodeRSA = require('node-rsa')
		const key = new NodeRSA({ b: 512 }) // 密钥长度
		key.setOptions({
			encryptionScheme: 'pkcs1' // 加密格式
		})
		const publicPem = key.exportKey('pkcs8-public-pem')
		const privatePem = key.exportKey('pkcs8-private-pem')

		console.log('公钥：\n', publicPem)
		console.log('私钥：\n', privatePem)
	},
	getDecrypt (str) {
		const rsa = new NodeRSA(key, 'pkcs8-private-pem', { encryptionScheme: 'pkcs1' })
		return rsa.decrypt(str, 'utf8')
	},
	setToken (ID) {
		return {
			token: jwt.sign(
				{ID},
				token.signKey,
				{expiresIn: token.signTime}
			),
			expiresTime: token.signTime
		}
	}
}
