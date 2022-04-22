const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => res.send('file home!'))
router.get('/info', (req, res) => res.send('file-info'))

module.exports = router
