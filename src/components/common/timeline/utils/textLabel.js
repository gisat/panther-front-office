import React from 'react';
import PropTypes from 'prop-types';

class TextLabel extends React.PureComponent {

    static propTypes = {
        label: PropTypes.string.isRequired,
        className: PropTypes.string,
        x: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        vertical: PropTypes.bool,
    };

    static defaultProps = {
        vertical: false,
        className: '',
    }

	constructor(props){
        super(props);
		this.node = React.createRef();
        this.state = {
            elHeight: 0,
            elWidth: 0,
        };
    }
    
    componentDidMount() {
        const elHeight = this.node.current.getBoundingClientRect().height;
        const elWidth = this.node.current.getBoundingClientRect().width;
        this.setState({elHeight, elWidth});
    }

	render() {
        const {label, vertical, height, x, className} = this.props;
        const {elHeight, elWidth} = this.state;
        
        const xTransform = vertical ? -height + 3 : x + 3;
        const yTransform = vertical ? x + elHeight + 3 : height - 2;
        const transform = vertical ? `scale(-1,1)` : '';
        // const xTransform = vertical ? x + elHeight + 3 : x + 3;
        // const transform = vertical ? `rotate(270, ${xTransform}, ${height})` : ''
		return (
            <g>
                <rect 
                    transform={transform}
                    x={xTransform}
                    y={yTransform - elHeight + 3}
                    width={elWidth}
                    height={elHeight}
                    style={{stroke: 'none'}}
                    >
                </rect>
                <text
                    ref={this.node}
                    transform={transform}
                    x={xTransform}
                    y={yTransform}
                    className={className}>
                    {label}
                </text>
            </g>
		);
	}
}

export default TextLabel;

