import React from 'react';
import PropTypes from 'prop-types';

const SIZE = 24;

class MapsGridIcon extends React.PureComponent {

	static propTypes = {
		columns: PropTypes.number,
		rows: PropTypes.number,
		selected: PropTypes.number
	};

	render() {
		return (
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				width={SIZE + "px"}
				height={SIZE + "px"}
				viewBox={"0 0 " + SIZE + " " + SIZE}
				xmlSpace="preserve"
				className="ptr-maps-grid-icon"
			>
				{this.renderContent()}
			</svg>
		);
	}

	renderContent(){
		let rows = this.props.rows;
		let cols = this.props.columns;
		let sel = this.props.selected;

		let content = [];
		let count = 0;
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				content.push(
					<rect
						key={count}
						className={count === sel ? "selected" : ""}
						x={1 + (SIZE/cols)*j}
						y={1 + (SIZE/rows)*i}
						width={SIZE/cols - 1}
						height={SIZE/rows - 1}
						strokeWidth={0}
					/>
				);
				count++;
			}
		}

		return content;

		// if (c === 1 && r === 1){
		// 	return (
		// 		<g>
		// 			<rect className="selected" x="1" y="1" width="22" height="22" />
		// 		</g>
		// 	);
		// } else if (c === 2 && r === 1){
		// 	return (
		// 		<g>
		// 			<rect className="selected" x="1" y="1" width="10" height="22" />
		// 			<rect className="selected" x="13" y="1" width="10" height="22" />
		// 		</g>
		// 	);
		// } else if (c === 2 && r === 2){
		// 	return (
		// 		<g>
		// 			<rect className="selected" x="1" y="1" width="10" height="10" />
		// 			<rect className="selected" x="13" y="1" width="10" height="10" />
		// 			<rect className="selected" x="1" y="13" width="10" height="10" />
		// 			<rect className="selected" x="13" y="13" width="10" height="10" />
		// 		</g>
		// 	);
		// } else if (c === 3 && r === 2){
		// 	return (
		// 		<g>
		// 			<rect className="selected" x="1" y="1" width="6" height="10" />
		// 			<rect className="selected" x="9" y="1" width="6" height="10" />
		// 			<rect className="selected" x="17" y="1" width="6" height="10" />
		// 			<rect className="selected" x="1" y="13" width="6" height="10" />
		// 			<rect className="selected" x="9" y="13" width="6" height="10" />
		// 			<rect className="selected" x="17" y="13" width="6" height="10" />
		// 		</g>
		// 	);
		// } else if (c === 3 && r === 3){
		// 	return (
		// 		<g>
		// 			<rect className="selected" x="1" y="1" width="6" height="6" />
		// 			<rect className="selected" x="9" y="1" width="6" height="6" />
		// 			<rect className="selected" x="17" y="1" width="6" height="6" />
		// 			<rect className="selected" x="1" y="9" width="6" height="6" />
		// 			<rect className="selected" x="9" y="9" width="6" height="6" />
		// 			<rect className="selected" x="17" y="9" width="6" height="6" />
		// 			<rect className="selected" x="1" y="17" width="6" height="6" />
		// 			<rect className="selected" x="9" y="17" width="6" height="6" />
		// 			<rect className="selected" x="17" y="17" width="6" height="6" />
		// 		</g>
		// 	);
		// } else if (c === 4 && r === 3){
		// 	return (
		// 		<g>
		// 			<rect className="selected" x="1" y="1" width="4" height="6" />
		// 			<rect className="selected" x="7" y="1" width="4" height="6" />
		// 			<rect className="selected" x="13" y="1" width="4" height="6" />
		// 			<rect className="selected" x="19" y="1" width="4" height="6" />
		// 			<rect className="selected" x="1" y="9" width="4" height="6" />
		// 			<rect className="selected" x="7" y="9" width="4" height="6" />
		// 			<rect className="selected" x="13" y="9" width="4" height="6" />
		// 			<rect className="selected" x="19" y="9" width="4" height="6" />
		// 			<rect className="selected" x="1" y="17" width="4" height="6" />
		// 			<rect className="selected" x="7" y="17" width="4" height="6" />
		// 			<rect className="selected" x="13" y="17" width="4" height="6" />
		// 			<rect className="selected" x="19" y="17" width="4" height="6" />
		// 		</g>
		// 	);
		// }
	};
}

export default MapsGridIcon;
