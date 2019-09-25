import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import domToImage from 'dom-to-image';
import download from "downloadjs";

import './style.scss';
import Button from "../../atoms/Button";
import Menu from "../../atoms/Menu";
import {MenuItem} from "../../atoms/Menu";
import Loader from "../../atoms/Loader/Loader";
import utils from "../../../../utils/utils";

class ChartWrapper extends React.PureComponent {
	static propTypes = {
		title: PropTypes.string,
		subtitle: PropTypes.string,
		statusBar: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.array
		]),
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		loading: PropTypes.bool,
		enableExport: PropTypes.bool,
		wrapperKey: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.state = {
			loadingStatus: this.props.loading ? 'open' : 'close'
		};

		this.export = this.export.bind(this);
	}

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

	export() {
		let menuButton = document.activeElement;
		menuButton.style.visibility = "hidden";
		let areaToExport = document.getElementById(this.props.wrapperKey);

		setTimeout(()=>{
			domToImage.toPng(areaToExport).then(function (dataUrl) {
				menuButton.style.visibility = "visible";
				download(dataUrl, 'chart.png');
			});
		}, 500);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.loading && !this.props.loading) {
			this.setState({
				loadingStatus: 'closing'
			});

			let self = this;
			setTimeout(() => {
				self.setState({
					loadingStatus: 'close'
				});
			}, 700);
		} else if (!prevProps.loading && this.props.loading) {
			this.setState({
				loadingStatus: 'open'
			});
		}
	}

	render() {		
		let classes = classnames("ptr-chart-wrapper-header", {
			'with-subtitle': !!this.props.subtitle
		});

		const {children, ...propsWithoutChildren} = this.props;

		return (
			<div className="ptr-chart-wrapper" id={this.props.wrapperKey}>
				{this.state.loadingStatus === 'open' ||  this.state.loadingStatus === 'closing' ? (
					<div className="ptr-chart-wrapper-loader">
						<Loader
							fadeOut={this.state.loadingStatus === 'closing'}
							blackandwhite
							small
							background={'#ffffff'}
						/>
					</div>
				) : null}
				{this.state.loadingStatus === 'close' ||  this.state.loadingStatus === 'closing' ? (
					<>
						<div className={classes}>
							<div className="ptr-chart-wrapper-titles">
								<div className="ptr-chart-wrapper-title" title={this.props.title}>{this.props.title}</div>
								{this.props.subtitle ? (
									<div className="ptr-chart-wrapper-subtitle" title={this.props.subtitle}>{this.props.subtitle}</div>
								) : null}
							</div>
							<div className="ptr-chart-wrapper-tools">
								{this.props.enableExport ? this.renderMenu() : null}
							</div>
						</div>
						{this.props.statusBar ? (<div className="ptr-chart-wrapper-status-bar">{this.props.statusBar}</div>) : null}
						<div className="ptr-chart-wrapper-content">
							<ReactResizeDetector handleWidth handleHeight render={({width, height}) => {
								let remWidth = width/utils.getRemSize();
								return React.cloneElement(this.props.children, {...propsWithoutChildren, width: remWidth})
							}}>
							</ReactResizeDetector>
						</div>
					</>
				) : null}
			</div>
		);
	}

	renderMenu() {
		return (
			<div className="ptr-chart-wrapper-tool">
				<Button icon="dots" invisible>
					<Menu bottom left>
						{this.props.enableExport ? <MenuItem onClick={this.export}>Download as PNG</MenuItem> : null}
					</Menu>
				</Button>
			</div>
		);
	}
}

export default ChartWrapper;

