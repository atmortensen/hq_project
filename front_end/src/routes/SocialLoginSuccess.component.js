import React, { Component } from 'react'
import { Wrapper, Text } from './shared/customComponents'
import swal from 'sweetalert2'
import axios from 'axios'
import queryString from 'query-string'


export default class SignUp extends Component {

	componentDidMount() {
		const query = queryString.parse(this.props.location.search)
		axios.post('/api/social-token', { token: query.temp }).then(({ data }) => {
			localStorage.setItem('token', data.token)
			this.props.history.push('/profile')
		}).catch(() => {
			this.props.history.push('/')
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
				<Text styles="text-align: center;">Redirecting...</Text>
			</Wrapper>
		)
	}
}
