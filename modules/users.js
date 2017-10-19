const db = require('./db_connect')

module.exports = {}

// Get User Details
module.exports.get = (req, res) => {
	db.query('SELECT * FROM users WHERE id = $1 AND archived IS NULL', [req.user.id]).then(({ rows }) => {
		const user = rows[0]
		if (!user) {
			res.send({ invalidLogin: true })
		} else {
			res.json(user)
		}
	}).catch(() => res.json({ error: 'Server error.' }))
}

// Edit User Details
module.exports.put = (req, res) => {
	db.query('SELECT * FROM users WHERE id = $1 AND archived IS NULL', [req.user.id]).then(({ rows }) => {
		const user = rows[0]
		if (!user) {
			res.send({ invalidLogin: true })
		} else {
			res.json(user)
		}
	}).catch(() => res.json({ error: 'Server error.' }))
}

// Archive User
module.exports.delete = (req, res) => {
	db.query('UPDATE users SET archived = $1 WHERE id = $2', [ Date.now(), req.user.id ]).then(() => {
		res.send({ invalidLogin: true })
	}).catch(() => res.json({ error: 'Server error.' }))
}
