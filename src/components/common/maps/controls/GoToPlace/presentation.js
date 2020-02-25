import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces, localesUtils} from '@gisatcz/ptr-locales';
import cz from "./locales/cz";
import en from "./locales/en";

import './style.scss';
import {Icon, Input} from '@gisatcz/ptr-atoms'
import {utils} from '@gisatcz/ptr-utils'

localesUtils.addI18nResources('GoToPlace', {cz, en});

class GoToPlace extends React.PureComponent {

	static propTypes = {
		goToPlace: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			text: null,
			previousSearching: null
		};

		this.search = this.search.bind(this);
		this.onTextChange = this.onTextChange.bind(this);
	}

	onTextChange(text) {
		this.setState({text});
	}

	search(e) {
		if ((e.charCode === 13) && this.props.goToPlace && this.state.text !== this.state.previousSearching) {
			this.props.goToPlace(this.state.text);
			this.state.previousSearching = this.state.text;
		}
	}

	render() {
		return (
			<div className="ptr-go-to-place-box" onKeyPress={this.search}>
				<Input placeholder={this.props.t('zoomTo')} onChange={this.onTextChange} value={this.state.text}>
					<Icon icon="search"/>
				</Input>
			</div>
		);
	}
}

export default withNamespaces(['GoToPlace'])(GoToPlace);

