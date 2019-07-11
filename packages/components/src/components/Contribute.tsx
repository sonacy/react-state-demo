import { Button } from 'antd'
import React from 'react'

import { TContributorItem } from '../api/data'
import { Spinner } from './Spinner'

export const ContributorListItem = ({
	isLoading,
	onClick,
	user,
	onRemove,
}: {
	onRemove?: () => void
	isLoading: boolean
	onClick: () => void
	user: TContributorItem
}) => (
	<li
		onClick={onClick}
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '1rem',
			backgroundColor: 'var(--color-buttonBg)',
			border: '1px solid var(--color-buttonBorder)',
			borderRadius: '1rem',
			opacity: 1,
			cursor: 'pointer',
		}}
	>
		<div>
			<strong>{user.name}</strong>
			<div style={{ marginTop: '0.5rem' }}>{user.id}</div>
		</div>
		{typeof onRemove === 'function' ? (
			<Button
				icon="close"
				type="primary"
				onClick={e => {
					e.preventDefault()
					e.stopPropagation()
					onRemove()
				}}
			/>
		) : null}
		{isLoading ? (
			<Spinner size="small" />
		) : (
			<svg width="24" height="24" viewBox="0 0 24 24">
				<path fill="none" d="M0 0h24v24H0z" />
				<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
			</svg>
		)}
	</li>
)
