import React from 'react';
import PropTypes from 'prop-types';

class User extends React.PureComponent {

	static propTypes = {
		user: PropTypes.object,
		onMount: PropTypes.bool,
	};

	componentDidMount() {
		const {onMount} = this.props;
		if(typeof onMount) {
			onMount();
		}
	}

	render() {
		const {user} = this.props;	

		if (user) {
			let name = user.data.name || user.data.email;

			return (
				<div>
					{name}
				</div>
			);

		} else {
			return null;
		}

	}
}

export default User;
