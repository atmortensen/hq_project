import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './routes/Login.component'
import SignUp from './routes/SignUp.component'
import Profile from './routes/Profile.component'
import SocialLoginSuccess from './routes/SocialLoginSuccess.component'

export default class Routes extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route exact path="/sign-up" component={SignUp} />
					<Route exact path="/profile" component={Profile} />
					<Route exact path="/social-login-success" component={SocialLoginSuccess} />
					<Route render={() => <h2>Page not found!</h2>} />
				</Switch>
			</BrowserRouter>
		)
	} 
}
