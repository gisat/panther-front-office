import React from 'react';
import Fade from "react-reveal/Fade";
import {Header, Visualization} from "../Page";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import ColumnChart from "../../../../components/common/charts/ColumnChart/ColumnChart";
import ScatterChart from "../../../../components/common/charts/ScatterChart/ScatterChart";

import mockData from "../../mockData";

import './styles/style.scss';

const data = mockData;

class GreenAreas extends React.PureComponent {
	static propTypes = {

	};


	render() {
		return (
			<>
				<Header
					navigation={this.props.navigation}
					title="Green, open and public spaces monitoring"
					intro="Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl."
				/>
				<div className="scudeoStories19-content">
					<section key="section-1">
						<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>

						<Fade left distance="50px">
							<Visualization
								title="Green Areas Share (%)"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<Fade cascade>
									<div className="scudeoStories19-chart-container">
										<HoverHandler>
											<ColumnChart
												key="green-areas-stacked-chart"

												data={data}
												keySourcePath="properties.key"
												nameSourcePath="properties.name"
												xSourcePath="properties.name"
												ySourcePath={[{
													path: "properties.population",
													name: "Population",
													color: "#ff0000"
												},{
													path: "properties.area",
													name: "Area",
													color: "#00ff00"
												}]}

												xValuesSize={5.5}

												yLabel
												yOptions={{
													name: "Total",
													unit: "count"
												}}

												stacked
											/>
										</HoverHandler>
									</div>
								</Fade>
							</Visualization>
						</Fade>

						<Fade left distance="50px">
							<Visualization
								title="Green Areas vs. Urban Areas"
								description="Chart description: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis."
							>
								<Fade cascade className="aaaa">
									<div className="scudeoStories19-chart-container">
										<HoverHandler>
											<ScatterChart
												key="scatter-chart-1"

												data={data}
												keySourcePath="properties.key"
												nameSourcePath="properties.name"
												xSourcePath="properties.population"
												ySourcePath="properties.area"

												yLabel
												yValuesSize={3.5}
												yOptions={{
													name: "Area",
													unit: "unit"
												}}
												xLabel
												xValuesSize={3}
												xOptions={{
													name: "Population",
													unit: "inh"
												}}
											/>
										</HoverHandler>
									</div>
								</Fade>
							</Visualization>
						</Fade>
					</section>
					<section key="section-2">
						<h2>City example</h2>
						<p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus, ut pellentesque dolor augue a nisl. Donec posuere augue condimentum, fermentum justo placerat, vulputate diam. Vestibulum placerat, tortor ut molestie suscipit, dui felis feugiat ex, ut vehicula enim libero ac leo. Ut at aliquet quam. Mauris eros nulla, vehicula nec quam ac, luctus placerat tortor. Nunc et eros in lectus ornare tincidunt vitae id felis. Pellentesque elementum ligula non pellentesque euismod. Praesent at arcu tempor, aliquam quam ut, luctus odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris velit nulla, dictum sed arcu id, porta interdum est. Vestibulum eget mattis dui. Curabitur volutpat lacus at eros luctus, a tempus neque iaculis.</p>
					</section>
				</div>
			</>
		);
	}
}

export default GreenAreas;

