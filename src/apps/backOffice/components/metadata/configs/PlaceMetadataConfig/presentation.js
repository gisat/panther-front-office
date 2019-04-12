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
import utils from "../../../../../../utils/utils";

// add local locales
utils.addI18nResources('PlaceMetadataConfig', {cz, en});

class PlaceMetadataConfig extends React.PureComponent {
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

		let bbox = utils.getStringFromJson((data && data.bbox || ""));
		let geometry = utils.getStringFromJson((data && data.geometry || ""));

		return (
			<div>
				<InputWrapper
					required
					label={t("metadata.formLabels.application")}
				>
					<ApplicationSelect
						disabled={!this.props.editable}
						value={data && data.applicationKey || ""}
						onChange={this.onChange}
						unfocusable={this.props.unfocusable}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("metadata.formLabels.name")}
				>
					<Input
						disabled={!this.props.editable}
						unfocusable={this.props.unfocusable}
						value={data && data.nameDisplay || ""}
						onChange={(val) => this.onChange('nameDisplay', val)}
					/>
				</InputWrapper>
				<InputWrapper
					label={t("metadata.formLabels.nameInternal")}
				>
					<Input
						disabled={!this.props.editable}
						unfocusable={this.props.unfocusable}
						value={data && data.nameInternal || ""}
						onChange={(val) => this.onChange('nameInternal', val)}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("metadata.formLabels.description")}
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
					label={t("metadata.formLabels.boundingBox")}
				>
					<Input
						unfocusable={this.props.unfocusable}
						disabled={!this.props.editable}
						multiline
						value={bbox}
						onChange={(val) => this.onChangeJsonValue('bbox', val)}
					/>
					<InputWrapperInfo>{t("PlaceMetadataConfig:geometryDescription")}</InputWrapperInfo>
				</InputWrapper>
				<InputWrapper
					label={t("metadata.formLabels.geometry")}
				>
					<Input
						unfocusable={this.props.unfocusable}
						disabled={!this.props.editable}
						multiline
						value={geometry}
						onChange={(val) => this.onChangeJsonValue('geometry', val)}
					/>
					<InputWrapperInfo>{t("PlaceMetadataConfig:geometryDescription")}</InputWrapperInfo>
				</InputWrapper>
				<div className="ptr-screen-metadata-buttons">
					<div className="ptr-screen-metadata-buttons-left">
						<Button
							disabled={this.props.unfocusable || !this.props.editedData || _.isEmpty(this.props.editedData)}
							ghost
							primary
							onClick={this.props.onSave}
						>{t("saveCapitalized")}</Button>
					</div>
					<div className="ptr-screen-metadata-buttons-right">
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

export default withNamespaces(['backOffice', 'PlaceMetadataConfig'])(PlaceMetadataConfig);