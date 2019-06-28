import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button";

import './style.scss';
import Icon from "../../atoms/Icon";

class GoToPlace extends React.PureComponent {

	static propTypes = {
		goToPlace: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			text: null
		};

		this.search = this.search.bind(this);
		this.onTextChange = this.onTextChange.bind(this);
	}

	onTextChange(text) {
		this.setState({text});
	}

	search(e) {
		if ((e.charCode === 13) && this.props.goToPlace) {
			this.props.goToPlace(this.state.text);
		}
	}

	render() {
		return (
			<div className="ptr-go-to-place-box" onKeyPress={this.search}>
				<Input placeholder="Search place" onChange={this.onTextChange} value={this.state.text}>
					<Icon icon="search"/>
				</Input>
			</div>
		);
	}
}

export default GoToPlace;

