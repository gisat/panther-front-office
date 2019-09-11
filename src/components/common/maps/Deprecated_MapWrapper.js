import React from 'react';
import WorldWindMap from './Deprecated_WorldWindMap/presentation';
import PropTypes from "prop-types";

class Deprecated_MapWrapper extends React.PureComponent {

	static propTypes = {
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		onWorldWindNavigatorChange: PropTypes.func,
		setActiveMapKey: PropTypes.func,
	};

	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount(this.props.layersTreeLoaded);
		}
	}

	componentWillUnmount() {
		if (this.props.onUnmount) {
			this.props.onUnmount();
		}
	}

	render() {
		//If childrens passed
		if(this.props.children) {
			const {children, ...propsWithoutChildren} = this.props;
			return React.cloneElement(this.props.children, {...propsWithoutChildren});
		} else {
			return (<WorldWindMap
				{...this.props}
			/>)
		}
	}
}

export default Deprecated_MapWrapper;
