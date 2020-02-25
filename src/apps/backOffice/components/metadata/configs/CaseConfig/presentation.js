import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces, localesUtils} from '@gisatcz/ptr-locales';
import _ from 'lodash';

import ApplicationSelect from "../../../formComponents/ApplicationSelect";
import {Button, Input} from '@gisatcz/ptr-atoms';
import InputWrapper, {InputWrapperInfo} from "../../../../../../components/common/atoms/InputWrapper/InputWrapper";
import TagsSelect from "../../../formComponents/MetadataMultiSelect/TagsSelect";

import cz from "./locales/cz";
import en from "./locales/en";

// add local locales
localesUtils.addI18nResources('backOffice_CaseConfig', {cz, en});

class CaseConfig extends React.PureComponent {
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
		this.onTagsChange = this.onTagsChange.bind(this);
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
	
	onTagsChange(keys) {
		this.props.updateEdited('tagKeys', keys);
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
					label={t("formLabels.application")}
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
					required
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
					label={t("metadata.names.tag_plural")}
				>
					<TagsSelect
						disabled={!this.props.editable}
						keys={data && data.tagKeys}
						onChange={this.onTagsChange}
						unfocusable={this.props.unfocusable}
						withKeyPrefix
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

export default withNamespaces(['backOffice', 'backOffice_CaseConfig'])(CaseConfig);