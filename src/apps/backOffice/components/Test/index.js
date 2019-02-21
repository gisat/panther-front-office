import React from 'react';

import './style.scss';

class Test extends React.PureComponent {
	render() {
		return (
			<div className="ptr-bo-test">
				<div className="testy ptr-light">
					<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
				</div>
				<div className="testy ptr-dark">
					<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
				</div>
				<div className="testy t2 ptr-light">
					<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
				</div>
				<div className="testy t2 ptr-dark">
					<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
				</div>
				<div className="testy ptr-bo-colours">
					<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
				</div>
				<div className="testy t2 ptr-bo-colours">
					<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
				</div>
				<div className="testy t3 ptr-bo-colours">
					<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
				</div>
			</div>
		);
	}
}

export default Test;