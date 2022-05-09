const express = require('express')
const execute = require('../utils/knex-parse')
const router = express.Router()

async function request (req, res) {
	const result = await execute({ ...req.body, url: req.url })
	res.send(result)
}

/* GET home page. */
router.get('/', (req, res) => res.send('hello word!'))
router.post('/execute', request)
router.post('/execute2', request)
router.post('/pageQuery', request)
router.post('/pageQuery2', request)

module.exports = router
