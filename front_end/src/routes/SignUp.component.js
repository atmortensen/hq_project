import React, { Component } from 'react'
import { Button, Link, Wrapper, Text } from './shared/customComponents'
import IconInput from './shared/IconInput.component'
import swal from 'sweetalert2'
import axios from 'axios'


export default class SignUp extends Component {
	constructor() {
		super()
		this.state={
			name: '',
			email: '',
			password: '',
			loading: false
		}
	}

	componentDidMount() {

	}

	// Input handle function
	handleChange(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	signUp(e) {
		e.preventDefault()
		if (this.state.loading) {
			return
		}

		const payload = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password
		}
		this.setState({ loading: true })
		axios.post('/api/sign-up', payload).then(({ data }) => {
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
				<form onSubmit={this.signUp.bind(this)}>
					<IconInput 
						icon="fa-user" 
						placeholder="Name" 
						onChange={this.handleChange.bind(this, 'name')}
						value={this.state.name} />
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
				

					<Button>{ this.state.loading ? 'Loading' : 'Sign Up' }</Button>
				</form>
				
				<Text text-align="center">
					<Link to="/">Cancel</Link>
				</Text>

			</Wrapper>
		)
	}
}
