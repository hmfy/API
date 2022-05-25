// const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const {expressjwt} = require('express-jwt')
const {token} = require('./config/config')

// require route
const indexRoute = require('./routes/index')
const userRoute = require('./routes/user')
const fileRoute = require('./routes/file')
const {getAddress} = require("./utils/address");

// init app
const app = express()

// 通用
app.use(logger('dev'))
app.use(express.json({limit: '100mb'}))
app.use(express.urlencoded({limit: '100mb', extended: true}))
app.use(cookieParser())

// 跨域
app.all('*', async (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization")
	res.header("Access-Control-Allow-Methods", "*")
	res.header("Cache-Control", "no-store")//304
	next()
});

// ip-经纬度
app.all('*', async (req, res, next) => {
	// 获取ip和地址
	const {lng, lat, address, ip} = await getAddress(req)
	req.USER_LNG = lng
	req.USER_LAT = lat
	req.USER_ADDRESS = address
	req.USER_IP = ip
	next()
})

// jwt
app.use(expressjwt({
	secret: token.signKey,
	algorithms: ['HS256']
}).unless({
	path: token.unRoute,
}))
app.use(function (err, req, res, next) {
	if (err.name === "UnauthorizedError") {
		res.status(200).send({
			code: 1001,
			err: "invalid token"
		});
	} else {
		next(err);
	}
});

// router
app.use('/', indexRoute)
app.use('/user', userRoute)
app.use('/file', fileRoute)

module.exports = app