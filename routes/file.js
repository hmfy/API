const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const compress = require(path.resolve(__dirname, '../utils/compression'))
const router = express.Router()
const uploadConfig = multer({
	storage: multer.diskStorage({
		destination: path.resolve(__dirname, '../files/files/'),
		filename (req, file, save) {
			save(null, file.originalname)
		}
	})
})

/* GET home page. */
router.get('/', (req, res) => res.send('file home!'))
router.post('/upload', (req, res) => {
	debugger
})
router.post('/zip', uploadConfig.array('photos', 6), (req, res) => {
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
router.get('/download', ({ query }, res) => {
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
