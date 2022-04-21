const fs = require('fs');
const path = require('path');

const globalConfig = {}

const config = fs.readFileSync(path.resolve(__dirname, './server.conf'))

const configArr = config.toString().split('\n')

for (const string of configArr) {
    const [key, value] = string.trim().split('=')
    globalConfig[key] = value
}

module.exports = globalConfig
