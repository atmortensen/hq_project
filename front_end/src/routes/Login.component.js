import React, { Component } from 'react'
// import styled from 'styled-components'
import { Head, Button, Link, Wrapper } from './shared/customComponents'
import IconInput from './shared/IconInput.component'


export default class Login extends Component {
	constructor() {
		super()
		this.state={

		}
	}

	componentDidMount() {

	}

	// Input handle function
	handleChange(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	render() {
		return (
			<Wrapper>

				<Head>Welcome to the Loginer</Head>

				<IconInput icon="fa-user" placeholder="Email" onChange={({ target }) => console.log(target.value)} />
				<IconInput icon="fa-lock" type="password" placeholder="Password" />

				<Button>Login</Button>
				<Link to="/">Forgot Password?</Link> | <Link to="/">Sign Up</Link>

				<Button>Facebook</Button>
				<Button>Google</Button>

			</Wrapper>
		)
	}
}
