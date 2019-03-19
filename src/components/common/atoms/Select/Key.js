import React from 'react';

class Key extends React.PureComponent {
	render() {
        const keyToRender = this.props.value ? this.props.value.toString().substring(0,4) : '';
		return (
            keyToRender ? <span className="option-id" title = {this.props.value}>
                {keyToRender}
            </span> : null
		);
	}
}

export default Key;