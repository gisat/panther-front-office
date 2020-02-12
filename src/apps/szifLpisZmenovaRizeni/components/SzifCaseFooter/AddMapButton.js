import React from 'react';
import PropTypes from 'prop-types';
import Button from "../../../../components/common/atoms/Button";
import Icon from "../../../../components/common/atoms/Icon";
import './style.scss';
class AddMap extends React.PureComponent {

	static propTypes = {
		addMap: PropTypes.func,
		disabled: PropTypes.bool,
	};


	render() {
		const {addMap, disabled} = this.props;
		
		return (
				<Button
					disabled={disabled}
					ghost
					onClick={() => {addMap()}}
					className='ptr-dromasLpisChangeReviewHeader-map-add'
				>
					<Icon icon="plus" inverted/>
					<div className={'ptr-button-caption'}>
						Přidat mapu
					</div>
				</Button>
		);
	}
}

export default AddMap;
