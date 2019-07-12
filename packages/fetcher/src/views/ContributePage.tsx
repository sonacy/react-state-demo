import {
  addContributorList,
  ContributorListItem,
  fetchContributorList,
  removeContibutorList,
  Spinner,
  TContributorItem,
} from '@react-state-demo/components'
import { Button } from 'antd'
import React, { useCallback, useState } from 'react'

import { createResource } from '../resource'

const ContributorListResource = createResource(fetchContributorList)

const ContributeListPage = ({
	onUserClick,
	loadingId,
}: {
	onUserClick: (id: string) => void
	loadingId: string | null
}) => {
	const list = ContributorListResource.read() as TContributorItem[]

	const [loading, setLoading] = useState(false)

	const addOne = async () => {
		setLoading(true)
		const contributor = await addContributorList()
		ContributorListResource.write(contributor)
		setLoading(false)
	}

	const remove = async (id: string) => {
		setLoading(true)
		await removeContibutorList()
		ContributorListResource.remove(id)
		setLoading(false)
	}

	return (
		<>
			{loading ? <Spinner size="large" /> : null}
			<h1>People From Faker</h1>
			<Button
				type="primary"
				style={{
					margin: 10,
				}}
				onClick={addOne}
			>
				add one
			</Button>
			<ul
				style={{
					display: 'grid',
					gridGap: '0.5rem',
					gridTemplateColumns: 'repeat(auto-fill, 20rem)',
					padding: 0,
					margin: 0,
				}}
			>
				{list.map(user => (
					<ContributorListItem
						onRemove={() => remove(user.id)}
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
