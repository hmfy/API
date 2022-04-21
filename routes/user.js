const path = new Map()

const user = (req, res) => {
    res.send('user')
}

path.set('user', user)
module.exports.path = path
