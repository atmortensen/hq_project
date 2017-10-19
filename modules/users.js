const db = require('./db_connect')

module.exports = {}

// Get User Details
module.exports.get = (req, res) => {
	db.query('SELECT * FROM users WHERE id = $1', [req.user.id]).then(({ rows }) => {
		const user = rows[0]
		if (!user) {
			res.send({ invalidLogin: true })
		} else {
			res.json(user)
		}
	}).catch(() => res.send({ error: 'Server error.' }))
}

// Edit User Details
module.exports.put = (req, res) => {
	// req.user.id
}

// Archive User
module.exports.delete = (req, res) => {
	// req.user.id
}
