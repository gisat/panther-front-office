import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from '@gisatcz/ptr-locales';
import _ from 'lodash';

import {Button, Input, InputWrapper} from '@gisatcz/ptr-atoms';

import AttributesSelect from "../../../formComponents/MetadataMultiSelect/AttributesSelect";
import TagsSelect from "../../../formComponents/MetadataMultiSelect/TagsSelect";
import ViewsSelect from "../../../formComponents/MetadataMultiSelect/ViewsSelect";

class IndicatorsConfig extends React.PureComponent {
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
		updateEdited: PropTypes.func,
	};

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);

		this.onAttributeChange = this.onAttributeChange.bind(this);
		this.onTagsChange = this.onTagsChange.bind(this);
		this.onViewChange = this.onViewChange.bind(this);
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

	onAttributeChange(keys) {
		let key = keys && keys.length ? keys[0] : null;
		this.props.updateEdited('attributeKey', key);
	}

	onTagsChange(keys) {
		this.props.updateEdited('tagKeys', keys);
	}

	onViewChange(keys) {
		let key = keys && keys.length ? keys[0] : null;
		this.props.updateEdited('viewKey', key);
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
					label={t("formLabels.description")}
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
					<AttributesSelect
						disabled={!this.props.editable}
						keys={data && data.attributeKey ? [data.attributeKey] : null}
						onChange={this.onAttributeChange}
						singleValue
						unfocusable={this.props.unfocusable}
						withKeyPrefix
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("metadata.names.view")}
				>
					<ViewsSelect
						disabled={!this.props.editable}
						keys={data && data.viewKey ? [data.viewKey] : null}
						onChange={this.onViewChange}
						singleValue
						unfocusable={this.props.unfocusable}
						withKeyPrefix
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

export default withNamespaces(['backOffice'])(IndicatorsConfig);