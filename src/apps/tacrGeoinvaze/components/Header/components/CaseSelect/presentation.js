import React from "react";

import './style.scss';
import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import classnames from "classnames";
import CaseList from "../CaseList";

class CaseSelect extends React.PureComponent {

	constructor(props) {
		super(props);
		this.renderCurrent = this.renderCurrent.bind(this);
		this.selectScope = this.selectScope.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	selectScope(key) {
		if (key !== this.props.activeCase.key) {
			this.props.selectCase(key);
		}
	}

	renderCurrent() {
		const activeCase = this.props.activeCase;
		if (activeCase) {
			return (
				<div className="tacrGeoinvaze-case-value" title={activeCase.data && activeCase.data.nameDisplay}>
					{activeCase.data && activeCase.data.nameDisplay}
				</div>
			);
		} else {
			//no case
			return (
				<span className="">Select case</span>
			);
		}
	};

	render() {
		const props = this.props;

		return (

			<PantherSelect
				className="tacrGeoinvaze-case-select"
				open={props.caseSelectOpen}
				onSelectClick={() => {
					props.caseSelectOpen ? props.closeSelect() : props.openSelect()
				}}
				onSelect={this.selectScope}
				currentClasses="tacrGeoinvaze-case-select-current"
				renderCurrent={this.renderCurrent}
				listClasses="tacrGeoinvaze-case-select-list"
			>
				<div className="tacrGeoinvaze-case-select-content">
					<div className="tacrGeoinvaze-case-select-content-header">
						Hic sunt pantherae.
					</div>
					<div className="tacrGeoinvaze-case-select-content-content">
						<div className="tacrGeoinvaze-case-select-content-info">
							<p>
								Tento geoinformační portál je zaměřen na vizualizaci distribuce invazních nepůvodních druhů v rámci ČR. Pro druhy byly vytvořeny mapy současného výskytu a predikční modely možného výskytu. V mapách současného rozšíření je možné též sledovat vývoj šíření druhu podle délky trvání výskytu v zájmovém území. Zobrazení výstupů modelů pak ukazuje maximální možné rozšíření druhů a predikci v časových horizontech.
							</p>
							<p>
								Portál by měl sloužit orgánům státní správy a územní samosprávy, stejně tak soukromým vlastníkům pozemků, honiteb a správcům lesních pozemků. Na základě aktuálního rozšíření či potenciálního nebezpečí rozšíření invazních druhů je možno navrhnout cílené postupy monitoringu a eliminace invazních druhů v zájmovém území, popřípadě žádat o státní finanční příspěvky na likvidaci a management invazních nepůvodních druhů.
							</p>
						</div>
						<div className="tacrGeoinvaze-case-select-cases">
							<div>
								{props.categories && props.categories.terrestrialAnimals ? (
									<CaseList
										categoryKey={props.categories.terrestrialAnimals}
									/>
								) : null}
							</div>
							<div>
								{props.categories && props.categories.terrestrialPlants ? (
									<CaseList
										categoryKey={props.categories.terrestrialPlants}
									/>
								) : null}
							</div>
							<div>
								{props.categories && props.categories.aquaticAnimals ? (
									<CaseList
										categoryKey={props.categories.aquaticAnimals}
									/>
								) : null}
							</div>
							<div>
								{props.categories && props.categories.aquaticPlants ? (
									<CaseList
										categoryKey={props.categories.aquaticPlants}
									/>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</PantherSelect>

		);
	}
}

export default CaseSelect;
