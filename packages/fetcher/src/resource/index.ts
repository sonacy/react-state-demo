// TODO: resource
type TResource = any
// TODO: resource
export const cacheMap: Map<TResource, TResult<any>> = new Map()

type TID = string | number | null | undefined

enum EStaus {
	Pending,
	Resolved,
	Rejected,
}

type TResult<T> = {
	status: EStaus
	value: Map<string | number, T> | Promise<T> | Error
}

const translateMapToArr = <T>(map: Map<string | number, T>) => {
	const ret: Array<T & { id: string | number }> = []
	map.forEach((value, key) => {
		ret.push({
			...value,
			id: key,
		})
	})
	return ret
}

const translateArrToMap = <T>(arr: Array<T & { id: string | number }>) => {
	const map = new Map<string | number, T>()
	arr.forEach(item => {
		map.set(item.id, item)
	})
	return map
}

const accessResult = <T>(resource: any, fetch: () => Promise<T>, id?: TID) => {
	let result = cacheMap.get(resource)

	if (result === undefined) {
		const promise = fetch()
		const newResult: TResult<T> = {
			status: EStaus.Pending,
			value: promise,
		}

		promise
			.then((value: any) => {
				if (newResult.status === EStaus.Pending) {
					newResult.status = EStaus.Resolved
					if (Array.isArray(value)) {
						newResult.value = translateArrToMap<T>(value)
					} else if (id) {
						const map = new Map<string | number, T>()
						map.set(id, value)
						newResult.value = map
					}
				}
			})
			.catch((error: any) => {
				if (newResult.status === EStaus.Pending) {
					newResult.status = EStaus.Rejected
					newResult.value = error
				}
			})
		cacheMap.set(resource, newResult)
		return newResult
	} else {
		return result
	}
}

export const createResource = <T, V>(fetch: (v?: V) => Promise<T>) => {
	const resource = {
		read: (id?: TID) => {
			const result = accessResult<T>(resource, fetch, id)

			switch (result.status) {
				case EStaus.Pending: {
					throw result.value
				}
				case EStaus.Rejected: {
					throw result.value
				}
				case EStaus.Resolved: {
					const map = result.value as Map<string | number, T>
					if (id) {
						return map.get(id)
					} else {
						return translateMapToArr(map)
					}
				}
				default:
					console.error('should not go into this!')
			}
		},
		write: (value: any) => {
			let result = cacheMap.get(resource)
			if (result === undefined) {
				result = {
					status: EStaus.Resolved,
					value: new Map(),
				}
			}
			const map = result.value as Map<string | number, T>

			map.set(value.id, value)

			cacheMap.set(resource, result)
		},
		remove: (id: TID) => {
			let result = cacheMap.get(resource)
			if (result) {
				const map = result.value as Map<string | number, T>
				if (id && map.get(id)) {
					map.delete(id)
				}
				cacheMap.set(resource, result)
			}
		},
	}

	return resource
}
