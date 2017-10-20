const db = require('./db_connect')
const bcrypt = require('bcrypt')

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
	const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	if (!req.body.name || !req.body.email) {
		res.json({ error: 'Please enter name and email.' })
	} else if (!emailValidator.test(req.body.email)) {
		res.json({ error: 'Please enter a valid email.' })
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
	if (!req.body.password) {
		res.json({ error: 'Please enter new password.' })
	} else if (req.body.password.length < 5) {
		res.json({ error: 'Password must be at least 5 characters in length.' })
	} else {
		const hashedPassword = bcrypt.hashSync(req.body.password, 10)
		db.query(
			'UPDATE users SET password = $1 WHERE id = $2 RETURNING *', 
			[ hashedPassword, req.user.id ]
		).then(({ rows }) => {
			res.json(rows[0])
		}).catch(() => res.json({ error: 'Server error.' }))
	}
}

// Archive User
module.exports.delete = (req, res) => {
	db.query('UPDATE users SET archived = $1 WHERE id = $2', [ Date.now(), req.user.id ]).then(() => {
		res.send({ invalidLogin: true })
	}).catch(() => res.json({ error: 'Server error.' }))
}
