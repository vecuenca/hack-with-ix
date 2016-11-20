import React from 'react'

class Tabs extends React.Component {

	static propTypes = {
		value : React.PropTypes.string.isRequired
	}

	constructor(props) {
		super(props);
		
		this.state = {
			selectedValue: null
		}
	}

	getTabs(props = this.props) {
		const tabs = [];

		React.Children.forEach(props.children, (tab) => {
			if (React.isValidElement(tab)) {
				tabs.push(tab);
			}
		});

		return tabs;
	}

	render() {
		return (
			<div className="tabs--container">
				<div className="tabs--tab-section">
					<div>
                    { 
						this.getTabs().map(tab => {
							return React.cloneElement(tab, {
								onClick: tab.props.onClick,
								selected: tab.props.value === this.props.value
							}, tab.props.children)
						})
					}
                    </div>
                    {
                        this.props.rightItem
                    }
				</div>
			</div>)
	}
}

export default Tabs