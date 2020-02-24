import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import {withNamespaces} from "react-i18next";
import {Icon, AddValue, Value} from '@gisatcz/ptr-atoms';

class MetadataList extends React.PureComponent {
	static propTypes = {
		enableCreate: PropTypes.bool,
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
		if (this.list.current.children[0]) {
			this.list.current.children[0].focus();
		}
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	onItemClick(option) {
		this.props.onItemClick(option.key);
	}

	render() {
		const t = this.props.t;
		const endItems = 
		[(<span className={'ptr-icon-inline-wrap'} key={'double-angle'}>
			<Icon icon='angle-double-right' height={'16'}  width={'16'} className={'ptr-inline-icon'}/>
		</span>)];

		let models = this.props.models || this.props.outdated;

		// TODO enable AddValue if enableCreate = true (waiting for BE)
		return (
			<div ref={this.list}>
				<AddValue
					unfocusable={this.props.unfocusable}
					option={{label:t('createCapitalized')}}
					onOptionLabelClick={this.props.onAddClick}
				/>
				{models ? models.map(model => {
					if (model) {
						return (<Value
							unfocusable={this.props.unfocusable}
							key={model.key}
							option={{label: model.data && model.data.nameDisplay, key: model.key, ...model.data}}
							onOptionLabelClick={this.onItemClick}
							optionLabelClick={true}
							endItems = {endItems}
							withKeyPrefix
						/>);
					}
				}
					) : null}
			</div>
		);
	}
}

export default withNamespaces()(MetadataList);