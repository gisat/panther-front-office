import React from 'react';
import PropTypes from "prop-types";
import Select from '../../../../apps/backOffice/components/Select/Select';
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
		const selectedValue = this.props.data.find(i => i.key === this.props.itemKey);
		
		return (
			<div>
				<Select
					unfocusable={this.props.unfocusable}
                    options = {this.props.data}
                    selectedValue = {selectedValue}
					onChange={this.props.onChange}
					className={'ptr-select-heading'}
					style={{flexGrow: 2}}
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