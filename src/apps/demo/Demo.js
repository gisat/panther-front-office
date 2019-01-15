import React from 'react';
import Days from "../../components/specific/Demo/Days";
import Months from "../../components/specific/Demo/Months";
// import './style.css';

class Demo extends React.PureComponent {
	render() {
		return (
			<div id="demo">
				<Days/>
				<br/>
				<Months/>
			</div>
		);
	}
}

export default Demo;