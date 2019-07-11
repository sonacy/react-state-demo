import { ContributorListItem, fetchContributorList, Spinner, TContributorItem } from '@react-state-demo/components'
import React, { useEffect } from 'react'

import { Container, Subscribe } from '../unstated'

class ContributeContainer extends Container<{
	list: TContributorItem[]
	loading: boolean
}> {
	state = {
		list: [],
		loading: false,
	}

	getList = async () => {
		this.setState({ loading: true })
		const list = await fetchContributorList()
		this.setState({ list, loading: false })
	}
}

const ContributeConnect = ({
	onUserClick,
	loadingId,
}: {
	onUserClick: (id: string) => void
	loadingId: string | null
}) => (
	<Subscribe to={[ContributeContainer]}>
		{(container: ContributeContainer) => (
			<ContributeListPage
				loading={container.state.loading}
				list={container.state.list}
				getList={container.getList}
				onUserClick={onUserClick}
			/>
		)}
	</Subscribe>
)

const ContributeListPage = ({
	onUserClick,
	list,
	getList,
	loading,
}: {
	onUserClick: (id: string) => void
	loading: boolean
	list: TContributorItem[]
	getList: () => void
}) => {
	useEffect(() => {
		getList()
	}, [])

	return (
		<>
			{loading ? <Spinner size="large" /> : null}
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
				{list.map(user => (
					<ContributorListItem
						key={user.id}
						onClick={() => onUserClick(user.id)}
						isLoading={false}
						user={user}
					/>
				))}
			</ul>
		</>
	)
}

export default ContributeConnect
