const db = require('./db_connect')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {}

// Sign In
module.exports.signIn = (req, res) => {
	if (!req.body.password || !req.body.email) {
		res.json({ error: 'Please enter email and password.' })
	} else {
		db.query('SELECT * FROM users WHERE email = $1', [req.body.email]).then(({ rows }) => {
			const user = rows[0]
			if (!user) {
				res.json({ error: 'User with that email address could not be found.' })
			} else if (bcrypt.compareSync(req.body.password, user.password)) {
				res.json({ token: jwt.sign({ id: user.id }, process.env.JWT_SECRET) })
			} else {
				res.json({ error: 'Incorrect email or password.' })
			}
		}).catch(() => res.json({ error: 'Server error.' }))
	}
}

// Sign Up
module.exports.signUp = (req, res) => {
	const { email, password, name } = req.body
	if (!email || !password || !name) {
		res.json({ error: 'Please fill out all fields.' })
	} else {
		db.query('SELECT * FROM users WHERE email = $1', [email]).then(({ rows: existingUser }) => {
			if (existingUser[0]) {
				res.json({ error: 'This email address is already being used.' })
			} else {
				const hashedPassword = bcrypt.hashSync(password, 10)
				db.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id', [ email, hashedPassword, name ])
					.then(({ rows: newUser }) => {
						res.json({ token: jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET) })
					})
			}
		}).catch(() => res.json({ error: 'Server error.' }))
	}
}

// Auth Middleware
module.exports.secure = (req, res, next) => {
	jwt.verify(req.header('Authorization'), process.env.JWT_SECRET, (err, payload) => {
		if (err) {
			res.json({ invalidLogin: true })
		} else {
			req.user = payload
			next()
		}
	})
}


// db.query(`
// 	DROP TABLE IF EXISTS users;
// 	CREATE TABLE users (
// 		id SERIAL PRIMARY KEY NOT NULL,
// 		password TEXT NOT NULL,
// 		email TEXT NOT NULL,
// 		name TEXT NOT NULL,
// 		facebook_id TEXT,
// 		google_id TEXT,
// 		archived BOOLEAN DEFAULT false NOT NULL
// 	)
// `)