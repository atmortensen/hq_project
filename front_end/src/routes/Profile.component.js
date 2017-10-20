import React, { Component } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`

`

export default class ChangeMe extends Component {
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

			</Wrapper>
		)
	}
}
