const express = require('express')
const { uuid } = require('../utils/tools')
const path = require('path')
const multer = require('multer')
const compress = require(path.resolve(__dirname, '../utils/compression'))
const router = express.Router()
const uploadConfig = multer({
	storage: multer.diskStorage({
		destination: path.resolve(__dirname, '../files/files/'),
		filename (req, file, save) {
			save(null, uuid() + '.' + file.originalname.split('.').slice(-1))
		}
	})
})

/* GET file page. */
router.get('/', (req, res) => res.send('file interface!'))
router.post('/upload', uploadConfig.array('photos', 6), (req, res) => {
	res.send({
		list: req.files.map(ele => ({path: '/files/' + ele.filename}))
	})
})
router.post('/zip2', uploadConfig.array('photos', 6), (req, res) => {
	const needSize = req.body['compressVal'] || 400 * 1024
	req.files.forEach(({ filename, size, path } ) => {
		if (needSize > size) return // 不需要压缩
		let scale = Math.sqrt(needSize / size)
		let backupQuality = Math.floor(needSize / size * 100) + 5
		compress({
			imgPath: path,
			name: filename,
			scale,
			backupQuality,
			quality: 80,
			needSize
		})
	})
	res.send(req.files)
})
router.get('/download2', ({ query }, res) => {
	const { type = 'origin', path: filePath } =  query
	let downloadPath = ''
	if (!filePath) {
		return res.send(`must give a filePath!`)
	}
	if (type === 'zip') {
		downloadPath =  path.resolve(__dirname, '../files/zip')
	} else {
		downloadPath =  path.resolve(__dirname, '../files/files')
	}
	try {
		res.download(downloadPath + '/' + filePath)
	}
	catch (err) {
		res.send('file download failed!')
	}
})
module.exports = router
