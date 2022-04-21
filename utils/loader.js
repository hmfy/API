const fs = require('fs')
const path = require('path')
const { api: API_PATH } = require('../config/config')

const apiMap = new Map()

const API_LIST = fs.readdirSync(path.resolve(__dirname, '../' + API_PATH))

for (const fileName of API_LIST) {
    const { path } = require('../' + API_PATH + '/' + fileName)
    if (!path) continue
    for (const [key, value] of path) {
        if (!apiMap.get(key)) {
            apiMap.set(key, value)
        }
    }
}

module.exports = fileName => apiMap.get(fileName)
