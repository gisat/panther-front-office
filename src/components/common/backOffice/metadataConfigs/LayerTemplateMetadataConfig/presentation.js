import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import Input from "../../../atoms/Input/Input";
import InputWrapper from "../../../atoms/InputWrapper/InputWrapper";
import {withNamespaces} from "react-i18next";

class LayerTemplateMetadataConfig extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
		editedData: PropTypes.object,
		itemKey: PropTypes.string,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		onSave: PropTypes.func,
		onDelete: PropTypes.func,
		updateEdited: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	onChange(key, value) {
		this.props.updateEdited(key, value);
	}

	render() {
		let t = this.props.t;
		let data = {...this.props.data};
		if (this.props.editedData) {
			data = {...data, ...this.props.editedData}
		}

		return (
			<div>
				<InputWrapper
					required
					label={t("nameCapitalized")}
				>
					<Input
						value={data && data.nameDisplay || ""}
						onChange={(val) => this.onChange('nameDisplay', val)}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("labels.nameInternal")}
				>
					<Input
						value={data && data.nameInternal || ""}
						onChange={(val) => this.onChange('nameInternal', val)}
					/>
				</InputWrapper>
				{this.props.editedData && !_.isEmpty(this.props.editedData) ? <button onClick={this.props.onSave}>Save</button> : null}
				<button onClick={() => this.props.onDelete(this.props.data)}>Delete</button>
			</div>
		);
	}
}

export default withNamespaces()(LayerTemplateMetadataConfig);