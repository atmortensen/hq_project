import React, { Component } from 'react'
import styled from 'styled-components'
import { Input } from './customComponents'

const Wrapper = styled.div`
	display: flex;
	width: 100%;
	margin: 10px 0;
	
`
const Icon = styled.div`
	width: 55px;
	background: #363B41;
	color: #ACADAD;
	display: flex;
	justify-content: center;
	align-items: center;
`

export default class IconInput extends Component {

	render() {
		return (
			<Wrapper>
				<Icon>
					<i className={`fa ${ this.props.icon } fa-2x`} />
				</Icon>
				<Input {...this.props} />
			</Wrapper>
		)
	}
}
