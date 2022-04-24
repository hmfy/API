const images = require("images")
const path = require("path")
const fs = require("fs")

const ZIP_PATH = path.resolve(__dirname, `../files/zip`)
const compress = ({ imgPath, name, needSize, scale, quality, backupQuality }) => {
	const imgInfo = images(imgPath)
	const { width, height } = imgInfo.size()
	// 默认用尺寸压缩
	const scaleW = scale * width
	const scaleH = scale * height
	imgInfo.size(scaleW).save(ZIP_PATH + '/' + name, { quality })
	let { size } = fs.statSync(ZIP_PATH + '/' + name)
	if (size > needSize && (scaleW > 500 && scaleH > 500)) {
		backupQuality -= 5
		if (backupQuality < 6) {
			// 图片质量无法压缩， 继续压缩宽高
			compress({
				imgPath: ZIP_PATH + '/' + name,
				name,
				scale: Math.sqrt(needSize/ size),
				needSize,
				quality,
				backupQuality
			})
		} else {
			compress({
				imgPath: ZIP_PATH + '/' + name,
				name,
				needSize,
				scale,
				quality: backupQuality,
				backupQuality
			})
		}
	}
}
module.exports = compress
