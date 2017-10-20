import React, { Component } from 'react'
import styled from 'styled-components'
import { Button, Link, Wrapper, Text, Break } from './shared/customComponents'
import IconInput from './shared/IconInput.component'


export default class SignUp extends Component {
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

				<IconInput icon="fa-user" placeholder="Name" onChange={({ target }) => console.log(target.value)} />
				<IconInput icon="fa-envelope" placeholder="Email" onChange={({ target }) => console.log(target.value)} />
				<IconInput icon="fa-lock" type="password" placeholder="Password" />

				<Button>Sign Up</Button>
				<Text text-align="center">
					<Link to="/">Cancel</Link>
				</Text>

			</Wrapper>
		)
	}
}
