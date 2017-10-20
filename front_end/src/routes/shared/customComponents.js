import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

export const Head = styled.h1`

`

export const Wrapper = styled.div`
	width: 300px;
	@media (max-width: 350px) {
		width: 100%;
		padding: 10px;
	}
`

export const Input = styled.input`
	border: none;
	background: #3A4149;
	color: #ACADAD;
	padding: 15px 15px 13px 15px;
	width: 100%;
	font-size: 18px;
	&:focus {
		outline: solid 2px #ACADAD;
	}
`

export const Button = styled.button`

`

export const Link = styled(RouterLink)`

`
