import React from 'react';
import PropTypes from 'prop-types';

import './SnapshotCard.css';
import Icon from "../../../common/atoms/Icon";
import viewUtils from "../../../../util/viewUtils";

class SnapshotCard extends React.PureComponent {

	static propTypes = {
		key: PropTypes.string,
		snapshotKey: PropTypes.string,
		name: PropTypes.string,
		type: PropTypes.string,
		source: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.delete = this.delete.bind(this);
	}

	delete(){
		this.props.onDelete();
	}

	render() {
		let source = this.props.source ? `url(${this.props.source})` : 'linear-gradient(135deg, ' + viewUtils.getPseudorandomColor() + ' 0%, ' + viewUtils.getPseudorandomColor() + ' 100%)';

		let style = {
			backgroundImage: source
		};

		return (
			<div style={style} className="ptr-snapshot-card">
				<div className="ptr-snapshot-card-content">
					<div className="ptr-snapshot-card-name">{this.props.name}</div>
					<div className="ptr-snapshot-card-tools">
						<div className="ptr-snapshot-cart-tool" onClick={this.delete}>
							<Icon icon="delete" />
						</div>
						<div className="ptr-snapshot-cart-tool">
							<a href={this.props.source} download={this.props.name+'.png'}><Icon icon="download" /></a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SnapshotCard;
