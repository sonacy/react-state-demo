import { Button } from 'antd'
import React, { useState } from 'react'

import ContributeList from './ContributePage'
import UserPage from './UserPage'

const Hooks = () => {
	const [currentId, setCurrentId] = useState<string | null>(null)

	return currentId ? (
		<>
			<Button
				type="primary"
				style={{ margin: 10 }}
				onClick={() => setCurrentId(null)}
			>
				go back to list
			</Button>
			<UserPage id={currentId} />
		</>
	) : (
		<ContributeList onClick={(id: string) => setCurrentId(id)} />
	)
}

export default Hooks
