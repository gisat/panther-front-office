import React from 'react';
import PropTypes from "prop-types";
import Select from '../../atoms/Select/Select';
import './MetadataSwitcher.scss';
import Button from "../../atoms/Button";


class MetadataSwitcher extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		onChange: PropTypes.func,
		itemKey: PropTypes.string,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		onAddClick: PropTypes.func,
		unfocusable: PropTypes.bool
	};

	componentDidMount(){
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		let selectedValue = null;
		if (this.props.data) {
			selectedValue = this.props.data.find(i => i.key === this.props.itemKey);
		}
		
		return (
			<div className="ptr-screen-metadata-switcher-content">
				<Select
					unfocusable={this.props.unfocusable}
                    options = {this.props.data}
					optionValue="key"
                    value = {selectedValue}
					valueIsTitle
					optionLabel="data.nameDisplay"
					onChange={this.props.onChange}
					withKeyPrefix
				/>
				<Button
					icon="plus"
					ghost
					onClick={this.props.onAddClick}
					unfocusable={this.props.unfocusable}
				/>
			</div>
		);
	}
}

export default MetadataSwitcher;