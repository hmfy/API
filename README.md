# 基于 express，knex，redis
> 支持 jwt，支持通过 redis 控制账户是否有效
> 通过从 sql 下直接写 js 文件扩展需要的接口
### 步骤：
##### 注册自己的 ssl 证书
##### 修改 app.js 内证书路径
```javascript
const privateKey = fs.readFileSync('/path/your.key', 'utf8')
const certificate = fs.readFileSync('/path/your.crt', 'utf8')
```
##### 根目录下增加一个 /config/config.js 文件
```javascript
const path = require('path')

// redis 配置
const redisOpt = {
    password: 'your-password',
}

// knex 配置
const database = {
    client: 'mysql2',
    connection: {
        host: "your-host",
        user: "your-user",
        password: "your-password",
        port: 3306,
        database: "your-db"
    },
    debug: false,
    pool: {
        min: 2,
        max: 10
    },
    acquireTimeout: 10000
}

// jwt 配置
const token = {
    signKey: 'blog_fy_access_token', // 随意设置
    signTime: 60 * 60 * 3, //s, 这里设置 3 小时
    header: 'Authorization', // 固定
    unRoute: [] // jwt 不需要验证的接口 例如 ’/path/file‘
}

// node-rsa 生成的 key
const key = `xxxxx`

// 高德地图 ip 转经纬度服务的 key
const mapKey = 'xxx'

module.exports = {
    port: 3000,
    sqlPath: path.resolve(__dirname, '../sql'),
    database: database,
    token,
    key,
    mapKey,
    redisOpt
}
```
##### 以上配置修改好后，启动项目 npm run start