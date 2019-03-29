import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import _ from 'lodash';

import ApplicationSelect from "../formComponents/ApplicationSelect";
import Button from "../../../../../../components/common/atoms/Button";
import Input from "../../../../../../components/common/atoms/Input/Input";
import InputWrapper from "../../../../../../components/common/atoms/InputWrapper/InputWrapper";

class TagMetadataConfig extends React.PureComponent {
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

export default withNamespaces(['backOffice'])(TagMetadataConfig);