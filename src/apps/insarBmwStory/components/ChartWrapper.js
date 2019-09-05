import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import HoverContext from "../../../components/common/HoverHandler/context";

/* This wrapper is a hack for bringing selected line to the top of the chart.*/
class ChartWrapper extends React.PureComponent {
	static contextType = HoverContext;

	render() {
		let selectedItem = this.context && this.context.selectedItems && this.context.selectedItems[0];
		let selected;
		let data = [];

		if (selectedItem) {
			_.forEach(this.props.data, item => {
				if (item.id === selectedItem) {
					selected = item;
				}
				data.push(item);
			});

			if (selected) {
				data.push(selected);
			}

		} else {
			data = this.props.data;
		}

		return (
			<>
				{React.cloneElement(this.props.children, {data})}
			</>
		);
	}
}

export default ChartWrapper;

