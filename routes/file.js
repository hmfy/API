const express = require('express')
const { uuid } = require('../utils/tools')
const path = require('path')
const fs = require('fs')
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

function compressFileList (fileList, needSize) {
	fileList.forEach(({ filename, size, path } ) => {
		if ( size / 1000 / 1000 > 3 ) return false // 大于3M压缩会崩溃，不压缩 todo 后面再想办法
		if (needSize > size) return false // 不需要压缩
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
}
/* GET file page. */
router.get('/', (req, res) => res.send('file interface!'))
router.post('/upload', uploadConfig.array('files', 99), async (req, res) => {
	// 每份文件都要压缩
	const needSize = 300 * 1024
	compressFileList(req.files, needSize)

	res.send({
		list: req.files.map(ele => {
			const zipPath = path.resolve(__dirname, '../files/zip')
			let exists = false
			try {
				fs.accessSync(zipPath + '/' + ele.filename) // 有压缩
				exists = true
			} catch (e) {
				exists = false
			}
			return {
				path: (exists ? '/zip/' : '/files/') + ele.filename
			}
		})
	})
})
router.post('/zip2', uploadConfig.array('photos', 6), async (req, res) => {
	const needSize = req.body['compressVal'] || 400 * 1024
	compressFileList(req.files, needSize)
	res.send(req.files)
})
router.get('/download2', ({ query }, res) => {
	const { type = 'origin', path: filePath } =  query
	let downloadPath = ''
	if (!filePath) {
		return res.send(`must give a filePath!`)
	}

	const zipPath = path.resolve(__dirname, '../files/zip')
	let exists = false
	try {
		fs.accessSync(zipPath + '/' + filePath) // 有压缩
		exists = true
	} catch (e) {
		exists = false
	}

	if (type === 'zip') {
		downloadPath = path.resolve(__dirname, exists ? '../files/zip' : '../files/files')
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
