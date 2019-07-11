import { fetchRepositoriesList, fetchUserProfile, Repositories, Spinner, UserDetails } from '@react-state-demo/components'
import React from 'react'

import { useCacheItem } from '../cache'

export default function UserPage({ id }: { id: string }) {
	const { data: user, loading: uLoading } = useCacheItem(fetchUserProfile, {
		id,
		variables: id,
	})

	const { data: repos, loading: rLoading } = useCacheItem(
		fetchRepositoriesList,
		{
			variables: id,
			id,
		}
	)

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, 20rem)',
				gridGap: '1rem',
				alignItems: 'start',
			}}
		>
			{uLoading || rLoading || !user || !repos ? (
				<Spinner size="large" />
			) : (
				<>
					<UserDetails user={user} />
					<Repositories repos={repos} />
				</>
			)}
		</div>
	)
}
