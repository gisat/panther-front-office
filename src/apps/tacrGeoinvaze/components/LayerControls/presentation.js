import React from "react";

import './style.scss';
import Button, {ButtonGroup} from "../../../../components/common/atoms/Button";
import ButtonSwitch, {Option} from "../../../../components/common/atoms/ButtonSwitch";
import Select from "../../../../components/common/atoms/Select/Select";

class LayerControls extends React.PureComponent {

	constructor(props) {
		super(props);

		this.switchToModel = this.switchToModel.bind(this);
		this.switchToActual = this.switchToActual.bind(this);
	}
	
	componentDidMount() {
		this.props.onMount();
	}
	
	componentWillUnmount() {
		this.props.onUnmount();
	}

	switchToModel(value, e) {
		if (value && this.props.templateKeys && this.props.periods) {
			let templates = this.props.templateKeys;
			let latestPeriodKey = this.props.periods[0].key;
			switch (value) {
				case "gis1":
					if (templates.modelGis && templates.modelGis.year1) {
						this.props.setActiveLayerTemplate(templates.modelGis.year1);
						this.props.setActivePeriod(latestPeriodKey);
					}
					break;
				case "gis3":
					if (templates.modelGis && templates.modelGis.year3) {
						this.props.setActiveLayerTemplate(templates.modelGis.year3);
						this.props.setActivePeriod(latestPeriodKey);
					}
					break;
				case "gis10":
					if (templates.modelGis && templates.modelGis.year10) {
						this.props.setActiveLayerTemplate(templates.modelGis.year10);
						this.props.setActivePeriod(latestPeriodKey);
					}
					break;
				case "gam":
					if (templates.modelBiomod && templates.modelBiomod.generalisedLinear) {
						this.props.setActiveLayerTemplate(this.props.templateKeys.modelBiomod.generalisedLinear);
						this.props.setActivePeriod(latestPeriodKey);
					}
					break;
				case "gbm":
					if (templates.modelBiomod && templates.modelBiomod.gradientBoosting) {
						this.props.setActiveLayerTemplate(this.props.templateKeys.modelBiomod.gradientBoosting);
						this.props.setActivePeriod(latestPeriodKey);
					}
					break;
				case "maxent":
					if (templates.modelBiomod && templates.modelBiomod.maximumEntropy) {
						this.props.setActiveLayerTemplate(this.props.templateKeys.modelBiomod.maximumEntropy);
						this.props.setActivePeriod(latestPeriodKey);
					}
					break;
			}
		}
	}
	
	switchToActual(periodKey, e) {
		if (periodKey && this.props.templateKeys) {
			let actualTemplateKey = this.props.templateKeys.actualExpansion;
			
			this.props.setActiveLayerTemplate(actualTemplateKey);
			this.props.setActivePeriod(periodKey);
		}
	}

	render() {
		const props = this.props;
		const templateKeys = props.templateKeys;
		
		let actualExpansionInsert = null;
		
		if (props.isCrayfish) {
			actualExpansionInsert = (
				<div className="tacrGeoinvaze-actual-expansion">
					<div className="tacrGeoinvaze-layer-title">Skutečné rozšíření / Actual expansion</div>
					<div className="tacrGeoinvaze-layer-description">Mapa VÚV TGM</div>
				</div>
			);
		} else {
			
			if (this.props.periods) {
				let latestPeriods = this.props.periods.slice(0, 3); //todo all periods to select
				
				actualExpansionInsert = (
					<div className="tacrGeoinvaze-actual-expansion">
						<div className="tacrGeoinvaze-layer-title">Skutečné rozšíření / Actual expansion</div>
						<div>
							<ButtonSwitch onClick={this.switchToActual} ghost>
								{latestPeriods.map(period => (
									<Option active={props.templateKeys && props.templateKeys.actualExpansion === props.activeLayerTemplateKey && period.key === this.props.activePeriodKey} value={period.key}>{period.data.nameDisplay}</Option>
								))}
							</ButtonSwitch>
							{/*<Select/>*/}
						</div>
					</div>
				);
			} else {
				actualExpansionInsert = (
					<div className="tacrGeoinvaze-actual-expansion">
						<div className="tacrGeoinvaze-layer-title">Skutečné rozšíření / Actual expansion</div>
						<div>
							(žádná data)
						</div>
					</div>
				);
			}
		}

		return (
			<div className="tacrGeoinvaze-layer-controls">
				{actualExpansionInsert}
				<div className="tacrGeoinvaze-model-gis">
					<div className="tacrGeoinvaze-layer-title">Model budoucího rozšíření / Future expansion model</div>
					<div>
						<ButtonSwitch onClick={this.switchToModel} ghost>
							<Option active={this.props.activeLayerTemplateKey === (templateKeys && templateKeys.modelGis && templateKeys.modelGis.year1)} value={"gis1"}>+ 1 rok</Option>
							<Option active={this.props.activeLayerTemplateKey === (templateKeys && templateKeys.modelGis && templateKeys.modelGis.year3)} value={"gis3"}>+ 3 roky</Option>
							<Option active={this.props.activeLayerTemplateKey === (templateKeys && templateKeys.modelGis && templateKeys.modelGis.year10)} value={"gis10"}>+ 10 let</Option>
						</ButtonSwitch>
					</div>
				</div>
				<div className="tacrGeoinvaze-model-biomod">
					<div className="tacrGeoinvaze-layer-title">Model pravděpodobnosti rozšíření / Expansion probability model</div>
					<div>
						<ButtonSwitch onClick={this.switchToModel} ghost>
							<Option active={this.props.activeLayerTemplateKey === (templateKeys && templateKeys.modelBiomod && templateKeys.modelBiomod.generalisedLinear)} value={"gam"}>gen. lineární</Option>
							<Option active={this.props.activeLayerTemplateKey === (templateKeys && templateKeys.modelBiomod && templateKeys.modelBiomod.gradientBoosting)} value={"gbm"}>gradient boosting</Option>
							<Option active={this.props.activeLayerTemplateKey === (templateKeys && templateKeys.modelBiomod && templateKeys.modelBiomod.maximumEntropy)} value={"maxent"}>maximum entropy</Option>
						</ButtonSwitch>
					</div>
				</div>
			</div>
		);

	}
}


export default LayerControls;