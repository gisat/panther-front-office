import React from 'react';

class App extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onMount();
	}

	render() {
		const props = this.props;

		return (
			<>
				<div className="tacrAgritas-header">
					{props.place ? <h1>{props.place.data.nameDisplay}</h1> : null}
				</div>
				<div className="tacrAgritas-content">
					Content
				</div>
				<div className="tacrAgritas-footer">
					Footer
				</div>
			</>
		);
	}
}

export default App;