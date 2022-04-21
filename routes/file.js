const compress = require(  '../utils/compression');

const path = new Map()

// 图片压缩
// compress({ quality: 50, name: 'guohuimian.jpg' })

const upload = (req, res) => {
    res.send('upload')
}

path.set('upload', upload)
module.exports.path = path
