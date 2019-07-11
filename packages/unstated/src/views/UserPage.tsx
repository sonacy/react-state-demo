import {
  fetchRepositoriesList,
  fetchUserProfile,
  Repositories,
  Spinner,
  TRepoItem,
  TUserProfile,
  UserDetails,
} from '@react-state-demo/components'
import React, { useEffect } from 'react'

import { Container, Subscribe } from '../unstated'

class UserContainer extends Container<{
	loading: boolean
	user: TUserProfile | null
	repos: TRepoItem[]
}> {
	state = {
		loading: false,
		user: null,
		repos: [],
	}

	getUser = async (id: string) => {
		this.setState({ loading: true })
		const user = await fetchUserProfile(id)
		this.setState({ loading: false, user })
	}

	getRepos = async () => {
		this.setState({ loading: true })
		const repos = await fetchRepositoriesList()
		this.setState({ loading: false, repos })
	}
}

const UserConntect = ({ id }: { id: string }) => (
	<Subscribe to={[UserContainer]}>
		{(container: UserContainer) => (
			<UserPage
				id={id}
				user={container.state.user}
				repos={container.state.repos}
				loading={container.state.loading}
				getRepos={container.getRepos}
				getUser={container.getUser}
			/>
		)}
	</Subscribe>
)

const UserPage = ({
	id,
	user,
	repos,
	getUser,
	getRepos,
	loading,
}: {
	id: string
	user: TUserProfile | null
	repos: TRepoItem[]
	loading: boolean
	getUser: (id: string) => void
	getRepos: () => void
}) => {
	useEffect(() => {
		getUser(id)
		getRepos()
	}, [])

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, 20rem)',
				gridGap: '1rem',
				alignItems: 'start',
			}}
		>
			{loading ? <Spinner size="large" /> : null}
			{user ? <UserDetails user={user} /> : null}
			<Repositories repos={repos} />
		</div>
	)
}

export default UserConntect
