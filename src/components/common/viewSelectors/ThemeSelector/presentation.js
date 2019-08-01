import React from 'react';
import PropTypes from 'prop-types';
import UISelect from '../../../presentation/atoms/UISelect'
import classNames from 'classnames';

let polyglot = window.polyglot;

class ThemeSelector extends React.PureComponent {

	static propTypes = {
		activeTheme: PropTypes.object,
		isInIntroMode: PropTypes.bool,
		themes: PropTypes.array,
		onChangeTheme: PropTypes.func,
		onMount: PropTypes.func,
	};

	static defaultProps = {
		places: null,
	};

	constructor(props) {
		super(props);
		this.onChangeTheme = this.onChangeTheme.bind(this);
	}

	componentDidMount(){
		if (!this.props.isInIntroMode){ //TODO remove dependency on mode
			this.props.onMount();
		}
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	onChangeTheme(object){
		this.props.onChangeTheme(object.value);
	}

	render() {
		let options = [];
		let selected = null;

		if (this.props.themes){
			this.props.themes.map(theme => {
				options.push({
					key: theme.key,
					value: theme.key,
					label: theme.data && theme.data.name
				})
			});

			if (this.props.activeTheme){
				selected = this.props.activeTheme.key;
			}
		}

		let classes = classNames("ptr-theme-selector ptr-view-selection-selector", this.props.classes);
		let content = (
			<UISelect
				key='theme-selector'
				clearable={false}
				classes={classes}
				label='left'
				name={polyglot.t('theme')}
				onChange={this.onChangeTheme}
				options={options}
				placeholder=''
				value={selected}
				disabled={!!this.props.disabled}
			/>
		);

		return (
			<div className="ptr-view-selection-container">
				{content}
			</div>
		);
	}

}

export default ThemeSelector;