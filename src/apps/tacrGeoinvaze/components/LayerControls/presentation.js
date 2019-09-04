import React from "react";

import './style.scss';
import Button, {ButtonGroup} from "../../../../components/common/atoms/Button";
import ButtonSwitch, {Option} from "../../../../components/common/atoms/ButtonSwitch";
import Select from "../../../../components/common/atoms/Select/Select";

class LayerControls extends React.PureComponent {

	constructor(props) {
		super(props);

		this.switchLayer = this.switchLayer.bind(this);
	}
	
	componentDidMount() {
		this.props.onMount();
	}
	
	componentWillUnmount() {
		this.props.onUnmount();
	}

	switchLayer(value, e) {
		if (value && this.props.templateKeys) {
			let templates = this.props.templateKeys;
			switch (value) {
				case "gam":
					if (templates.modelBiomod && templates.modelBiomod.generalisedLinear) {
						// this.props.setActiveLayerTemplate(this.props.templateKeys.modelBiomod.generalisedLinear);
					}
					break;
				case "gbm":
					if (templates.modelBiomod && templates.modelBiomod.gradientBoosting) {
						// this.props.setActiveLayerTemplate(this.props.templateKeys.modelBiomod.gradientBoosting);
					}
					break;
				case "maxent":
					if (templates.modelBiomod && templates.modelBiomod.maximumEntropy) {
						// this.props.setActiveLayerTemplate(this.props.templateKeys.modelBiomod.maximumEntropy);
					}
					break;
			}
		}
	}

	render() {
		const props = this.props;
		
		let actualExpansionInsert = null;
		
		if (props.isCrayfish) {
			actualExpansionInsert = (
				<div className="tacrGeoinvaze-actual-expansion">
					<div className="tacrGeoinvaze-layer-title">Skutečné rozšíření</div>
					<div className="tacrGeoinvaze-layer-description">Mapa VÚV TGM</div>
				</div>
			);
		} else {
			actualExpansionInsert = (
				<div className="tacrGeoinvaze-actual-expansion">
					<div className="tacrGeoinvaze-layer-title">Skutečné rozšíření</div>
					<div>
						<ButtonGroup>
							<Button ghost>Aktuální</Button>
							<Button ghost>2019/Q1</Button>
							<Button ghost>2018/Q4</Button>
						</ButtonGroup>
						<Select/>
					</div>
				</div>
			);
		}

		return (
			<div className="tacrGeoinvaze-layer-controls">
				{actualExpansionInsert}
				<div className="tacrGeoinvaze-model-gis">
					<div className="tacrGeoinvaze-layer-title">Model budoucího rozšíření</div>
					<div>
						<ButtonGroup>
							<Button ghost>+ 1 rok</Button>
							<Button ghost>+ 3 roky</Button>
							<Button ghost>+ 10 let</Button>
						</ButtonGroup>
					</div>
				</div>
				<div className="tacrGeoinvaze-model-biomod">
					<div className="tacrGeoinvaze-layer-title">Model pravděpodobnosti rozšíření</div>
					<div>
						<ButtonSwitch onClick={this.switchLayer} ghost>
							<Option value={"gam"}>gen. lineární</Option>
							<Option value={"gbm"}>gradient boosting</Option>
							<Option value={"maxent"}>maximum entropy</Option>
						</ButtonSwitch>
					</div>
				</div>
			</div>
		);

	}
}


export default LayerControls;