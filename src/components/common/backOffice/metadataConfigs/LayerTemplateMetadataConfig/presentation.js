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
		layerTemplateKey: PropTypes.string,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		onSave: PropTypes.func,
		onDelete: PropTypes.func,
		updateEdited: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeNameInternal = this.onChangeNameInternal.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	onChangeName(value) {
		this.props.updateEdited('nameDisplay', value);
	}

	onChangeNameInternal(value) {
		this.props.updateEdited('nameInternal', value);
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
						onChange={this.onChangeName}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("labels.nameInternal")}
				>
					<Input
						value={data && data.nameInternal || ""}
						onChange={this.onChangeNameInternal}
					/>
				</InputWrapper>
				{this.props.editedData && !_.isEmpty(this.props.editedData) ? <button onClick={this.props.onSave}>Save</button> : null}
				<button onClick={() => this.props.onDelete(this.props.data)}>Delete</button>
			</div>
		);
	}
}

export default withNamespaces()(LayerTemplateMetadataConfig);