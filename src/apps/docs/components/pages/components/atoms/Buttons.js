import React from 'react';
import {withNamespaces} from "react-i18next";

import Button, {Buttons, ButtonGroup} from "../../../../../../components/common/atoms/Button";
import Icon from "../../../../../../components/common/atoms/Icon";
import Menu from "../../../../../../components/common/atoms/Menu";
import {MenuItem} from "../../../../../../components/common/atoms/Menu";

import Page, {LightDarkBlock} from '../../../Page';
import ComponentPropsTable from "../../../ComponentPropsTable/ComponentPropsTable";

const nil = () => {};

class ButtonsDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Buttons">
				<Buttons>
					<Button onClick={nil} icon="search">Search</Button>
					<Button onClick={nil} primary>Save</Button>
					<Button onClick={nil} secondary>Save & close</Button>
					<ButtonGroup>
						<Button onClick={nil} icon="search"/>
						<Button onClick={nil} icon="info"/>
						<Button onClick={nil} icon="filter"/>
						<Button onClick={nil} icon="dots">
							<Menu>
								<MenuItem>Settings…</MenuItem>
							</Menu>
						</Button>
					</ButtonGroup>
				</Buttons>

				<h2 id="props">Props</h2>
				<ComponentPropsTable
					content={[
						{
							name: "circular",
							type: "boolean",
							default: "false",
							description: "TODO + link"
						}, {
							name: "className",
							type: "string",
							description: "Additional classes."
						}, {
							name: "disabled",
							type: "boolean",
							default: "false",
							description: "Set true to make button disabled."
						}, {
							name: "ghost",
							type: "boolean",
							default: "false",
							description: "TODO + link"
						}, {
							name: "icon",
							type: "string",
							description: "TODO + link to icons + link to button with icon"
						}, {
							name: "inverted",
							type: "boolean",
							default: "false",
							description: "TODO + link"
						}, {
							name: "invisible",
							type: "boolean",
							default: "false",
							description: "TODO + link"
						}, {
							name: "large",
							type: "boolean",
							default: "false",
							description: "TODO + link"
						}, {
							name: "onClick",
							type: "function",
							isRequired: true,
							description: "A function which is called on button press."
						}, {
							name: "primary",
							type: "boolean",
							default: "false",
							description: "TODO + link"
						}, {
							name: "secondary",
							type: "boolean",
							default: "false",
							description: "TODO + link"
						}, {
							name: "side",
							type: "boolean",
							default: "false",
							description: "TODO + link"
						}, {
							name: "small",
							type: "boolean",
							default: "false",
							description: "TODO + link"
						}, {
							name: "title",
							type: "string",
							description: "Text for HTML title attribute."
						}, {
							name: "unfocusable",
							type: "boolean",
							default: "false",
							description: "Button can't get focus."
						},
					]}
				/>
				
				<h2>Levels</h2>
				<h2>Variants</h2>
				<h2>Sizes</h2>
				<h2>Content</h2>
				<Button onClick={nil}>Vynalézt příklad víceřádkového popisu tlačítka.</Button>
				<h2>Containers/grouping/ ???</h2>
				<h3>Buttons</h3>
				<h3>ButtonGroup</h3>
				<h2>Special cases</h2>
				<h3>Circular</h3>
				<h3>Side</h3>

				<LightDarkBlock>
					<h2>Normal size</h2>
					<div className="ptr-docs-panel-section">
						<Buttons>
						<Button onClick={nil}>Basic</Button>
						<Button onClick={nil} primary>Primary</Button>
						<Button onClick={nil} secondary>Secondary</Button>
						</Buttons>
					</div>

					<h2>Normal size with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} icon="delete">Basic</Button>
						<Button onClick={nil} icon="download">Basic</Button>
						<Button onClick={nil} icon="plus">Basic</Button>
						<Button onClick={nil} primary icon="delete">Primary</Button>
						<Button onClick={nil} primary icon="download">Primary</Button>
						<Button onClick={nil} primary icon="plus">Primary</Button>
						<Button onClick={nil} secondary icon="delete">Secondary</Button>
						<Button onClick={nil} secondary icon="download">Secondary</Button>
						<Button onClick={nil} secondary>Secondary<Icon icon="plus"/></Button>
					</div>

					<h2>Normal size icon only</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} icon="delete"/>
						<Button onClick={nil} primary icon="plus"/>
						<Button onClick={nil} secondary icon="delete"/>
					</div>

					<h2>Small size</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} small>Basic</Button>
						<Button onClick={nil} small primary>Primary</Button>
						<Button onClick={nil} small secondary>Secondary</Button>
					</div>

					<h2>Small size with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} small icon="delete">Basic</Button>
						<Button onClick={nil} small icon="download">Basic</Button>
						<Button onClick={nil} small icon="plus">Basic</Button>
						<Button onClick={nil} small secondary>Secondary<Icon icon="plus"/></Button>
					</div>

					<h2>Small size with icon only</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} small icon="delete"/>
						<Button onClick={nil} small icon="download"/>
						<Button onClick={nil} small icon="plus"/>
					</div>

					<h2>Large size</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} large>Basic</Button>
						<Button onClick={nil} large primary>Primary</Button>
						<Button onClick={nil} large secondary>Secondary</Button>
					</div>

					<h2>Large size with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} large icon="delete">Basic</Button>
						<Button onClick={nil} large icon="download">Basic</Button>
						<Button onClick={nil} large icon="plus">Basic</Button>
						<Button onClick={nil} large primary icon="delete">Primary</Button>
						<Button onClick={nil} large primary icon="download">Primary</Button>
						<Button onClick={nil} large primary icon="plus">Primary</Button>
						<Button onClick={nil} large secondary icon="delete">Secondary</Button>
						<Button onClick={nil} large secondary icon="download">Secondary</Button>
						<Button onClick={nil} large secondary>Secondary<Icon icon="plus"/></Button>
					</div>

					<h2>Large size with icon only</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} large icon="delete"/>
						<Button onClick={nil} large icon="download"/>
						<Button onClick={nil} large icon="plus"/>
					</div>

					<h2>Disabled</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} disabled>Basic</Button>
						<Button onClick={nil} disabled primary>Primary</Button>
						<Button onClick={nil} disabled secondary>Secondary</Button>
					</div>

					<h2>Disabled with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} disabled icon="delete">Basic</Button>
						<Button onClick={nil} disabled primary icon="download">Basic</Button>
						<Button onClick={nil} disabled secondary icon="plus">Basic</Button>
					</div>

					<h2>Invisible</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} invisible>Basic</Button>
					</div>

					<h2>Button with menu</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} icon="dots" invisible>
							<Menu bottom right>
								<MenuItem disabled>Item 1</MenuItem>
								<MenuItem>Wtf menu item</MenuItem>
								<MenuItem>Omg</MenuItem>
							</Menu>
						</Button>
					</div>

					<h2>Ghost</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} ghost>Basic</Button>
						<Button onClick={nil} ghost primary>Primary</Button>
					</div>

					<h2>Ghost with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} ghost icon="delete">Basic</Button>
						<Button onClick={nil} ghost primary icon="download">Basic</Button>
					</div>

					<h2>Ghost small</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} ghost small>Basic</Button>
						<Button onClick={nil} ghost small primary>Primary</Button>
					</div>

					<h2>Ghost small with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} ghost small icon="delete">Basic</Button>
						<Button onClick={nil} ghost small primary icon="plus">Basic</Button>
					</div>

					<h2>Ghost large</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} ghost large>Basic</Button>
						<Button onClick={nil} ghost large primary>Primary</Button>
					</div>

					<h2>Ghost large with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} ghost large icon="delete">Basic</Button>
						<Button onClick={nil} ghost large primary icon="plus">Basic</Button>
					</div>

					<h2>Ghost disabled</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} ghost disabled>Basic</Button>
						<Button onClick={nil} ghost disabled primary>Primary</Button>
					</div>

					<h2>Inverted</h2>
					<div className="ptr-docs-panel-section inverted">
						<Button onClick={nil} inverted>Basic</Button>
						<Button onClick={nil} inverted primary>Primary</Button>
						<Button onClick={nil} inverted secondary>Primary</Button>
					</div>

					<h2>Inverted disabled</h2>
					<div className="ptr-docs-panel-section inverted">
						<Button onClick={nil} inverted disabled>Basic</Button>
						<Button onClick={nil} inverted disabled primary>Primary</Button>
						<Button onClick={nil} inverted disabled secondary>Primary</Button>
					</div>

					<h2>Inverted invisible</h2>
					<div className="ptr-docs-panel-section inverted">
						<Button onClick={nil} inverted invisible>Basic</Button>
					</div>

					<h2>Inverted ghost</h2>
					<div className="ptr-docs-panel-section inverted">
						<Button onClick={nil} ghost inverted >Basic</Button>
						<Button onClick={nil} ghost inverted primary>Primary</Button>
					</div>

					<h2>Side icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} side="left" icon="times"/>
						<Button onClick={nil} side="right" icon="chevron-left"/>
						<Button onClick={nil} side="top" primary icon="plus"/>
						<Button onClick={nil} side="bottom" secondary icon="pushpin"/>
					</div>

					<h2>Ghost side icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} ghost side="left" icon="times"/>
						<Button onClick={nil} ghost side="right" icon="chevron-left"/>
						<Button onClick={nil} ghost side="right" icon="chevron-right"/>
						<Button onClick={nil} ghost side="top" primary icon="plus"/>
						<Button onClick={nil} ghost side="bottom" primary icon="pushpin"/>
					</div>


					<h2>Circular</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} circular icon="chevron-left"/>
						<Button onClick={nil} circular primary icon="plus"/>
						<Button onClick={nil} circular secondary icon="edit"/>
					</div>

					<h2>Circular small</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} circular small icon="expand"/>
						<Button onClick={nil} circular small primary icon="search"/>
						<Button onClick={nil} circular small secondary icon="chevron-left"/>
					</div>

					<h2>Circular large</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={nil} circular large icon="expand"/>
						<Button onClick={nil} circular large primary icon="search"/>
						<Button onClick={nil} circular large primary icon="times"/>
						<Button onClick={nil} circular large secondary icon="chevron-left"/>
						<Button onClick={nil} circular large secondary icon="chevron-right"/>
					</div>
				</LightDarkBlock>
			</Page>
		);
	}
}

export default withNamespaces()(ButtonsDoc);