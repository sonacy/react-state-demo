import {
  fetchRepositoriesList,
  fetchUserProfile,
  Repositories,
  Spinner,
  TRepoItem,
  TUserProfile,
  UserDetails,
} from '@react-state-demo/components'
import React, { Suspense } from 'react'

import { createResource } from '../resource'

const UserDetailsResource = createResource(fetchUserProfile)
const UserRepositoriesResource = createResource(fetchRepositoriesList)

const UserPage = ({ id }: { id: string }) => {
	const user = UserDetailsResource.read(id) as TUserProfile
	const repos = UserRepositoriesResource.read() as TRepoItem[]

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
