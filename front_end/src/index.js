import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './Routes'
import { injectGlobal } from 'styled-components'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reducers from './ducks'

// Global styles to be used sparingly...
// eslint-disable-next-line
injectGlobal`
	* {
		font-family: sans-serif;
	}
`

const myStore = applyMiddleware(thunk)(createStore)
const rootReducer = combineReducers(reducers)

ReactDOM.render(
	<Provider store={myStore(rootReducer)}>
		<Routes />
	</Provider>,
	document.getElementById('root')
)
