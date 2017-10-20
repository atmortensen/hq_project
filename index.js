const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const authentication = require('./modules/authentication')
const users = require('./modules/users')
const facebook = require('./modules/facebook')
const google = require('./modules/google')

require('dotenv').config()
app.use(bodyParser.json())
app.use(express.static(__dirname + '/front_end/build'))

app.post('/api/sign-in', authentication.signIn)
app.post('/api/sign-up', authentication.signUp)
app.post('/api/forgot-password')  

app.get('/sign-in/facebook', facebook.authenticate, facebook.signIn)
app.get('/sign-in/google', google.authenticate, google.signIn)
app.post('/api/social-token', authentication.getToken)

app.get('/api/me', authentication.secure, users.get)
app.put('/api/me', authentication.secure, users.put)
app.put('/api/me/password', authentication.secure, users.changePassword)
app.delete('/api/me', authentication.secure, users.delete)

app.listen(process.env.PORT, () => {
	console.log('Listening on port ' + process.env.PORT)
})
