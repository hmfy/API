const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('logined');
});

router.get('/a', function(req, res, next) {
    res.send('login-a');
});

module.exports = router;
