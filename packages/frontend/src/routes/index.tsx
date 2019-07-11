import Hooks from '@react-state-demo/hooks-cache'
import Resource from '@react-state-demo/resource'
import { Button } from 'antd'
import React, { ComponentType, PureComponent } from 'react'
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom'

import Main from './main'

const routes: { [key: string]: ComponentType } = {
	main: Main,
	resources: Resource,
	hooks: Hooks,
}

export default class Routes extends PureComponent {
	render() {
		return (
			<BrowserRouter>
				<div>
					<nav style={{ height: 64, lineHeight: 1, background: '#333' }}>
						{Object.keys(routes).map(path => (
							<NavLink
								key={path}
								style={{
									fontSize: 32,
									padding: 8,
									color: '#fff',
									lineHeight: '64px',
								}}
								activeStyle={{ color: '#13C2C2' }}
								to={`/${path}`}
							>
								{path}
							</NavLink>
						))}
						<Button
							icon="trademark"
							style={{
								color: '#13C2C2',
								float: 'right',
								backgroundColor: '#333',
								border: 'none',
								lineHeight: '64px',
							}}
						/>
					</nav>
					<div style={{ padding: 20 }}>
						<Switch>
							<Route
								path="/"
								exact={true}
								render={() => <Redirect to="/main" />}
							/>
							{Object.keys(routes).map(path => (
								<Route key={path} path={`/${path}`} component={routes[path]} />
							))}
						</Switch>
					</div>
				</div>
			</BrowserRouter>
		)
	}
}
