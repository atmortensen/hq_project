const db = require('./db_connect')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sgMail = require('@sendgrid/mail')

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
			} else if (user.password && bcrypt.compareSync(req.body.password, user.password)) {
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

	const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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
		if (err || !payload.id) {
			res.redirect('/')
		} else {
			res.json({ token: jwt.sign({ id: payload.id }, process.env.JWT_SECRET) })
		}
	})
}

// Forgot Password
module.exports.forgotPassword = (req, res) => {
	if (!req.body.email) {
		res.json({ error: 'Please enter an email.' })
	} else {
		db.query('SELECT * FROM users WHERE email = $1 AND archived IS NULL', [req.body.email]).then(({ rows }) => {
			const user = rows[0]
			if (!user) {
				res.json({ error: 'User with that email address could not be found.' })
			} else {
				const tempToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' })
				const frontEndUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://hq-project.herokuapp.com/'
				sgMail.setApiKey(process.env.SENDGRID_SK)
				const msg = {
					to: req.body.email,
					from: 'HQ Project <alextmortensen@gmail.com>',
					subject: 'Password Reset',
					html: `
						<p>Click on the link below to reset your password.</p>
						<a href="${ frontEndUrl }change-password?temp=${ tempToken }">Reset Password</a>
						<p>This link will expire in 30 minutes. If you did not request this email you can ignore it.
					`
				}
				sgMail.send(msg, false, (err) => {
					if (err) {
						res.json({ error: 'There was a problem sending the email.' })
					} else {
						res.end()
					}
				})
			}
		}).catch(() => res.json({ error: 'Server error.' }))
	}
}
