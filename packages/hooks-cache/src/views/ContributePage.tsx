import {
  addContributorList,
  ContributorListItem,
  fetchContributorList,
  removeContibutorList,
  Spinner,
} from '@react-state-demo/components'
import { Button } from 'antd'
import React from 'react'

import { useCacheList, useCacheRemove, useCacheUpdate } from '../cache'

const ContirbuteModel = 'ContirbuteModel'

const ContributeList = ({ onClick }: { onClick: (id: string) => void }) => {
	const { data, loading } = useCacheList(fetchContributorList, {
		key: ContirbuteModel,
	})

	const { fetch: add, loading: mLoading } = useCacheUpdate(addContributorList, {
		key: ContirbuteModel,
	})

	const { fetch: remove, loading: rLoading } = useCacheRemove(
		removeContibutorList,
		{
			key: ContirbuteModel,
		}
	)

	const handleRemove = (id: string) => {
		remove({ id })
	}

	const addContribute = () => {
		add()
	}

	return (
		<>
			<h1>People From Faker</h1>
			<Button
				type="primary"
				style={{
					margin: 10,
				}}
				onClick={addContribute}
			>
				add a contribution
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
				{loading || mLoading || rLoading ? <Spinner size="large" /> : null}
				{data &&
					data.map(user => {
						return (
							<ContributorListItem
								onRemove={() => handleRemove(user.id)}
								key={user.id}
								onClick={() => onClick(user.id)}
								isLoading={false}
								user={user}
							/>
						)
					})}
			</ul>
		</>
	)
}

export default ContributeList
