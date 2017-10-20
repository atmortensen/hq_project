import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

export const Break = styled.div`
	width: 100%;
	background: #666;
	height: 1px;
	margin: 25px 0; 
`

export const Text = styled.p`
	color: #ACADAD;
	text-align: ${ props => props['text-align'] };
	margin: 10px 0;
	${ props => props.styles }
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
	width: 100%;
	color: #fff;
	text-transform: uppercase;
	height: 50px;
	border: none;
	background: #E94C86;
	font-size: 20px;
	letter-spacing: 1px;
	cursor: pointer;
	vertical-align: center;
	margin: ${ props => props.padded ? '5px 0' : '0' };
	${ props => props.styles }
`

export const Link = styled(RouterLink)`
	color: #f2f2f2;
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
`
