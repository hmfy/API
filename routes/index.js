const express = require('express')
const router = express.Router()
const loader = require('../utils/loader')

/* GET home page. */
router.get('/', (req, res) => res.send('hello word!'))

// interface
router.get('/user', loader('user'))
router.get('/upload', loader('upload'))
router.get('/login', loader('login'))

module.exports = router
