
                                
import React from 'react';
import PropTypes from 'prop-types';

class CheckButton extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        checked: PropTypes.bool,
        onClick: PropTypes.func,
    }

    render() {
        const background = this.props.checked ? 'green' : 'red';
        return (
            <div className="ptr-button inverted" style={{marginLeft: '10px', background: background}} onClick={this.props.onClick}>
                <label className="ptr-button-caption" style={{cursor: 'pointer'}}>
                    <input
                        type="checkbox"
                        checked={this.props.checked}
                        style={{marginRight: '5px'}}
                        onChange={this.props.onClick}
                    />
                    <span>{this.props.title}</span>
                </label>
            </div>
        )
    }
}

export default CheckButton;


