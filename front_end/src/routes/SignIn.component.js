import React, { Component } from 'react'
import { Button, Link, Wrapper, Text, Break, SocialIcon } from './shared/customComponents'
import IconInput from './shared/IconInput.component'
import swal from 'sweetalert2'
import axios from 'axios'


export default class SignIn extends Component {
	constructor() {
		super()
		this.state={
			email: '',
			password: '',
			loading: false,
			facebookUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/sign-in/facebook' : '/sign-in/facebook',
			googleUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/sign-in/google' : '/sign-in/google'
		}
	}

	componentDidMount() {

	}

	// Input handle function
	handleChange(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	signIn(e) {
		e.preventDefault()
		if (this.state.loading) {
			return
		}

		const payload = {
			email: this.state.email,
			password: this.state.password
		}
		this.setState({ loading: true })
		axios.post('/api/sign-in', payload).then(({ data }) => {
			this.setState({ loading: false })
			if (data.error) {
				swal(
					'Uh Oh!',
					data.error,
					'error'
				)
			} else {
				localStorage.setItem('token', data.token)
				this.props.history.push('/profile')
			}
		}).catch(() => {
			this.setState({ loading: false })
			swal(
				'Uh Oh!',
				'Something went wrong. Please try again later.',
				'error'
			)
		})

	}

	render() {
		return (
			<Wrapper>

				<form onSubmit={this.signIn.bind(this)}>
					<IconInput 
						icon="fa-envelope" 
						placeholder="Email" 
						onChange={this.handleChange.bind(this, 'email')}
						value={this.state.email} />
					<IconInput 
						icon="fa-lock" 
						type="password" 
						placeholder="Password"
						onChange={this.handleChange.bind(this, 'password')}
						value={this.state.password} />
					
					<Text text-align="right" styles="margin-top: -5px; font-size: 15px;">
						<Link to="/">Forgot Password?</Link>
					</Text>

					<Button>{this.state.loading ? 'Loading' : 'Sign In'}</Button>
				</form>

				<Text text-align="center">
					Not registered? <Link to="/sign-up">Create an Account</Link>
				</Text>

				<Break />
				<Text text-align="center">
					Or sign in with a social account...
				</Text>

				<Button styles="background: #F3501F;" padded onClick={() => window.location.replace(this.state.googleUrl)}>
					<SocialIcon className="fa fa-google-plus-official"></SocialIcon> Google
				</Button>
				<Button styles="background: #3B5997;" padded onClick={() => window.location.replace(this.state.facebookUrl)}>
					<SocialIcon className="fa fa-facebook-official"></SocialIcon> Facebook
				</Button>

			</Wrapper>
		)
	}
}
