import React, { Component } from 'react'
import { Button, Wrapper, Link, Text } from './shared/customComponents'
import styled from 'styled-components'
import IconInput from './shared/IconInput.component'
import swal from 'sweetalert2'
import axios from 'axios'

const Logout = styled.span`
	color: #fff;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`

export default class Profile extends Component {
	constructor() {
		super()
		this.state={
			name: '',
			email: '',
			googleId: '',
			facebookId: '',
			loading: false,
			editing: false
		}
	}

	componentDidMount() {
		this.setState({ loading: true })
		axios.get('/api/me', { headers: { 'Authorization': localStorage.getItem('token') } }).then(({ data }) => {
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
				this.setState({
					name: data.name || '',
					email: data.email || '',
					googleId: data.google_id || '',
					facebookId: data.facebook_id || ''
				})
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

	// Input handle function
	handleChange(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	logout() {
		localStorage.removeItem('token')
		this.props.history.push('/')
	}

	render() {
		return (
			<Wrapper>
				<form>
					<IconInput 
						icon="fa-user" 
						disabled={!this.state.editing}
						onChange={this.handleChange.bind(this, 'name')}
						value={this.state.name} />
					<IconInput 
						icon="fa-envelope" 
						disabled={!this.state.editing}
						onChange={this.handleChange.bind(this, 'email')}
						value={this.state.email} />
					<IconInput 
						icon="fa-google-plus-official" 
						disabled={!this.state.editing}
						onChange={this.handleChange.bind(this, 'googleId')}
						value={this.state.googleId} />
					<IconInput 
						icon="fa-facebook-official" 
						disabled={!this.state.editing}
						onChange={this.handleChange.bind(this, 'facebookId')}
						value={this.state.facebookId} />

					<Text text-align="right" styles="margin-top: -5px; font-size: 15px;">
						<Link to="/">Change/Add Password</Link>
					</Text>

					<Button>{ this.state.loading ? 'Loading' : 'Edit Profile' }</Button>
				</form>
				
				<Text text-align="center">
					<Logout onClick={this.logout.bind(this)}>Logout</Logout>
				</Text>

			</Wrapper>
		)
	}
}
