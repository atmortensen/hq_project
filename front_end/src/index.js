import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './Routes'
import { injectGlobal } from 'styled-components'
import '../node_modules/font-awesome/css/font-awesome.min.css'

// Global styles to be used sparingly...
// eslint-disable-next-line
injectGlobal`
	* {
		font-family: sans-serif;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	body {
		background: #303038;
		min-height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`

ReactDOM.render(<Routes />,	document.getElementById('root'))
