import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import utils from "../../../../utils/utils.js";
import './style.scss';
import Button from "../../../../components/common/atoms/Button";
import InputWrapper from "../../../../components/common/atoms/InputWrapper/InputWrapper";
import Input from "../../../../components/common/atoms/Input/Input";
import InputFile from "../../../../components/common/atoms/InputFile/InputFile";

const fields = {
	caseKey: "Název řízení",
	submitDate: "Datum podání ohlášení",
	codeDpb: "Kód DPB",
	codeJi: "Kód JI",
	changeDescription: "Popis důvodu pro aktualizaci LPIS",
	changeDescriptionPlace: "Určení místa změny v terénu",
	changeDescriptionOther: "Další informace",
	geometryBefore: "Původní hranice DPB",
	geometryAfter: "Návrh zákresu nové hranice DPB",

}
class SzifCaseForm extends React.PureComponent {

	static propTypes = {
		activeEditedCase: PropTypes.object,
		onMount: PropTypes.func,
		createLpisCase: PropTypes.func,
		createNewActiveEditedCase: PropTypes.func,
		editActiveEditedCase: PropTypes.func,
		clearActiveEditedCase: PropTypes.func,
		switchScreen: PropTypes.func,
	};

	static defaultProps = {
		activeEditedCase: {}
	}
	constructor(props) {
		super(props);
		this.switchScreen = props.switchScreen.bind(this, 'szifCaseTable');
		this.onChange = this.onChange.bind(this);
		this.onFileInputChanged = this.onFileInputChanged.bind(this);
		this.onClickSendAndCreateNewOne = this.onClickSendAndCreateNewOne.bind(this);
		this.onClickSendAndReturnBack = this.onClickSendAndReturnBack.bind(this);
		this.onClickClear = this.onClickClear.bind(this);

	}

	componentDidMount() {
		const {onMount, activeEditedCase} = this.props;
		const activeNewEditedCaseKey = activeEditedCase && activeEditedCase.key;
		onMount(activeNewEditedCaseKey);
	}

	onClickSendAndCreateNewOne() {
		if (this.validateForm()){
			this.props.createLpisCase();
			this.props.createNewActiveEditedCase();
			this.resetFileInputs();
		}
	}

	onClickSendAndReturnBack() {
		if (this.validateForm()){
			this.props.createLpisCase();
			this.props.clearActiveEditedCase();
			this.resetFileInputs();
			this.switchScreen();
		}
	}

	onClickClear() {
		this.props.clearActiveEditedCase();
	}

	onChange(key, value) {
		this.props.editActiveEditedCase(key, value);
	}

	onFileInputChanged(event) {
		const key = event.target.name;
		const files = event.target.files;
		this.updateFiles(key, files);
	}

	updateFiles(key, newFiles) {
		const files = [...newFiles].map((file) => {
			const uuid = utils.guid();
			return {
					identifier: uuid,
					file: file,
			}
		})

		this.props.editActiveEditedCase(
			key,
			{
				identifiers: files.map((f) => f.identifier),
				names: files.map((f) => f.file.name),
			},
			files
		);	
	}

	validateForm() {
		const {activeEditedCase} = this.props;
		const data = activeEditedCase && activeEditedCase.data;
		const files = activeEditedCase && activeEditedCase.files;

		if (!data.submitDate || data.submitDate.length === 0){
			window.alert(`Vyplňte pole ${fields["submitDate"]} !`);
			return false;
		}
		if (!data.codeDpb || data.codeDpb.length === 0){
			window.alert(`Vyplňte pole ${fields["codeDpb"]} !`);
			return false;
		}
		if (!data.codeJi || data.codeJi.length === 0){
			window.alert(`Vyplňte pole ${fields["codeJi"]} !`);
			return false;
		}
		if (!data.caseKey || data.caseKey.length === 0){
			window.alert(`Vyplňte pole ${fields["caseKey"]} !`);
			return false;
		}
		if (!data.changeDescription || data.changeDescription.length === 0){
			window.alert(`Vyplňte pole ${fields["changeDescription"]} !`);
			return false;
		}
		if (!files || (!data.geometryBefore && !data.geometryAfter) || (
			(data.geometryBefore && !files[data.geometryBefore.identifiers[0]]) ||
				(data.geometryAfter && !files[data.geometryAfter.identifiers[0]])
			)
		){
			window.alert(`Nahrajte alespoň jeden ze souborů: ${fields["geometryBefore"]} nebo ${fields["geometryAfter"]}`);
			return false;
		}
		return true;
	}

