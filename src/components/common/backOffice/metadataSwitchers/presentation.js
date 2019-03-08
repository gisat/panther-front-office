import React from 'react';
import PropTypes from "prop-types";
import Select from '../../../../apps/backOffice/components/Select/Select';
import AddIndicatorsContainer from './AddIndicatorsContainer';


class MetadataSwitcher extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		onChange: PropTypes.func,
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
			<div style={{display:'flex'}}>
				<Select
					unfocusable={this.props.unfocusable}
					components = {{
						IndicatorsContainer: AddIndicatorsContainer,
					}}
                    options = {this.props.data}
                    selectedValue = {selectedValue}
					onChange={this.props.onChange}
					className={'ptr-select-heading'}
					style={{flexGrow: 2}}
					customProps={{
						onAddClick: () => {this.props.onAddClick()},
					}}
					/>
			</div>
		);
	}
}

MetadataSwitcher.propTypes = {
	onChange: PropTypes.func,
	data: PropTypes.array,
	itemKey: PropTypes.string,
	onMount: PropTypes.func,
	onUnmount: PropTypes.func,
	onAddClick: PropTypes.func,
}

export default MetadataSwitcher;