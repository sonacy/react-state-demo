import { Button } from 'antd'
import React, { lazy, useEffect, useState } from 'react'
import { unstable_scheduleCallback } from 'scheduler'

import ContributorListPage from './ContributePage'

const UserPage = lazy(() => import('./UserPage'))

const About = () => {
	const [currentId, setCurrentId] = useState<string | null>(null)
	const [showDetail, setshowDetail] = useState(false)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [currentId, showDetail])

	const handleUserClick = (id: string) => {
		setCurrentId(id)
		unstable_scheduleCallback(() => {
			setshowDetail(true)
		})
	}

	const handleBackClick = () => {
		setCurrentId(null)
		setshowDetail(false)
	}

	const renderDetail = (id: string) => {
		return (
			<div>
				<Button
					type="primary"
					onClick={handleBackClick}
					style={{
						display: 'block',
						marginBottom: '1rem',
					}}
				>
					Return to list
				</Button>
				<UserPage id={id} />
			</div>
		)
	}

	const renderList = (loadingId: string | null) => {
		return (
			<ContributorListPage
				loadingId={loadingId}
				onUserClick={handleUserClick}
			/>
		)
	}

	return showDetail && currentId
		? renderDetail(currentId)
		: renderList(currentId)
}

export default About
