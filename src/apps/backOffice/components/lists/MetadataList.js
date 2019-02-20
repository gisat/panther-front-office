import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import {withNamespaces} from "react-i18next";
import Value from '../../../../components/containers/controls/Select/Value';
import Icon from '../../../../components/common/atoms/Icon';

class MetadataList extends React.PureComponent {
	static propTypes = {
		models: PropTypes.array,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.onItemClick = this.onItemClick.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	onItemClick(option) {
		this.props.onItemClick(option.key);
	}

	render() {
		const endItems = 
		[(<span className={'ptr-icon-inline-wrap'} key={'double-angle'}>
			<Icon icon='angle-double-right' height={'16'}  width={'16'} className={'ptr-inline-icon'}/>
		</span>)];

		return (
			<div>
				{this.props.models ? this.props.models.map(model => <Value key={model.key} option={{label: model.data.nameDisplay, key: model.key, ...model.data}} onOptionLabelClick={this.onItemClick} optionLabelClick={true} endItems = {endItems}/>) : null}
			</div>
		);
	}
}

export default withNamespaces()(MetadataList);