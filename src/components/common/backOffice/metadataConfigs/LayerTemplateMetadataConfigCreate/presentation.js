import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import Input from "../../../atoms/Input/Input";
import InputWrapper from "../../../atoms/InputWrapper/InputWrapper";
import Key from 'apps/backOffice/components/Key'
import {withNamespaces} from "react-i18next";

class LayerTemplateMetadataConfigCreate extends React.PureComponent {
	static propTypes = {
        data: PropTypes.object,
		editedData: PropTypes.object,
		layerTemplateKey: PropTypes.string,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		onSave: PropTypes.func,
		updateEdited: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeNameInternal = this.onChangeNameInternal.bind(this);
	}

	componentDidMount() {
		this.props.onMount(this.props.layerTemplateKey);
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
				<h2>
					<Key value={this.props.layerTemplateKey} />
				</h2>
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
				<button onClick={this.props.onDelete}>Delete</button>
			</div>
		);
	}
}

export default withNamespaces()(LayerTemplateMetadataConfigCreate);