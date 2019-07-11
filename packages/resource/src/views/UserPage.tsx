import { fetchRepositoriesList, fetchUserProfile, Repositories, Spinner, UserDetails } from '@react-state-demo/components'
import React, { Suspense } from 'react'
import { unstable_createResource } from 'react-cache'

const UserDetailsResource = unstable_createResource(fetchUserProfile)
const UserRepositoriesResource = unstable_createResource(fetchRepositoriesList)

const UserPage = ({ id }: { id: string }) => {
	const user = UserDetailsResource.read(id)
	const repos = UserRepositoriesResource.read(undefined)
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, 20rem)',
				gridGap: '1rem',
				alignItems: 'start',
			}}
		>
			<UserDetails user={user} />
			<Suspense fallback={<Spinner size="medium" />}>
				<Repositories repos={repos} />
			</Suspense>
		</div>
	)
}

export default UserPage
