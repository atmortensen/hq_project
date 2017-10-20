import React, { Component } from 'react'
import { Button, Wrapper, Link, Text, SocialIcon, Break } from './shared/customComponents'
import styled from 'styled-components'
import IconInput from './shared/IconInput.component'
import { getProfile, deleteProfile, updateProfile } from './shared/profileHelpers'

const ControlButtons = styled.div`
	display: flex;
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
			facebookUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/sign-in/facebook' : '/sign-in/facebook',
			googleUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/sign-in/google' : '/sign-in/google'
		}
	}

	componentDidMount() {
		getProfile.apply(this)
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
		if (this.state.loading) {
			return <Wrapper><Text styles="text-align: center;">Loading...</Text></Wrapper>
		}

		return (
			<Wrapper>
				<form>
					<IconInput 
						icon="fa-user" 
						onChange={this.handleChange.bind(this, 'name')}
						value={this.state.name} />
					<IconInput 
						icon="fa-envelope" 
						onChange={this.handleChange.bind(this, 'email')}
						value={this.state.email} />
				</form>

				<Text text-align="right" styles="margin-top: -5px; font-size: 15px;">
					<Link to="/change-password">Change/Add Password</Link>
				</Text>

				<ControlButtons>
					<Button styles="background: #5AB75F;" onClick={updateProfile.bind(this)}>Save</Button>
					<Button styles="margin: 0 10px; background: #5AC1DA;" onClick={getProfile.bind(this)}>Reset</Button>
					<Button styles="background: #DB524C;" onClick={deleteProfile.bind(this)}>Delete</Button>
				</ControlButtons>
				

				<Break />
				<Text text-align="center">
					Linked social accounts...
				</Text>

				{this.state.googleId && 
					<IconInput 
						icon="fa-google-plus-official" 
						disabled
						value={this.state.googleId} />
				}
				
				{!this.state.googleId && 
					<Button 
						styles="background: #F3501F;" 
						padded onClick={() => window.location.replace(this.state.googleUrl)}>
						<SocialIcon className="fa fa-google-plus-official"></SocialIcon> Google
					</Button>
				}
				
				{this.state.facebookId && 
					<IconInput 
						icon="fa-facebook-official" 
						disabled
						value={this.state.facebookId} />
				}

				{!this.state.facebookId && 
					<Button 
						styles="background: #3B5997; margin-bottom: 10px;" 
						padded onClick={() => window.location.replace(this.state.facebookUrl)}>
						<SocialIcon className="fa fa-facebook-official"></SocialIcon> Facebook
					</Button>
				}
							
				<Text styles="margin-top: -5px; font-size: 15px;">
					* Social accounts must use the same email address to be linked.
				</Text>
				
				<Button onClick={this.logout.bind(this)}>Logout</Button>
				
			</Wrapper>
		)
	}
}
