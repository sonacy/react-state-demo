import { address, image, internet, lorem, name } from 'faker'

export type TContributorItem = {
	id: string
	name: string
}

export type TUserProfile = {
	id: string
	name: string
	image: string
	location: string
	email: string
	tagline: string
}

export type TRepoItem = {
	name: string
	url: string
	description: string
}
export const createContributorItem = (): TContributorItem => {
	const firstName = name.firstName()
	const lastName = name.lastName()

	return {
		id: lastName,
		name: firstName + ' ' + lastName,
	}
}

export const createUserProfile = (id?: string): TUserProfile => ({
	id: id || name.lastName(),
	name: name.firstName() + ' ' + name.lastName(),
	image: image.avatar(),
	location: address.streetAddress(),
	email: internet.email(),
	tagline: lorem.slug(),
})

export const createRepoItem = (): TRepoItem => ({
	name: name.title(),
	url: internet.url(),
	description: lorem.lines(),
})
