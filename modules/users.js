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
	if (!req.body.name || !req.body.email) {
		res.json({ error: 'Please enter name and email.' })
	} else {
		db.query(
			'UPDATE users SET email = $1, name = $2 WHERE id = $3 RETURNING *', 
			[ req.body.email, req.body.name, req.user.id ]
		).then(({ rows }) => {
			res.json(rows[0])
		}).catch(() => res.json({ error: 'Server error.' }))
	}
}

// Change Password
module.exports.changePassword = (req, res) => {
	
}

// Archive User
module.exports.delete = (req, res) => {
	db.query('UPDATE users SET archived = $1 WHERE id = $2', [ Date.now(), req.user.id ]).then(() => {
		res.send({ invalidLogin: true })
	}).catch(() => res.json({ error: 'Server error.' }))
}
