import { ContributorListItem, fetchContributorList } from '@react-state-demo/components'
import React from 'react'
import { unstable_createResource } from 'react-cache'

const ContributorListResource = unstable_createResource(fetchContributorList)

const ContributeListPage = ({
	onUserClick,
	loadingId,
}: {
	onUserClick: (id: string) => void
	loadingId: string | null
}) => {
	return (
		<>
			<h1>People From Faker</h1>
			<ul
				style={{
					display: 'grid',
					gridGap: '0.5rem',
					gridTemplateColumns: 'repeat(auto-fill, 20rem)',
					padding: 0,
					margin: 0,
				}}
			>
				{ContributorListResource.read(undefined).map(user => (
					<ContributorListItem
						key={user.id}
						onClick={() => onUserClick(user.id)}
						isLoading={!!loadingId && user.id === loadingId}
						user={user}
					/>
				))}
			</ul>
		</>
	)
}

export default ContributeListPage
