import React, { Component } from 'react'
import { Button, Link, Wrapper, Text } from './shared/customComponents'
import IconInput from './shared/IconInput.component'
import swal from 'sweetalert2'
import axios from 'axios'
import queryString from 'query-string'

export default class ChangePassword extends Component {
	constructor() {
		super()
		this.state={
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

	changePassword(e) {
		e.preventDefault()
		if (this.state.loading) {
			return
		}

		this.setState({ loading: true })
		const token = localStorage.getItem('token') ? localStorage.getItem('token') : queryString.parse(this.props.location.search).temp
		axios.put(
			'/api/me/password', 
			{ password: this.state.password },
			{ headers: { 'Authorization': token } } 
		).then(({ data }) => {
			this.setState({ loading: false })
			if (data.error) {
				swal(
					'Uh Oh!',
					data.error,
					'error'
				)
			} else if (data.invalidLogin) {
				localStorage.removeItem('token')
				this.props.history.push('/')
			} else {
				swal(
					'Password Changed!',
					null,
					'success'
				)
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
				<form onSubmit={this.changePassword.bind(this)}>
					<IconInput 
						icon="fa-lock" 
						type="password" 
						placeholder="New Password"
						onChange={this.handleChange.bind(this, 'password')}
						value={this.state.password} />
				
					<Button>{ this.state.loading ? 'Loading' : 'Change' }</Button>
				</form>
				
				<Text text-align="center">
					<Link to="/profile">Cancel</Link>
				</Text>

			</Wrapper>
		)
	}
}
