import React from 'react';
import PropTypes from "prop-types";
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
		this.props.updateEdited(this.props.layerTemplateKey, 'nameDisplay', value);
	}

	onChangeNameInternal(value) {
		this.props.updateEdited(this.props.layerTemplateKey, 'nameInternal', value);
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
			</div>
		);
	}
}

export default withNamespaces()(LayerTemplateMetadataConfig);