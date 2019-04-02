import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import _ from 'lodash';

import Button from "../../../../../../components/common/atoms/Button";
import Input from "../../../../../../components/common/atoms/Input/Input";
import InputWrapper from "../../../../../../components/common/atoms/InputWrapper/InputWrapper";
import Select from "../../../../../../components/common/atoms/Select/Select";

class IndicatorsMetadataConfig extends React.PureComponent {
	static propTypes = {
		attributes: PropTypes.array,
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
		views: PropTypes.array
	};

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onSelect = this.onSelect.bind(this);
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

	onSelect(key, selected) {
		this.props.updateEdited(key, selected.key);
	}

	render() {
		let t = this.props.t;
		let data = {...this.props.data};
		if (this.props.editedData) {
			data = {...data, ...this.props.editedData}
		}

		// TODO add selection of view, attribute and tags
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
					<Select
						disabled={!this.props.editable}
						onChange={(val) => this.onSelect('attributeKey', val)}
						options={this.props.attributes}
						optionLabel="data.nameDisplay"
						optionValue="key"
						unfocusable={this.props.unfocusable}
						value={data && data.attributeKey}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("metadata.names.view")}
				>
					<Select
						disabled={!this.props.editable}
						onChange={(val) => this.onSelect('viewKey', val)}
						options={this.props.views}
						optionLabel="data.nameDisplay"
						optionValue="key"
						unfocusable={this.props.unfocusable}
						value={data && data.viewKey}
					/>
				</InputWrapper>
				<div className="ptr-screen-metadata-buttons">
					<div className="ptr-screen-metadata-buttons-left">
						{this.props.editedData && !_.isEmpty(this.props.editedData) ? (
							<Button
								disabled={this.props.unfocusable}
								ghost
								primary
								onClick={this.props.onSave}
							>{t("saveCapitalized")}</Button>) : null}
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