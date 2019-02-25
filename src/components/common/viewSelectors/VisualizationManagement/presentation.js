import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from "../../../../components/presentation/atoms/Button";
import './style.css';

class VisualizationManagement extends React.PureComponent {

	static propTypes = {
		onManage: PropTypes.func,
		onSave: PropTypes.func
	};

	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className="ptr-visualization-management">
				<Button onClick={this.props.onSave} className="ptr-visualization-button">
					<i className={'fa fa-floppy-o'}></i>
				</Button>
				<Button onClick={this.props.onManage} className="ptr-visualization-button">
					<i className={'fa fa-cog'}></i>
				</Button>
			</div>
		);
	}

}

export default VisualizationManagement;
