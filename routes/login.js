const path = new Map()

const login = (req, res) => {
    res.send('login')
}

path.set('login', login)
module.exports.path = path
