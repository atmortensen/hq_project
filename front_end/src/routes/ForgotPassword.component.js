import React, { Component } from 'react'
import { Button, Link, Wrapper, Text } from './shared/customComponents'
import IconInput from './shared/IconInput.component'
import swal from 'sweetalert2'
import axios from 'axios'


export default class ForgotPassword extends Component {
	constructor() {
		super()
		this.state={
			email: '',
			loading: false
		}
	}

	componentDidMount() {

	}

	// Input handle function
	handleChange(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	sendEmail(e) {
		e.preventDefault()
		if (this.state.loading) {
			return
		}

		this.setState({ loading: true })
		axios.post('/api/forgot-password', { email: this.state.email }).then(({ data }) => {
			this.setState({ loading: false })
			if (data.error) {
				swal(
					'Uh Oh!',
					data.error,
					'error'
				)
			} else {
				swal(
					'Email Sent!',
					'Login to your email to change your password.',
					'success'
				)
				this.props.history.push('/')
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
				<form onSubmit={this.sendEmail.bind(this)}>
					<IconInput 
						icon="fa-envelope" 
						placeholder="Email"
						onChange={this.handleChange.bind(this, 'email')}
						value={this.state.email} />
				
					<Button>{ this.state.loading ? 'Loading' : 'Reset Password' }</Button>
				</form>
				
				<Text text-align="center">
					<Link to="/">Cancel</Link>
				</Text>

			</Wrapper>
		)
	}
}
