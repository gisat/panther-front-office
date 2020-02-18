import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from '@gisatcz/ptr-utils'
import _ from 'lodash';
import i18next from "i18next";

import cz from './locales/cz.json';
import en from './locales/en.json';

import './style.scss';
import {withNamespaces} from "react-i18next";

// add locales to component namespace
utils.addI18nResources(i18next,'Atoms#InputWrapper', {cz, en});

class InputWrapper extends React.PureComponent {

	static propTypes = {
		divInsteadOfLabel: PropTypes.bool,
		disabled: PropTypes.bool,
		label: PropTypes.string,
		required: PropTypes.bool
	};

	render() {
		const t = this.props.t;
		let classes = classNames("ptr-input-wrapper", this.props.className, {
			'disabled': this.props.disabled
		});

		let info = this.props.info ? (<div className="ptr-input-wrapper-info">{this.props.info}</div>) : null;
		let children = React.Children.map(this.props.children, child => {
			if (typeof child === 'object' && child.type === InputWrapperInfo) {
				info = child;
				return null;
			}
			return child;
		});

		let required = this.props.required ? (<div className="ptr-input-wrapper-required">{t('requiredFieldLabel')}</div>) : null;

		return this.props.divInsteadOfLabel ? (
			<div className={classes}>
				<div>
					{required}
					{this.props.label ? <span className="ptr-input-label">{this.props.label}</span> : null}
					{children}
				</div>
				{info}
			</div>
		) : (
			<div className={classes}>
				<label>
					{required}
					<span className="ptr-input-label">{this.props.label}</span>
					{children}
				</label>
				{info}
			</div>
		);
	}
}

export default withNamespaces(['Atoms#InputWrapper'])(InputWrapper);

export const InputWrapperInfo = props => {

	return (
		<div
			className="ptr-input-wrapper-info"
		>
			{props.children}
		</div>
	);
};
