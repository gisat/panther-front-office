import React from "react";
import moment from "moment";

export const LineChartPopup = props => {
	const data = props.data;

	let value, dateFrom, dateTo;
	if (data.value || data.value === 0) {

		// value
		value = data.value.toLocaleString();

		// period
		let momentTimeFrom = moment(data.date);
		let momentTimeTo = moment(data.dateEnd);

		if (data.xOptions.popupValueFormat) {
			momentTimeFrom = momentTimeFrom.format(data.xOptions.popupValueFormat);
			momentTimeTo = momentTimeTo.format(data.xOptions.popupValueFormat);
		} else {
			momentTimeFrom = momentTimeFrom.format();
			momentTimeTo = momentTimeTo.format();
		}

		dateFrom = momentTimeFrom;
		dateTo = momentTimeTo;
	}

	return (
		<>
			<div className="ptr-popup-header">
				{"DPB: " + data.name}
			</div>
			<div className="ptr-popup-header">
				{"DPB: " + data.name}
			</div>
			{(data.value || data.value === 0) ? (
				<div className="ptr-popup-record-group">
					<div className="ptr-popup-record">
						{<div className="ptr-popup-record-attribute">{dateFrom + ' - ' + dateTo}</div> }
						<div className="ptr-popup-record-value-group">
							{<span className="value">{value}</span>}
							{data.yOptions && data.yOptions.unit ? <span className="unit">{data.yOptions.unit}</span> : null}
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};