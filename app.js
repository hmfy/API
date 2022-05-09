const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const {expressjwt} = require('express-jwt')
const {getDecrypt} = require('./utils/verify')
const {token} = require('./config/config')

const indexRoute = require('./routes/index')
const loginRoute = require('./routes/login')
const userRoute = require('./routes/user')
const fileRoute = require('./routes/file')

// until
const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

// 跨域
app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization")
	res.header("Access-Control-Allow-Methods", "*")
	res.header("Cache-Control", "no-store")//304
	next()
});

app.use(expressjwt({
	secret: token.signKey,
	algorithms: ['HS256']
}).unless({
	path: token.unRoute,
}))

// router
app.use('/', indexRoute)
app.use('/login', loginRoute)
app.use('/user', userRoute)
app.use('/file', fileRoute)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	console.log(err)
	res.send({
		code: err.code,
		status: err.status
	})
})

module.exports = app
