const { redisOpt } = require('./config/config')
const redis = require("redis");

// 连接 redis
const client = redis.createClient(redisOpt);
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

module.exports = {
    client,
    async setUserInfo ({ userID, token, expiresTime }) {
        await client.set(String(userID), token, {
            EX: expiresTime
        }) // 标记 token 的所属用户，方便通过 userID 直接下线某一用户
        await client.set(token, userID, {
            EX: expiresTime
        })
    },
    async getUserInfo (token = '') {
        return await client.get(token) || 0
    }
}
