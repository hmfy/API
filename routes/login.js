const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => res.send('login home!'))
router.get('/info', (req, res) => res.send('login-info'))

// interface

module.exports = router
