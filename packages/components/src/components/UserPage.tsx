import React, { CSSProperties, Suspense } from 'react'
import { unstable_createResource } from 'react-cache'

import { TRepoItem, TUserProfile } from '../api/data'
import { Spinner } from '../components/Spinner'

export function UserDetails({ user }: { user: TUserProfile }) {
	return (
		<div
			style={{
				display: 'grid',
				gridGap: '0.5rem',
				width: '20rem',
				padding: '1rem',
				backgroundColor: 'var(--color-buttonBg)',
				border: '1px solid var(--color-buttonBorder)',
				borderRadius: '1rem',
			}}
		>
			<UserPicture source={user.image} />
			<div
				style={{
					fontSize: '1.5rem',
					fontWeight: 'bold',
					color: 'var(--color-pageTextDark)',
				}}
			>
				{user.name}
			</div>
			<div style={{ fontSize: '1.25rem' }}>{user.id}</div>
			{user.tagline !== null && <div>{user.tagline}</div>}
			<hr
				style={{
					width: '100%',
					height: '1px',
					border: 'none',
					backgroundColor: '#ddd',
				}}
			/>
			{user.location && <Location location={user.location} />}
			{user.email && <Email email={user.email} />}
		</div>
	)
}

const Location = ({ location }: { location: string }) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
		}}
	>
		<svg
			viewBox="0 0 24 24"
			style={{
				width: '24px',
				height: '24px',
				marginRight: '0.5rem',
				fill: 'currentColor',
			}}
		>
			<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
			<path d="M0 0h24v24H0z" fill="none" />
		</svg>
		{location}
	</div>
)

const Email = ({ email }: { email: string }) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
		}}
	>
		<svg
			viewBox="0 0 24 24"
			style={{
				width: '24px',
				height: '24px',
				marginRight: '0.5rem',
				fill: 'currentColor',
			}}
		>
			<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
			<path d="M0 0h24v24H0z" fill="none" />
		</svg>
		<a href={`mailto:${email}`}>{email}</a>
	</div>
)

const ImageResource = unstable_createResource(
	(src: string): Promise<string> =>
		new Promise(resolve => {
			const img = new Image()
			img.onload = () => resolve(src)
			img.src = src
		})
)

function Img({
	src,
	alt,
	style,
}: {
	src: string
	alt: string
	style: CSSProperties
}) {
	return <img src={ImageResource.read(src)} alt={alt} style={style} />
}

function UserPicture({ source }: { source: string }) {
	return (
		<Suspense fallback={<Spinner size="medium" />}>
			<Img
				src={source}
				alt="profile picture"
				style={{
					width: '100%',
					height: 'auto',
					borderRadius: '0.5rem',
				}}
			/>
		</Suspense>
	)
}

export function Repositories({ repos }: { repos: TRepoItem[] }) {
	return (
		<ul
			style={{
				display: 'grid',
				gridGap: '1rem',
				gridTemplateColumns: 'repeat(3, 320px)',
				padding: 0,
				margin: 0,
			}}
		>
			{repos.map(repo => (
				<Repository key={repo.name} {...repo} />
			))}
		</ul>
	)
}

function Repository({ description, name, url }: TRepoItem) {
	return (
		<li
			style={{
				display: 'grid',
				gridGap: '0.5rem',
				padding: '1rem',
				backgroundColor: 'var(--color-buttonBg)',
				border: '1px solid var(--color-buttonBorder)',
				borderRadius: '1rem',
			}}
		>
			<strong>
				<a href={url}>{name}</a>
			</strong>
			<div>{description}</div>
		</li>
	)
}
