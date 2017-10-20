const db = require('./db_connect')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {}

// Sign In
module.exports.signIn = (req, res) => {
	if (!req.body.password || !req.body.email) {
		res.json({ error: 'Please enter email and password.' })
	} else {
		db.query('SELECT * FROM users WHERE email = $1 AND archived IS NULL', [req.body.email]).then(({ rows }) => {
			const user = rows[0]
			if (!user) {
				res.json({ error: 'User with that email address could not be found.' })
			} else if (bcrypt.compareSync(req.body.password, user.password)) {
				res.json({ token: jwt.sign({ id: user.id }, process.env.JWT_SECRET) })
			} else {
				res.json({ error: 'Incorrect password. Try resetting your password or logging in with Facebook or Google.' })
			}
		}).catch(() => res.json({ error: 'Server error.' }))
	}
}

// Sign Up
module.exports.signUp = (req, res) => {
	const { email, password, name } = req.body

	const emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	if (!email || !password || !name) {
		res.json({ error: 'Please fill out all fields to continue.' })
	} else if (password.length < 5) {
		res.json({ error: 'Password must be at least 5 characters in length.' })
	} else if (!emailValidator.test(email)) {
		res.json({ error: 'Please enter a valid email.' })
	} else {
		db.query('SELECT * FROM users WHERE email = $1 AND archived IS NULL', [email]).then(({ rows: existingUser }) => {
			if (existingUser[0]) {
				res.json({ error: 'This email address is already being used.' })
			} else {
				const hashedPassword = bcrypt.hashSync(password, 10)
				db.query(
					'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id', 
					[ email, hashedPassword, name ]
				).then(({ rows: newUser }) => {
					res.json({ token: jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET) })
				}).catch(() => res.json({ error: 'Server error.' }))
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

// Get Auth Token
module.exports.getToken = (req, res) => {
	jwt.verify(req.body.token, process.env.JWT_SECRET, (err, payload) => {
		if (err) {
			res.redirect('/')
		} else {
			res.json({ token: jwt.sign({ id: payload.id }, process.env.JWT_SECRET) })
		}
	})
}


// db.query(`
// 	DROP TABLE IF EXISTS users;
// 	CREATE TABLE users (
// 		id SERIAL PRIMARY KEY NOT NULL,
// 		password TEXT,
// 		email TEXT NOT NULL,
// 		name TEXT NOT NULL,
// 		facebook_id TEXT,
// 		google_id TEXT,
// 		archived TEXT
// 	)
// `)
