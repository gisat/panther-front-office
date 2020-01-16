import React from 'react';
import Header from "./Header";
import PropTypes from "prop-types";
import Biofyzika from "./Biofyzika/presentation";

class App extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		activePeriodKey: PropTypes.string,
		activePlace: PropTypes.object,
		activeScope: PropTypes.object
	};

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
				<Header/>
				<div className="tacrAgritas-content">
					{props.activeScope ? this.renderMonitoring(props.activeScope) : null}


					<div className="tacrAgritas-section">
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu pharetra nisl, in egestas ipsum. Nunc feugiat enim ante, vulputate tristique nunc accumsan at. Nam rutrum gravida magna. Phasellus vitae efficitur nisi, aliquet laoreet massa. Nullam dolor lacus, semper eget egestas a, mattis id augue. Curabitur non urna a eros mattis sodales. Cras eu lacus ligula. Vestibulum efficitur dolor sagittis justo faucibus fermentum. Nulla tempor aliquam iaculis. Nam ultricies, est venenatis tincidunt tempus, diam neque accumsan eros, a convallis libero erat non urna. Aenean molestie ut nisi sed convallis. Proin blandit placerat risus, eu cursus ligula sagittis et. Proin auctor semper tortor, eu sagittis nulla sagittis eu. Proin ac elementum velit. Sed non nisl eu dui tincidunt sollicitudin id quis ante. Nulla sed imperdiet nunc, quis faucibus felis.</p>
						<p>Morbi nec accumsan leo, ut malesuada metus. Nulla rhoncus volutpat quam in hendrerit. In sit amet tristique purus. Sed mollis augue in lacus facilisis interdum. Maecenas feugiat in nibh eget luctus. Fusce id dui lacinia, finibus dolor a, ullamcorper libero. Nullam pellentesque vitae erat at venenatis.</p>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu pharetra nisl, in egestas ipsum. Nunc feugiat enim ante, vulputate tristique nunc accumsan at. Nam rutrum gravida magna. Phasellus vitae efficitur nisi, aliquet laoreet massa. Nullam dolor lacus, semper eget egestas a, mattis id augue. Curabitur non urna a eros mattis sodales. Cras eu lacus ligula. Vestibulum efficitur dolor sagittis justo faucibus fermentum. Nulla tempor aliquam iaculis. Nam ultricies, est venenatis tincidunt tempus, diam neque accumsan eros, a convallis libero erat non urna. Aenean molestie ut nisi sed convallis. Proin blandit placerat risus, eu cursus ligula sagittis et. Proin auctor semper tortor, eu sagittis nulla sagittis eu. Proin ac elementum velit. Sed non nisl eu dui tincidunt sollicitudin id quis ante. Nulla sed imperdiet nunc, quis faucibus felis.</p>
						<p>Morbi nec accumsan leo, ut malesuada metus. Nulla rhoncus volutpat quam in hendrerit. In sit amet tristique purus. Sed mollis augue in lacus facilisis interdum. Maecenas feugiat in nibh eget luctus. Fusce id dui lacinia, finibus dolor a, ullamcorper libero. Nullam pellentesque vitae erat at venenatis.</p>
						<p>Quisque rhoncus ut dolor in iaculis. Nullam hendrerit dolor vitae sapien efficitur, quis placerat ex volutpat. Ut felis diam, iaculis vel est eu, consectetur facilisis mauris. Vivamus pellentesque faucibus justo, at pulvinar augue ornare non. Cras ac nibh ac lorem gravida ultrices in in est. Fusce iaculis volutpat pharetra. Nunc rutrum sem sed massa vestibulum vulputate.</p>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu pharetra nisl, in egestas ipsum. Nunc feugiat enim ante, vulputate tristique nunc accumsan at. Nam rutrum gravida magna. Phasellus vitae efficitur nisi, aliquet laoreet massa. Nullam dolor lacus, semper eget egestas a, mattis id augue. Curabitur non urna a eros mattis sodales. Cras eu lacus ligula. Vestibulum efficitur dolor sagittis justo faucibus fermentum. Nulla tempor aliquam iaculis. Nam ultricies, est venenatis tincidunt tempus, diam neque accumsan eros, a convallis libero erat non urna. Aenean molestie ut nisi sed convallis. Proin blandit placerat risus, eu cursus ligula sagittis et. Proin auctor semper tortor, eu sagittis nulla sagittis eu. Proin ac elementum velit. Sed non nisl eu dui tincidunt sollicitudin id quis ante. Nulla sed imperdiet nunc, quis faucibus felis.</p>
					</div>
				</div>
				<div className="tacrAgritas-footer">
					Footer
				</div>
			</>
		);
	}

	renderMonitoring(scope) {
		switch (scope.key) {
			case 'biofyzika':
				return (
					<Biofyzika
						data={this.props.data}
						place={this.props.activePlace}
						activePeriodKey={this.props.activePeriodKey}
						scope={scope}
					/>
				);
			case 'produktivita':
				return <div>Produktivita</div>;
			case 'historie':
				return <div>Historie</div>;
			default:
				return null;
		}
	}
}

export default App;