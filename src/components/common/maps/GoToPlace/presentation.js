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
	}

	search() {
		if (this.props.goToPlace) {
			this.props.goToPlace(this.state.text);
		}
	}

	render() {
		return (
			<div className="ptr-go-to-place-box">
				<Input placeholder="Search place">
					<Icon icon="search"/>
				</Input>
			</div>
		);
	}
}

export default GoToPlace;

