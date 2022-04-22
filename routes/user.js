const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => res.send('user home!'))
router.get('/info', (req, res) => res.send('user-info!'))

module.exports = router
