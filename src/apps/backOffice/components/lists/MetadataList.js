import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import {withNamespaces} from "react-i18next";
import Value from '../Select/Value';
import Icon from '../../../../components/common/atoms/Icon';
import AddValue from '../../../../apps/backOffice/components/Select/AddValue';

class MetadataList extends React.PureComponent {
	static propTypes = {
		models: PropTypes.array,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		unfocusable: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.list = React.createRef();
		this.onItemClick = this.onItemClick.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
		this.list.current.children[0].focus();
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
			<div ref={this.list}>
				<AddValue
					unfocusable={this.props.unfocusable}
                    option={{label:"Create"}} 
                    onOptionLabelClick={this.props.onAddClick}
                    />
				{this.props.models ? this.props.models.map(model =>
					<Value
						unfocusable={this.props.unfocusable}
						key={model.key}
						option={{label: model.data.nameDisplay, key: model.key, ...model.data}}
						onOptionLabelClick={this.onItemClick}
						optionLabelClick={true}
						endItems = {endItems}
					/>
					) : null}
			</div>
		);
	}
}

export default withNamespaces()(MetadataList);