import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import InputWrapper from "../../../../../../components/common/atoms/InputWrapper/InputWrapper";
import {withNamespaces} from "react-i18next";
import {Button, Input} from '@gisatcz/ptr-atoms';
import ApplicationSelect from "../../../formComponents/ApplicationSelect";
import ScopeSelect from "../../../formComponents/MetadataMultiSelect/ScopeSelect";
import utils from '@gisatcz/ptr-utils';

class LayerTreesConfig extends React.PureComponent {
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
		this.onChangeJsonValue = this.onChangeJsonValue.bind(this);
		this.onScopeChange = this.onScopeChange.bind(this);
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


	onScopeChange(keys) {
		let key = keys && keys.length ? keys[0] : null;
		this.props.updateEdited('scopeKey', key);
	}

	render() {
		let t = this.props.t;
		let data = {...this.props.data};
		if (this.props.editedData) {
			data = {...data, ...this.props.editedData}
		}

		let configuration = utils.getStringFromJson((data && data.structure || ""));
// FIXME - reload scopes on application change
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
					label={t("apps.names.scope")}
				>
					<ScopeSelect
						disabled={!this.props.editable}
						value={data && data.scopeKey || null}
						onChange={this.onScopeChange}
						unfocusable={this.props.unfocusable}
						keys={data && data.scopeKey ? [data.scopeKey] : null}
						singleValue
						withKeyPrefix
					/>
				</InputWrapper>
				<InputWrapper
					label={t("formLabels.configuration")}
				>
					<Input
						unfocusable={this.props.unfocusable}
						disabled={!this.props.editable}
						multiline
						value={configuration}
						onChange={(val) => this.onChangeJsonValue('structure', val)}
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

export default withNamespaces(['backOffice'])(LayerTreesConfig);