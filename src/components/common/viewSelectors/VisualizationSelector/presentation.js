import React from 'react';
import PropTypes from 'prop-types';
import UISelect from '../../../presentation/atoms/UISelect'
import classNames from 'classnames';
let polyglot = window.polyglot;

class VisualizationSelector extends React.PureComponent {

	static propTypes = {
		activeVisualization: PropTypes.object,
		isInIntroMode: PropTypes.bool,
		visualizations: PropTypes.array,
		forceShow: PropTypes.bool,
		onChangeVisualization: PropTypes.func,
		onMount: PropTypes.func,
	};

	static defaultProps = {
		places: null
	};

	constructor(props) {
		super(props);
		this.onChangeVisualization = this.onChangeVisualization.bind(this);
	}

	componentDidMount(){
		if (!this.props.isInIntroMode){ //TODO remove dependency on mode
			this.props.onMount();
		}
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	componentDidUpdate() {
		let activeKey = this.props.activeVisualization && this.props.activeVisualization.key;
		let isActiveVisualizationAvailable = false;
		if (this.props.visualizations) {
			this.props.visualizations.forEach(vis => {
				if (vis.key === activeKey) {
					isActiveVisualizationAvailable = true;
				}
			});

			if (!isActiveVisualizationAvailable) {
				this.onChangeVisualization(this.props.visualizations[0]);
			}
		}
	}

	onChangeVisualization(object){
		this.props.onChangeVisualization(object.key);
	}

	render() {
		let options = [];
		let selected = null;

		if (this.props.visualizations){
			this.props.visualizations.map(theme => {
				options.push({
					key: theme.key,
					value: theme.key,
					label: theme.data && theme.data.name
				})
			});

			if (this.props.activeVisualization){
				selected = this.props.activeVisualization.key;
			}
		}

		let classes = classNames("ptr-visualization-selector ptr-view-selection-selector", this.props.classes);

		return (this.props.visualizations || this.props.forceShow ? (
			<div className="ptr-view-selection-container ptr-view-selection-visualization">
				<UISelect
					key='theme-selector'
					clearable={false}
					classes={classes}
					label='left'
					name={polyglot.t('visualization')}
					onChange={this.onChangeVisualization}
					options={options}
					placeholder=''
					value={selected}
					disabled={!!this.props.disabled}
				/>
			</div>
		) : null);
	}

}

export default VisualizationSelector;
