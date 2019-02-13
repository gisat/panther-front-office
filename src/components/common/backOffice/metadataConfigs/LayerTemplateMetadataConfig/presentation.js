import React from 'react';
import PropTypes from "prop-types";
import Input from "../../../atoms/Input/Input";
import InputWrapper from "../../../atoms/InputWrapper/InputWrapper";
import {withNamespaces} from "react-i18next";

class LayerTemplateMetadataConfig extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
		layerTemplateKey: PropTypes.string,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.onChangeName = this.onChangeName.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	onChangeName() {
		debugger;
	}

	render() {
		let t = this.props.t;
		let data = this.props.data;

		return (
			<div>
				<InputWrapper
					required
					label={t("Name")}
				>
					<Input
						value={data && data.nameDisplay || ""}
						onChange={this.onChangeName}
					/>
				</InputWrapper>
			</div>
		);
	}
}

export default withNamespaces()(LayerTemplateMetadataConfig);