import { useEffect, useState } from 'react'

const cache = new Map<any, Map<string, any>>()

const translateMapToArr = <T>(map: Map<string, T>, nameKey: string) => {
	const ret: Array<T> = []
	map.forEach((value, key) => {
		ret.push({
			...value,
			[nameKey]: key,
		})
	})

	return ret
}

const translateArrToMap = <T>(arr: Array<T>, nameKey: string) => {
	const map = new Map<string, T>()
	arr.forEach(item => {
		const key = (item as any)[nameKey]
		if (typeof key === 'string') {
			map.set(key, item)
		}
	})
	return map
}

export const useCacheList = <T, V>(
	promise: (variables?: V) => Promise<T[]>,
	options?: {
		key?: string
		variables?: V
		nameKey?: string
	}
): {
	loading: boolean
	data: T[]
	error: typeof Error | null
} => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const { variables = undefined, nameKey = 'id', key = promise } = options || {}

	const cacheData = async () => {
		setLoading(true)

		let map = cache.get(key)
		if (!map) {
			try {
				const data = await promise(variables)
				cache.set(key, translateArrToMap<T>(data, nameKey))
			} catch (e) {
				setError(e)
			}
		}
		setLoading(false)
	}

	useEffect(() => {
		cacheData()
	}, [])

	const data = cache.get(key) as Map<string, T>

	return {
		loading,
		data: data === undefined ? [] : translateMapToArr<T>(data, nameKey),
		error,
	}
}

export const useCacheItem = <T, V>(
	promise: (variables?: V) => Promise<T>,
	options?: {
		id?: string
		key?: string
		variables?: V
		nameKey?: string
	}
): {
	loading: boolean
	data: T | undefined
	error: typeof Error | null
} => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const { id = null, key = promise, variables = undefined, nameKey = 'id' } =
		options || {}
	const [currentId, setCurrentId] = useState(id)

	const cacheData = async () => {
		setLoading(true)

		let map = cache.get(key)
		if (map) {
			let item = null
			if (currentId) {
				item = map.get(currentId)
			}
			if (!item) {
				try {
					const data = await promise(variables)
					const newId = (data as any)[nameKey] || id
					setCurrentId(newId)
					map.set(newId, data)
					cache.set(key, map)
				} catch (e) {
					setError(e)
				}
			}
		} else {
			try {
				const data = await promise(variables)
				map = new Map()
				const newId = (data as any)[nameKey] || id
				setCurrentId(newId)
				map.set(newId, data)
				cache.set(key, map)
			} catch (e) {
				setError(e)
			}
		}
		setLoading(false)
	}

	useEffect(() => {
		cacheData()
	}, [])

	const data = cache.get(key) as Map<string, T>

	return {
		loading,
		data: currentId ? (!data ? undefined : data.get(currentId)) : undefined,
		error,
	}
}

export const useCacheUpdate = <T, V>(
	promise: (variables?: V) => Promise<T>,
	options?: {
		key?: string
		nameKey?: string
	}
) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const { key = promise, nameKey = 'id' } = options || {}

	const fetch = async (params?: { variables?: V; id?: string }) => {
		const { id = null, variables = undefined } = params || {}

		let data
		setLoading(true)
		try {
			data = await promise(variables)
			let map = cache.get(key)
			const newId = (data as any)[nameKey] || id
			if (map) {
				// already have cache, update or add to the map
				const oldItem = map.get(newId)
				map.set(newId, {
					...oldItem,
					...data,
				})
			} else {
				// have not cache yet, add cache
				map = new Map()
				map.set(newId, data)
			}
			cache.set(key, map)
		} catch (e) {
			setError(e)
		}
		setLoading(false)
		return data
	}

	return {
		loading,
		error,
		fetch,
	}
}

export const useCacheRemove = <T, V>(
	promise: (variables?: V) => Promise<T>,
	options?: {
		key?: string
		nameKey?: string
	}
) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const { key = promise, nameKey = 'id' } = options || {}

	const fetch = async (params?: { variables?: V; id?: string }) => {
		const { id = null, variables = undefined } = params || {}
		let data
		setLoading(true)
		try {
			data = await promise(variables)
			const map = cache.get(key)
			if (map) {
				const newId = (data as any)[nameKey] || id
				if (map.get(newId)) {
					map.delete(newId)
					cache.set(key, map)
				}
			}
		} catch (e) {
			setError(e)
		}
		setLoading(false)
		return data
	}

	return {
		loading,
		error,
		fetch,
	}
}
