import React from 'react';
import {Link} from "@gisatcz/ptr-state";

import {Button, Buttons, ButtonGroup, Icon, Menu, MenuItem} from '@gisatcz/ptr-atoms';

import Page, {LightDarkBlock, SyntaxHighlighter} from '../../../Page';
import ComponentPropsTable from "../../../ComponentPropsTable/ComponentPropsTable";

import pantherIcon from '../../../../assets/panther-icon.png';

const onClick = () => {};

class ButtonsDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Buttons">
				<Buttons>
					<Button onClick={onClick} icon="search">Search</Button>
					<Button onClick={onClick} primary>Save</Button>
					<Button onClick={onClick} secondary>Save & close</Button>
					<ButtonGroup>
						<Button onClick={onClick} icon="search"/>
						<Button onClick={onClick} icon="info"/>
						<Button onClick={onClick} icon="filter"/>
						<Button onClick={onClick} icon="dots">
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
							description: (<>Go to <Link to="#content">Content section</Link> to see how to handle with icons or visit <Link to="/components/atoms/icons">Icons</Link> documentation to choose the icon you need.</>)
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
							description: (<>See <Link to="#sizes">Sizes section</Link></>)
						}, {
							name: "onClick",
							type: "function",
							isRequired: true,
							description: "A function which is called on button press."
						}, {
							name: "primary",
							type: "boolean",
							default: "false",
							description: (<>See <Link to="#levels">Levels section</Link></>)
						}, {
							name: "secondary",
							type: "boolean",
							default: "false",
							description: (<>See <Link to="#levels">Levels section</Link></>)
						}, {
							name: "side",
							type: "boolean",
							default: "false",
							description: "TODO + link"
						}, {
							name: "small",
							type: "boolean",
							default: "false",
							description: (<>See <Link to="#sizes">Sizes section</Link></>)
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



				
				<h2 id="levels">Levels</h2>
				<SyntaxHighlighter language="jsx">
					{
						'<Button onClick={onClick}>Basic</Button>\n' +
						'<Button onClick={onClick} primary>Primary action</Button>\n' +
						'<Button onClick={onClick} secondary>Secondary action</Button>\n'
					}
				</SyntaxHighlighter>
				<LightDarkBlock>
					<Buttons>
						<Button onClick={onClick}>Basic</Button>
						<Button onClick={onClick} primary>Primary</Button>
						<Button onClick={onClick} secondary>Secondary</Button>
					</Buttons>
				</LightDarkBlock>




				<h2 id="sizes">Sizes</h2>
				<SyntaxHighlighter language="jsx">
					{
						'<Button onClick={onClick} small>Small size</Button>\n' +
						'<Button onClick={onClick}>Normal size</Button>\n' +
						'<Button onClick={onClick} large>Large size</Button>\n'
					}
				</SyntaxHighlighter>
				<LightDarkBlock>
					<Buttons>
						<Button onClick={onClick} small>Small size</Button>
						<Button onClick={onClick}>Normal size</Button>
						<Button onClick={onClick} large>Large size</Button>
					</Buttons>
				</LightDarkBlock>




				<h2 id="content">Content</h2>
				<SyntaxHighlighter language="jsx">
					{
						'// Icon as a prop\n' +
						'<Button onClick={onClick} icon="search">Search</Button>\n\n' +
						'// Icon as a child\n' +
						'<Button onClick={onClick}><Icon icon="search"/>Search</Button>\n\n' +
						'// Multiple icons as children\n' +
						'<Button onClick={onClick}><Icon icon="search"/>Search<Icon icon="search"/></Button>\n'
					}
				</SyntaxHighlighter>
				<LightDarkBlock>
					<Buttons>
						<Button onClick={onClick} icon="search">Search</Button>
						<Button onClick={onClick}><Icon icon="search"/>Search</Button>
						<Button onClick={onClick}><Icon icon="search"/>Search<Icon icon="search"/></Button>
					</Buttons>
				</LightDarkBlock>

				<SyntaxHighlighter language="jsx">
					{
						'// Multiline content\n' +
						'<Button onClick={onClick}>Stay calm <br/> & enjoy Panther</Button>\n\n' +
						'// Highlight textual content\n' +
						'<Button onClick={onClick}><><b>Stay calm</b> and enjoy Panther</></Button>\n\n' +
						'// Use image as content\n' +
						'<Button onClick={onClick}><img src={pantherIcon}/></Button>\n'
					}
				</SyntaxHighlighter>
				<LightDarkBlock>
					<Buttons>
						<Button onClick={onClick}>Stay calm <br/> & enjoy Panther</Button>
						<Button onClick={onClick}><><b>Stay calm</b> and enjoy Panther</></Button>
						<Button onClick={onClick}><img src={pantherIcon}/></Button>
					</Buttons>
				</LightDarkBlock>

				<h2 id="variants">Variants</h2>
				<h3>Icons only</h3>
				<LightDarkBlock>
					<Buttons>
						<Button onClick={onClick} icon="times" small/>
						<Button onClick={onClick} icon="times"/>
						<Button onClick={onClick} icon="times" large/>
						<Button onClick={onClick} icon="times" small primary/>
						<Button onClick={onClick} icon="times" primary/>
						<Button onClick={onClick} icon="times" large primary/>
						<Button onClick={onClick} icon="times" small secondary/>
						<Button onClick={onClick} icon="times" secondary/>
						<Button onClick={onClick} icon="times" large secondary/>
					</Buttons>
				</LightDarkBlock>


				<h3>Invisible</h3>
				<LightDarkBlock>
					<Buttons>
						<Button onClick={onClick} invisible>Invisible</Button>
						<Button onClick={onClick} invisible icon="dots">
							<Menu bottom right>
								<MenuItem disabled>Disabled item</MenuItem>
								<MenuItem>Active item</MenuItem>
								<MenuItem>Another active item</MenuItem>
							</Menu>
						</Button>
					</Buttons>
				</LightDarkBlock>

				<h3>Ghost</h3>
				<LightDarkBlock>
					<Buttons>
						<Button onClick={onClick} ghost small>Search</Button>
						<Button onClick={onClick} ghost>Search</Button>
						<Button onClick={onClick} ghost large>Search</Button>
					</Buttons>
					<Buttons>
						<Button onClick={onClick} ghost small primary>Search</Button>
						<Button onClick={onClick} ghost primary>Search</Button>
						<Button onClick={onClick} ghost large primary>Search</Button>
					</Buttons>
				</LightDarkBlock>

				<h3>Inverted</h3>

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
						<Button onClick={onClick}>Basic</Button>
						<Button onClick={onClick} primary>Primary</Button>
						<Button onClick={onClick} secondary>Secondary</Button>
						</Buttons>
					</div>

					<h2>Normal size with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} icon="delete">Basic</Button>
						<Button onClick={onClick} icon="download">Basic</Button>
						<Button onClick={onClick} icon="plus">Basic</Button>
						<Button onClick={onClick} primary icon="delete">Primary</Button>
						<Button onClick={onClick} primary icon="download">Primary</Button>
						<Button onClick={onClick} primary icon="plus">Primary</Button>
						<Button onClick={onClick} secondary icon="delete">Secondary</Button>
						<Button onClick={onClick} secondary icon="download">Secondary</Button>
						<Button onClick={onClick} secondary>Secondary<Icon icon="plus"/></Button>
					</div>

					<h2>Normal size icon only</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} icon="delete"/>
						<Button onClick={onClick} primary icon="plus"/>
						<Button onClick={onClick} secondary icon="delete"/>
					</div>

					<h2>Small size</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} small>Basic</Button>
						<Button onClick={onClick} small primary>Primary</Button>
						<Button onClick={onClick} small secondary>Secondary</Button>
					</div>

					<h2>Small size with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} small icon="delete">Basic</Button>
						<Button onClick={onClick} small icon="download">Basic</Button>
						<Button onClick={onClick} small icon="plus">Basic</Button>
						<Button onClick={onClick} small secondary>Secondary<Icon icon="plus"/></Button>
					</div>

					<h2>Small size with icon only</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} small icon="delete"/>
						<Button onClick={onClick} small icon="download"/>
						<Button onClick={onClick} small icon="plus"/>
					</div>

					<h2>Large size</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} large>Basic</Button>
						<Button onClick={onClick} large primary>Primary</Button>
						<Button onClick={onClick} large secondary>Secondary</Button>
					</div>

					<h2>Large size with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} large icon="delete">Basic</Button>
						<Button onClick={onClick} large icon="download">Basic</Button>
						<Button onClick={onClick} large icon="plus">Basic</Button>
						<Button onClick={onClick} large primary icon="delete">Primary</Button>
						<Button onClick={onClick} large primary icon="download">Primary</Button>
						<Button onClick={onClick} large primary icon="plus">Primary</Button>
						<Button onClick={onClick} large secondary icon="delete">Secondary</Button>
						<Button onClick={onClick} large secondary icon="download">Secondary</Button>
						<Button onClick={onClick} large secondary>Secondary<Icon icon="plus"/></Button>
					</div>

					<h2>Large size with icon only</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} large icon="delete"/>
						<Button onClick={onClick} large icon="download"/>
						<Button onClick={onClick} large icon="plus"/>
					</div>

					<h2>Disabled</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} disabled>Basic</Button>
						<Button onClick={onClick} disabled primary>Primary</Button>
						<Button onClick={onClick} disabled secondary>Secondary</Button>
					</div>

					<h2>Disabled with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} disabled icon="delete">Basic</Button>
						<Button onClick={onClick} disabled primary icon="download">Basic</Button>
						<Button onClick={onClick} disabled secondary icon="plus">Basic</Button>
					</div>

					<h2>Invisible</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} invisible>Basic</Button>
					</div>

					<h2>Button with menu</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} icon="dots" invisible>
							<Menu bottom right>
								<MenuItem disabled>Item 1</MenuItem>
								<MenuItem>Wtf menu item</MenuItem>
								<MenuItem>Omg</MenuItem>
							</Menu>
						</Button>
					</div>

					<h2>Ghost</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} ghost>Basic</Button>
						<Button onClick={onClick} ghost primary>Primary</Button>
					</div>

					<h2>Ghost with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} ghost icon="delete">Basic</Button>
						<Button onClick={onClick} ghost primary icon="download">Basic</Button>
					</div>

					<h2>Ghost small</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} ghost small>Basic</Button>
						<Button onClick={onClick} ghost small primary>Primary</Button>
					</div>

					<h2>Ghost small with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} ghost small icon="delete">Basic</Button>
						<Button onClick={onClick} ghost small primary icon="plus">Basic</Button>
					</div>

					<h2>Ghost large</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} ghost large>Basic</Button>
						<Button onClick={onClick} ghost large primary>Primary</Button>
					</div>

					<h2>Ghost large with icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} ghost large icon="delete">Basic</Button>
						<Button onClick={onClick} ghost large primary icon="plus">Basic</Button>
					</div>

					<h2>Ghost disabled</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} ghost disabled>Basic</Button>
						<Button onClick={onClick} ghost disabled primary>Primary</Button>
					</div>

					<h2>Inverted</h2>
					<div className="ptr-docs-panel-section inverted">
						<Button onClick={onClick} inverted>Basic</Button>
						<Button onClick={onClick} inverted primary>Primary</Button>
						<Button onClick={onClick} inverted secondary>Primary</Button>
					</div>

					<h2>Inverted disabled</h2>
					<div className="ptr-docs-panel-section inverted">
						<Button onClick={onClick} inverted disabled>Basic</Button>
						<Button onClick={onClick} inverted disabled primary>Primary</Button>
						<Button onClick={onClick} inverted disabled secondary>Primary</Button>
					</div>

					<h2>Inverted invisible</h2>
					<div className="ptr-docs-panel-section inverted">
						<Button onClick={onClick} inverted invisible>Basic</Button>
					</div>

					<h2>Inverted ghost</h2>
					<div className="ptr-docs-panel-section inverted">
						<Button onClick={onClick} ghost inverted >Basic</Button>
						<Button onClick={onClick} ghost inverted primary>Primary</Button>
					</div>

					<h2>Side icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} side="left" icon="times"/>
						<Button onClick={onClick} side="right" icon="chevron-left"/>
						<Button onClick={onClick} side="top" primary icon="plus"/>
						<Button onClick={onClick} side="bottom" secondary icon="pushpin"/>
					</div>

					<h2>Ghost side icon</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} ghost side="left" icon="times"/>
						<Button onClick={onClick} ghost side="right" icon="chevron-left"/>
						<Button onClick={onClick} ghost side="right" icon="chevron-right"/>
						<Button onClick={onClick} ghost side="top" primary icon="plus"/>
						<Button onClick={onClick} ghost side="bottom" primary icon="pushpin"/>
					</div>


					<h2>Circular</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} circular icon="chevron-left"/>
						<Button onClick={onClick} circular primary icon="plus"/>
						<Button onClick={onClick} circular secondary icon="edit"/>
					</div>

					<h2>Circular small</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} circular small icon="expand"/>
						<Button onClick={onClick} circular small primary icon="search"/>
						<Button onClick={onClick} circular small secondary icon="chevron-left"/>
					</div>

					<h2>Circular large</h2>
					<div className="ptr-docs-panel-section">
						<Button onClick={onClick} circular large icon="expand"/>
						<Button onClick={onClick} circular large primary icon="search"/>
						<Button onClick={onClick} circular large primary icon="times"/>
						<Button onClick={onClick} circular large secondary icon="chevron-left"/>
						<Button onClick={onClick} circular large secondary icon="chevron-right"/>
					</div>
				</LightDarkBlock>
			</Page>
		);
	}
}

export default ButtonsDoc;