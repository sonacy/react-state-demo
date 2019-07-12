import {
  addContributorList,
  ContributorListItem,
  fetchContributorList,
  removeContibutorList,
  Spinner,
  TContributorItem,
} from '@react-state-demo/components'
import { Button } from 'antd'
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

	add = async () => {
		this.setState({ loading: true })
		const item = await addContributorList()
		this.setState(state => ({
			list: [...state.list, item],
			loading: false,
		}))
	}

	remove = async (id: string) => {
		this.setState({ loading: true })
		await removeContibutorList()
		const newList: TContributorItem[] = [...this.state.list]
		const index = newList.findIndex(c => c.id === id)
		if (index > -1) {
			newList.splice(index, 1)
		}
		this.setState({
			list: newList,
			loading: false,
		})
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
				add={container.add}
				remove={container.remove}
			/>
		)}
	</Subscribe>
)

const ContributeListPage = ({
	onUserClick,
	list,
	getList,
	loading,
	add,
	remove,
}: {
	onUserClick: (id: string) => void
	loading: boolean
	list: TContributorItem[]
	getList: () => void
	add: () => void
	remove: (id: string) => void
}) => {
	useEffect(() => {
		getList()
	}, [])

	return (
		<>
			{loading ? <Spinner size="large" /> : null}
			<h1>People From Faker</h1>
			<Button onClick={add} type="primary" style={{ margin: 10 }}>
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
						isLoading={false}
						user={user}
					/>
				))}
			</ul>
		</>
	)
}

export default ContributeConnect
