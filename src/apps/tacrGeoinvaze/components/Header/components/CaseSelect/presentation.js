import React from "react";

import './style.scss';
import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import classnames from "classnames";

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
								Tento geoinformační portál je zaměřen na vizualizaci distribuce invazních nepůvodních druhů v rámci ČR. Výstupy jsou prezentovány ve formě síťových map. Objektem zájmu jsou vybrané druhy rostlin a živočichů obsažené v seznamu druhů (2016/1141) k nařízení EU (1143/2014) a druhy z Černého seznamu ČR (Pergl et al. 2016). Pro druhy byly vytvořeny mapy současného výskytu a predikční modely možného výskytu. V mapách současného rozšíření je možné též sledovat vývoj šíření druhu podle délky trvání výskytu v zájmovém území. Zobrazení výstupů modelů pak ukazuje maximální možné rozšíření druhů a predikci v časových horizontech.
							</p>
							<p>
								Portál by měl sloužit orgánům státní správy a územní samosprávy, stejně tak soukromým vlastníkům pozemků, honiteb a správcům lesních pozemků, k možnosti zobrazení současného či potencionálního výskytu jednotlivých druhů nepůvodní fauny a flóry. Výstupy mohou sloužit jako podklad pro efektivní management nepůvodních invazních druhů, kdy na základě aktuálního rozšíření či potenciálního nebezpečí rozšíření invazních druhů je možno navrhnout cílené postupy monitoringu a eliminace invazních druhů v zájmovém území, popřípadě žádat o státní finanční příspěvky na likvidaci a management invazních nepůvodních druhů (OP ŽP, PPK, MaS, POPFK).
							</p>
						</div>
						<div className="tacrGeoinvaze-case-select-cases">
							{props.cases && props.cases.map((oneCase) => {
								return (
									<PantherSelectItem
										itemKey={oneCase.key}
										key={oneCase.key}
									>
										{oneCase.data && oneCase.data.nameDisplay}
									</PantherSelectItem>
								);
							})}
						</div>
					</div>
				</div>
			</PantherSelect>

		);
	}
}

export default CaseSelect;
