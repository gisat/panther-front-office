import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Overlay extends React.PureComponent {

	static propTypes = {
		activeAoi: PropTypes.number
	};

	render() {
		return (
			<div
				className={classNames('ptr-overlay', {
					'open': !this.props.activeAoi
				})}
			>
				<div
					className='ptr-overlay-content'
					style={{
					bottom: 'auto',
					right: 'auto',
					top: 100,
					left: 200
				}}
				>
					<h3>Insert AOI Code</h3>
					<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.</p>
				</div>
			</div>
		);
	}
}

export default Overlay;