	resetFileInputs() {
		document.getElementById(`geometryBefore`).value = '';
		document.getElementById(`geometryAfter`).value = '';
	}
	render() {
		const {activeEditedCase} = this.props;
		const formData = activeEditedCase && activeEditedCase.data;
		const files = activeEditedCase && activeEditedCase.files;

		const geometryBeforeName = formData && formData.geometryBefore && formData.geometryBefore.names ? formData.geometryBefore.names[0] : "Vyberte soubor...";
		const geometryAfterName = formData && formData.geometryAfter && formData.geometryAfter.names ? formData.geometryAfter.names[0] : "Vyberte soubor...";
		const attachmentsNamesElms = formData && formData.attachment && formData.attachment.names && formData.attachment.names.length > 0 ? formData && formData.attachment && formData.attachment.names.map((name) => {
			return <div key={name} className={'ptr-button ghost'}><div className={'ptr-button-caption'}>{name}</div></div>
		}) : null;
		return (
			<div className="szifLpisZmenovaRizeni-szifCaseForm">
				<div>
					<InputWrapper
						required
						label={fields['caseKey']}
					>
						<Input
							value={formData && formData.caseKey || ""}
							onChange={(val) => this.onChange('caseKey', val)}
						/>
					</InputWrapper>
					<InputWrapper
						required
						label={fields['submitDate']}
					>
						<Input
							date
							value={formData && formData.submitDate || ""}
							onChange={(val) => this.onChange('submitDate', val)}
						/>
					</InputWrapper>
					<InputWrapper
						required
						label={fields['codeDpb']}
					>
						<Input
							value={formData && formData.codeDpb || ""}
							onChange={(val) => this.onChange('codeDpb', val)}
						/>
					</InputWrapper>
					<InputWrapper
						required
						label={fields['codeJi']}
					>
						<Input
							value={formData && formData.codeJi || ""}
							onChange={(val) => this.onChange('codeJi', val)}
						/>
					</InputWrapper>
					<InputWrapper
						required
						label={fields['changeDescription']}
					>
						<Input
							value={formData && formData.changeDescription || ""}
							onChange={(val) => this.onChange('changeDescription', val)}
						/>
					</InputWrapper>
					<InputWrapper
						label={fields['changeDescriptionPlace']}
					>
						<Input
							value={formData && formData.changeDescriptionPlace || ""}
							onChange={(val) => this.onChange('changeDescriptionPlace', val)}
						/>
					</InputWrapper>
					<InputWrapper
						label={fields['changeDescriptionOther']}
					>
						<Input
							value={formData && formData.changeDescriptionOther || ""}
							onChange={(val) => this.onChange('changeDescriptionOther', val)}
						/>
					</InputWrapper>

					<InputWrapper
								required="Alespoň 1 soubor povinný"
								divInsteadOfLabel
								info={<p>Nahrajte alespoň jeden ze souborů! Soubor musí být ve formátu ZIP. Tento ZIP soubor musí obsahovat geometrie ve formátu shapefile. </p>}
							>
						<label>
							<span>{fields['geometryBefore']}</span>
							<InputFile
								accept=".zip"
								inputId="geometryBefore"
								onChange={this.onFileInputChanged}
								name="geometryBefore"
							>
									<Button
										icon="upload"
										ghost
									>
										{geometryBeforeName}
									</Button>
							</InputFile>
						</label>
						<label>
							<span>{fields['geometryAfter']}</span>
							<InputFile
								accept=".zip"
								inputId="geometryAfter"
								onChange={this.onFileInputChanged}
								name="geometryAfter"
							>
									<Button
										icon="upload"
										ghost
									>
										{geometryAfterName}
									</Button>
							</InputFile>
						</label>
					</InputWrapper>
					<InputWrapper
								divInsteadOfLabel
								info={<p>Volitelné přílohy</p>}
							>
						<div className={'ptr-files'}>{attachmentsNamesElms} {attachmentsNamesElms ? <Button onClick={() => {this.updateFiles('attachment', [])}}>Odstranit soubory</Button> : null}</div>
						<label>
							<InputFile
								multiple
								inputId="attachment"
								onChange={this.onFileInputChanged}
								name="attachment"
							>
									<Button
										icon="upload"
										ghost
									>
										{"Vyberte soubory"}
									</Button>
							</InputFile>
						</label>
					</InputWrapper>

					<div className="ptr-change-review-form-buttons">
						<Button onClick={this.switchScreen}>Zpět</Button>
						<Button
							primary
							onClick={this.onClickSendAndCreateNewOne}
						>
							Uložit a vytvořit další
						</Button>
						<Button
							secondary
							onClick={this.onClickSendAndReturnBack}
						>
							Uložit a vrátit se na seznam
						</Button>
						<Button
							ghost
							onClick={this.onClickClear}
						>
							Vymazat formulář
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default SzifCaseForm;
