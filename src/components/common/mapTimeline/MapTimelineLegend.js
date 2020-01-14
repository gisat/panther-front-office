import React from 'react';
import PropTypes from 'prop-types';
class MapTimelineLegand extends React.PureComponent {
	static propTypes = {
		layers: PropTypes.array,					//which layers display in timeline
	};

	static defaultProps = {
		layers: []
	}

	render() {
		const {layers} = this.props;

		return (
			<div className={'ptr-maptimelinelegend'}>
                <span>
                    Sentinel
                </span>
                <span>
                    ortofoto
                </span>
			</div>
		);

	}

}

export default MapTimelineLegand;
