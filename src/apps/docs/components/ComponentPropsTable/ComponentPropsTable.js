import React from 'react';
import _ from "lodash";
import Icon from "../../../../components/common/atoms/Icon";

import './style.scss';

class ComponentPropsTable extends React.PureComponent {
	render() {
		const content = this.props.content;

		return (
			<div className="ptr-docs-props-table-container">
				<table className="ptr-docs-props-table">
					<tbody>
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Default</th>
						<th>Required</th>
						<th>Description</th>
					</tr>
					{content.map((prop, index) => {
							return _.isEmpty(prop) ? (
								<tr key={index} className="ptr-docs-props-table-empty-row">
									<td colSpan={5}><div></div></td>
								</tr>
							) : (
								<tr key={index}>
									<td className="ptr-docs-props-table-name">{prop.name}</td>
									<td className="ptr-docs-props-table-type">{prop.type}</td>
									<td className="ptr-docs-props-table-default">{prop.default}</td>
									<td className="ptr-docs-props-table-required">{prop.required ? <Icon icon="circle"/> : null}</td>
									{this.renderDescription(prop.description, prop.objectPropsDescription)}
								</tr>)
						}
					)}
					</tbody>
				</table>
			</div>
		);
	}

	renderDescription(desc, objectPropsDesc) {
		let content = (
			<>
				{desc}
				{objectPropsDesc ? (
					<div className="ptr-docs-props-table-description-object">
						{objectPropsDesc.map((objectProp, index) => (
							<div key={index}>
								<span>{objectProp.name + ' [' + objectProp.type + ']: '}</span>
								{objectProp.description}
							</div>
						))}
					</div>
				) : null}
			</>
		);

		return (
			<td className="ptr-docs-props-table-description">{content}</td>
		);
	}
}

export default ComponentPropsTable;