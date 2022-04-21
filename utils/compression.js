const images = require("images")
const path = require("path")

const ZIP_PATH = path.resolve(__dirname, `../files/zip`)
const IMG_PATH = path.resolve(__dirname, `../files/images`)
const compress = ({ name, quality }) => images(IMG_PATH + '/' + name).save(ZIP_PATH + '/' + name, {quality})
module.exports = compress
