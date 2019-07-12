import React, { createContext, ReactNode } from 'react'

type Listener = () => void

export class Container<T> {
	_listeners: Listener[] = []
	state!: T

	setState = (
		updater: Partial<T> | ((prevState: T) => Partial<T>),
		callback?: () => void
	) => {
		let nextState: Partial<T> | null = null
		if (typeof updater === 'function') {
			nextState = updater(this.state)
		} else {
			nextState = updater
		}

		if (nextState === null) {
			if (typeof callback === 'function') {
				callback()
			}
			return
		}

		this.state = { ...this.state, ...nextState }

		const promises = this._listeners.map(f => f())

		Promise.all(promises).then(() => {
			if (typeof callback === 'function') {
				callback()
			}
		})
	}

	subscribe = (f: Listener) => {
		this._listeners.push(f)
	}

	unsubscribe = (f: Listener) => {
		this._listeners = this._listeners.filter(fn => fn !== f)
	}
}

interface ContainerType<T> {
	new (...args: any[]): Container<T>
}

interface SubscribeProps {
	to: (ContainerType<any> | Container<any>)[]
	children(...instances: Container<any>[]): React.ReactNode
}

const StateContext = createContext<Map<
	ContainerType<any>,
	Container<any>
> | null>(null)
const DUMMY_STATE = {}

export class Subscribe extends React.Component<SubscribeProps> {
	state = {}
	unmount = false
	instances: Array<Container<any>> = []

	componentWillUnmount() {
		this.unmount = true
		this._unsubscribe()
	}

	_unsubscribe = () => {
		this.instances.forEach(c => c.unsubscribe(this.onUpdate))
	}

	onUpdate = () => {
		return new Promise(resolve => {
			if (!this.unmount) {
				this.setState(DUMMY_STATE, resolve)
			} else {
				resolve()
			}
		})
	}

	_createInstance = (
		map: Map<ContainerType<any>, Container<any>> | null,
		containers: (ContainerType<any> | Container<any>)[]
	) => {
		this._unsubscribe()

		if (map === null) {
			throw new Error(
				'You must wrap your <Subscribe> components with a <Provider>'
			)
		}

		const instances = containers.map(c => {
			let instance
			if (c instanceof Container) {
				instance = c
			} else {
				instance = map.get(c)
				if (!instance) {
					instance = new c()
					map.set(c, instance)
				}
			}
			instance.unsubscribe(this.onUpdate)
			instance.subscribe(this.onUpdate)

			return instance
		})
		this.instances = instances
		return instances
	}

	render() {
		return (
			<StateContext.Consumer>
				{map =>
					this.props.children.apply(
						null,
						this._createInstance(map, this.props.to)
					)
				}
			</StateContext.Consumer>
		)
	}
}

export const Provider = ({
	inject,
	children,
}: {
	inject?: Array<Container<any>>
	children: ReactNode
}) => {
	return (
		<StateContext.Consumer>
			{parentMap => {
				let map: Map<ContainerType<any>, Container<any>> = new Map(
					parentMap as any
				)
				if (inject) {
					inject.forEach(c => {
						map.set(c.constructor as ContainerType<any>, c)
					})
				}

				return (
					<StateContext.Provider value={map}>{children}</StateContext.Provider>
				)
			}}
		</StateContext.Consumer>
	)
}

export interface ProviderProps {
	inject?: Container<any>[]
	children: React.ReactNode
}
