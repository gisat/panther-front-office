import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import _ from 'lodash';
import * as d3 from 'd3';

import Icon from '../../atoms/Icon';

import './style.scss';
import Button from "../../atoms/Button";
import Menu from "../../atoms/Menu";
import {MenuItem} from "../../atoms/Menu";

class ChartWrapper extends React.PureComponent {
	static propTypes = {
		title: PropTypes.string,
		subtitle: PropTypes.string,
		statusBar: PropTypes.element,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
	};

	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount();
		}
	}

	componentWillUnmount() {
		if (this.props.onUnmount) {
			this.props.onUnmount();
		}
	}

	render() {
		let classes = classnames("ptr-chart-wrapper-header", {
			'with-subtitle': !!this.props.subtitle
		});

		const {children, ...propsWithoutChildren} = this.props;

		return (
			<div className="ptr-chart-wrapper">
				<div className={classes}>
					<div className="ptr-chart-wrapper-titles">
						<div className="ptr-chart-wrapper-title" title={this.props.title}>{this.props.title}</div>
						{this.props.subtitle ? (
							<div className="ptr-chart-wrapper-subtitle" title={this.props.subtitle}>{this.props.subtitle}</div>
						) : null}
					</div>
					<div className="ptr-chart-wrapper-tools">
						<div className="ptr-chart-wrapper-tool">
							<Button icon="dots" invisible>
								<Menu bottom left>
									<MenuItem disabled>All periods</MenuItem>
								</Menu>
							</Button>
						</div>
					</div>
				</div>
				{this.props.statusBar ? (<div className="ptr-chart-wrapper-status-bar">{this.props.statusBar}</div>) : null}
				<div className="ptr-chart-wrapper-content">
					<ReactResizeDetector handleWidth handleHeight render={({width, height}) => (
						React.cloneElement(this.props.children, {...propsWithoutChildren, width})
					)}>
					</ReactResizeDetector>
				</div>
			</div>
		);
	}
}

export default ChartWrapper;

