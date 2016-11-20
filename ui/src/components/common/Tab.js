import React from 'react'

import LockIcon from 'material-ui/svg-icons/action/lock-outline';

let Tab = ({ label, value, onClick, selected, disabled }) => {
	let className = "tab--container "
	className += selected ? "active " : ""
	className += disabled ? "disabled " : ""

	return (
		<span className={className} onClick={!disabled ? () => { 
			onClick(value) 
		} : () => {}}> 
			{label} { disabled ? <LockIcon style={{ height: '18px', width: '18px', color: "#929292", marginBottom: '-2px' }}></LockIcon> : null }
		</span>)
}

export default Tab