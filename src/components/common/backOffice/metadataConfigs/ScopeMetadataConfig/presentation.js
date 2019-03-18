import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import Input from "../../../atoms/Input/Input";
import InputWrapper from "../../../atoms/InputWrapper/InputWrapper";
import {withNamespaces} from "react-i18next";
import Button from "../../../../common/atoms/Button";

class ScopeMetadataConfig extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
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

		const configurationObject = data && data.configuration || "";

		let configuration;
		if (configurationObject && typeof configurationObject === "object") {
            configuration = JSON.stringify(configurationObject, null, 2)  ;
        } else {
			configuration = configurationObject;
		}

		return (
			<div>
				<InputWrapper
					required
					label={t("nameCapitalized")}
				>
					<Input
						unfocusable={this.props.unfocusable}
						value={data && data.nameDisplay || ""}
						onChange={(val) => this.onChange('nameDisplay', val)}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("labels.nameInternal")}
				>
					<Input
						unfocusable={this.props.unfocusable}
						value={data && data.nameInternal || ""}
						onChange={(val) => this.onChange('nameInternal', val)}
					/>
				</InputWrapper>
				<InputWrapper
					required
					label={t("labels.description")}
				>
					<Input
						unfocusable={this.props.unfocusable}
						value={data && data.description || ""}
						onChange={(val) => this.onChange('description', val)}
					/>
				</InputWrapper>
				<InputWrapper
					label={t("labels.configuration")}
				>
					<textarea
						tabIndex={this.props.unfocusable ? -1 : 0}
						value={configuration} 
						onChange={(evt) => this.onChangeJsonValue('configuration', evt.target.value)} 
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
							disabled={this.props.unfocusable}
							ghost
							onClick={() => this.props.onDelete(this.props.data)}
						>{t("deleteCapitalized")}</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(ScopeMetadataConfig);