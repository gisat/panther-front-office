import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import _ from 'lodash';

import Button from "../../../../../../components/common/atoms/Button";
import Input from "../../../../../../components/common/atoms/Input/Input";
import InputWrapper from "../../../../../../components/common/atoms/InputWrapper/InputWrapper";
import MultiSelect from "../../../../../../components/common/atoms/Select/MultiSelect";

class IndicatorsMetadataConfig extends React.PureComponent {
	static propTypes = {
		attributes: PropTypes.array,
		data: PropTypes.object,
		deletable: PropTypes.bool,
		editable: PropTypes.bool,
		editedData: PropTypes.object,
		enableAttributeCreate: PropTypes.bool,
		enableTagCreate: PropTypes.bool,
		enableViewCreate: PropTypes.bool,
		itemKey: PropTypes.string,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		onAttributeAdd: PropTypes.func,
		onAttributeClick: PropTypes.func,
		onSave: PropTypes.func,
		onDelete: PropTypes.func,
		onTagAdd: PropTypes.func,
		onTagClick: PropTypes.func,
		onViewAdd: PropTypes.func,
		onViewClick: PropTypes.func,
		tags: PropTypes.array,
		unfocusable: PropTypes.bool,
		updateEdited: PropTypes.func,
		views: PropTypes.array
	};

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onSelect = this.onSelect.bind(this);

		this.onAttributeAdd = this.onAttributeAdd.bind(this);
		this.onAttributeChange = this.onAttributeChange.bind(this);
		this.onAttributeOpen = this.onAttributeOpen.bind(this);

		this.onTagsChange = this.onTagsChange.bind(this);
		this.onTagOpen = this.onTagOpen.bind(this);

		this.onViewAdd = this.onViewAdd.bind(this);
		this.onViewChange = this.onViewChange.bind(this);
		this.onViewOpen = this.onViewOpen.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	onChange(columnKey, value) {
		this.props.updateEdited(columnKey, value);
	}

	onSelect(columnKey, selected) {
		let selectedKey = selected ? selected.key : null;
		this.props.updateEdited(columnKey, selectedKey);
	}

	onAttributeAdd(option) {
		this.props.onAttributeAdd(option.key);
		this.props.updateEdited('attributeKey', option.key);
	}

	onAttributeChange(selected) {
		let key = selected && selected.length ? selected[0].key : null;
		this.props.updateEdited('attributeKey', key);
	}

	onAttributeOpen(option) {
		this.props.onAttributeClick(option.key);
	}

	onTagAdd(selectedKeys, option) {
		this.props.onTagAdd(option.key);
		let keys = selectedKeys ? [...selectedKeys, option.key] : [option.key];
		this.props.updateEdited('tagKeys', keys);
	}

	onTagsChange(selectedTags) {
		let tagKeys = selectedTags.map(tag => tag.key);
		this.props.updateEdited('tagKeys', tagKeys);
	}

	onTagOpen(option) {
		this.props.onTagClick(option.key);
	}

	onViewAdd(option) {
		this.props.onViewAdd(option.key);
		this.props.updateEdited('viewKey', option.key);
	}

	onViewChange(selected) {
		let key = selected && selected.length ? selected[0].key : null;
		this.props.updateEdited('viewKey', key);
	}

	onViewOpen(option) {
		this.props.onViewClick(option.key);
	}

	render() {
		let t = this.props.t;
		let data = {...this.props.data};
		if (this.props.editedData) {
			data = {...data, ...this.props.editedData}
		}

		let tagKeys = data && data.tagKeys;

		return (
			<div>
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
					label={t("metadata.formLabels.description")}
				>
					<Input
						disabled={!this.props.editable}
						unfocusable={this.props.unfocusable}
						value={data && data.description || ""}
						onChange={(val) => this.onChange('description', val)}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("metadata.names.attribute")}
				>
					<MultiSelect
						clearable
						creatable={this.props.enableAttributeCreate}
						disabled={!this.props.editable}
						options={this.props.attributes}
						optionLabel="data.nameDisplay"
						optionValue="key"
						selectedValues={data && data.attributeKey}
						singleValue
						unfocusable={this.props.unfocusable}
						withKeyPrefix

						onAdd={this.onAttributeAdd}
						onChange={this.onAttributeChange}
						onOptionLabelClick={this.onAttributeOpen}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("metadata.names.view")}
				>
					<MultiSelect
						clearable
						creatable={this.props.enableViewCreate}
						disabled={!this.props.editable}
						options={this.props.views}
						optionLabel="data.nameDisplay"
						optionValue="key"
						selectedValues={data && data.viewKey}
						singleValue
						unfocusable={this.props.unfocusable}
						withKeyPrefix

						onAdd={this.onViewAdd}
						onChange={this.onViewChange}
						onOptionLabelClick={this.onViewOpen}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("metadata.names.tag_plural")}
				>
					<MultiSelect
						creatable={this.props.enableTagCreate}
						disabled={!this.props.editable}
						onAdd={this.onTagAdd.bind(this, tagKeys)}
						options = {this.props.tags}
						optionLabel = 'data.nameDisplay'
						optionValue = 'key'
						selectedValues = {tagKeys}
						unfocusable={this.props.unfocusable}
						withKeyPrefix

						onChange={this.onTagsChange}
						onOptionLabelClick={this.onTagOpen}
					/>
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

export default withNamespaces(['backOffice'])(IndicatorsMetadataConfig);