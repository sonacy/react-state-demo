import './Spinner.css'

import React from 'react'

const SPINNER_SIZES: { [key: string]: number } = {
	small: 30,
	medium: 50,
	large: 70,
}

const STROKE_WIDTHS: { [key: string]: number } = {
	small: 4,
	medium: 5,
	large: 6,
}

const PATH_CLASS_NAMES: { [key: string]: string } = {
	small: 'SmallSpinnerPath',
	medium: 'MediumSpinnerPath',
	large: 'LargeSpinnerPath',
}

// Heavily inspired by https://codepen.io/mrrocks/pen/EiplA
export function Spinner({ size = 'small' }: { size: string }) {
	const baseSize = SPINNER_SIZES[size]
	const pathSize = baseSize / 2
	const strokeWidth = STROKE_WIDTHS[size]
	const pathRadius = `${baseSize / 2 - strokeWidth}px`
	const className = PATH_CLASS_NAMES[size]
	const containerClassName = `SpinnerContainer SpinnerContainer-${size}`

	return (
		<div style={{ zIndex: 999 }} className={containerClassName}>
			<svg
				className={className}
				width={baseSize}
				height={baseSize}
				viewBox={`0 0 ${baseSize} ${baseSize}`}
			>
				<circle
					className="SpinnerPath"
					fill="none"
					stroke="currentColor"
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					cx={pathSize}
					cy={pathSize}
					r={pathRadius}
				/>
			</svg>
		</div>
	)
}
