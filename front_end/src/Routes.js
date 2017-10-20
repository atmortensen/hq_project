import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import SignIn from './routes/SignIn.component'
import SignUp from './routes/SignUp.component'
import Profile from './routes/Profile.component'
import SocialLoginSuccess from './routes/SocialLoginSuccess.component'

export default class Routes extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={insecure(SignIn)} />
					<Route exact path="/sign-up" component={insecure(SignUp)} />
					<Route exact path="/profile" component={secure(Profile)} />
					<Route exact path="/social-login-success" component={insecure(SocialLoginSuccess)} />
					<Route render={() => <h2>Page not found!</h2>} />
				</Switch>
			</BrowserRouter>
		)
	} 
}

// Authorization HOCs
function secure(WrappedComponent) {
	return class Secured extends Component {

		componentDidMount() {
			if (!localStorage.getItem('token')) {
				this.props.history.push('/')
			}
		}

		render() {
			return <WrappedComponent {...this.props} />
		}
	}
}

function insecure(WrappedComponent) {
	return class Secured extends Component {

		componentDidMount() {
			if (localStorage.getItem('token')) {
				this.props.history.push('/profile')
			}
		}

		render() {
			return <WrappedComponent {...this.props} />
		}
	}
}
