import { createContributorItem, createRepoItem, createUserProfile, TContributorItem, TRepoItem, TUserProfile } from './data'

export const fetchContributorList = () => {
	return fetch<TContributorItem[]>(
		new Array(10).fill(1).map(() => createContributorItem())
	)
}

export const addContributorList = () => {
	return fetch<TContributorItem>(createContributorItem())
}

export const removeContibutorList = () => {
	return fetch<boolean>(true)
}

export const fetchUserProfile = (id?: string) => {
	return fetch<TUserProfile>(createUserProfile(id))
}

export const fetchRepositoriesList = () => {
	return fetch<TRepoItem[]>(new Array(10).fill(1).map(() => createRepoItem()))
}

const fetch = <T>(result: T): Promise<T> =>
	new Promise(resolve => {
		setTimeout(() => {
			resolve(result)
		}, 1000)
	})
