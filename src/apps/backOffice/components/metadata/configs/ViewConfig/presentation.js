import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import _ from 'lodash';

import ApplicationSelect from "../../../formComponents/ApplicationSelect";
import Button from "../../../../../../components/common/atoms/Button";
import Input from "../../../../../../components/common/atoms/Input/Input";
import InputWrapper, {InputWrapperInfo} from "../../../../../../components/common/atoms/InputWrapper/InputWrapper";

import cz from "./locales/cz";
import en from "./locales/en";
import {utils} from "panther-utils";
import i18next from "i18next";

// add local locales
utils.addI18nResources(i18next,'ViewMetadataConfig', {cz, en});

class ViewConfig extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
		deletable: PropTypes.bool,
		editable: PropTypes.bool,
		editedData: PropTypes.object,
		itemKey: PropTypes.string,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		onSave: PropTypes.func,
		onDelete: PropTypes.func,
		unfocusable: PropTypes.bool,
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

	onChangeJsonValue(key, value) {
		try{
			const parsedValue = JSON.parse(value);
			this.onChange(key, parsedValue);
		}

		catch(e) {
			this.onChange(key, value);
		}
	}

	render() {
		let t = this.props.t;
		let data = {...this.props.data};
		if (this.props.editedData) {
			data = {...data, ...this.props.editedData}
		}

		let stateValue = utils.getStringFromJson((data && data.state || ""));

		return (
			<div>
				<InputWrapper
					required
					label={t("formLabels.application")}
				>
					<ApplicationSelect
						disabled={!this.props.editable}
						value={data && data.applicationKey || null}
						onChange={this.onChange}
						unfocusable={this.props.unfocusable}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("formLabels.name")}
				>
					<Input
						disabled={!this.props.editable}
						unfocusable={this.props.unfocusable}
						value={data && data.nameDisplay || ""}
						onChange={(val) => this.onChange('nameDisplay', val)}
					/>
				</InputWrapper>
				<InputWrapper
					label={t("formLabels.nameInternal")}
				>
					<Input
						disabled={!this.props.editable}
						unfocusable={this.props.unfocusable}
						value={data && data.nameInternal || ""}
						onChange={(val) => this.onChange('nameInternal', val)}
					/>
				</InputWrapper>
				<InputWrapper
					label={t("formLabels.description")}
				>
					<Input
						multiline
						disabled={!this.props.editable}
						unfocusable={this.props.unfocusable}
						value={data && data.description || ""}
						onChange={(val) => this.onChange('description', val)}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("formLabels.state")}
				>
					<Input
						multiline
						disabled={!this.props.editable}
						unfocusable={this.props.unfocusable}
						value={stateValue}
						onChange={(val) => this.onChangeJsonValue('state', val)}
					/>
				</InputWrapper>
				<div className="ptr-bo-screen-buttons">
					<div className="ptr-bo-screen-buttons-left">
						<Button
							disabled={this.props.unfocusable || !this.props.editedData || _.isEmpty(this.props.editedData)}
							ghost
							primary
							onClick={this.props.onSave}
						>{t("saveCapitalized")}</Button>
					</div>
					<div className="ptr-bo-screen-buttons-right">
						<Button
							disabled={this.props.unfocusable || !this.props.deletable}
							ghost
							onClick={() => this.props.onDelete(this.props.data)}
						>{t("deleteCapitalized")}</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice', 'ViewMetadataConfig'])(ViewConfig);