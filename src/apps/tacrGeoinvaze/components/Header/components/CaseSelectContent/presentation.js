import React from "react";

import './style.scss';
import classnames from "classnames";
import CaseList from "../CaseList";

class CaseSelectContent extends React.PureComponent {

	render() {
		const props = this.props;

		return (

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

		);
	}
}

export default CaseSelectContent;
