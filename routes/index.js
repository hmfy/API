const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => res.send('hello word!'))
router.get('/info', (req, res) => res.send('index-info'))

module.exports = router
