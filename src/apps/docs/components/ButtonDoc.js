import React from 'react';
import {withNamespaces} from "react-i18next";

import Button from "../../../components/common/atoms/Button";
import Icon from "../../../components/common/atoms/Icon";
import Menu from "../../../components/common/atoms/Menu";
import {MenuItem} from "../../../components/common/atoms/Menu";

class ButtonDoc extends React.PureComponent {
	render() {
		return (
			<div className="ptr-docs-panel-content">
				<h2>Normal size</h2>
				<div className="ptr-docs-panel-section">
					<Button>Basic</Button>
					<Button primary>Primary</Button>
					<Button secondary>Secondary</Button>
				</div>

				<h2>Normal size with icon</h2>
				<div className="ptr-docs-panel-section">
					<Button icon="delete">Basic</Button>
					<Button icon="download">Basic</Button>
					<Button icon="plus">Basic</Button>
					<Button primary icon="delete">Primary</Button>
					<Button primary icon="download">Primary</Button>
					<Button primary icon="plus">Primary</Button>
					<Button secondary icon="delete">Secondary</Button>
					<Button secondary icon="download">Secondary</Button>
					<Button secondary>Secondary<Icon icon="plus"/></Button>
				</div>

				<h2>Normal size icon only</h2>
				<div className="ptr-docs-panel-section">
					<Button icon="delete"/>
					<Button primary icon="plus"/>
					<Button secondary icon="delete"/>
				</div>

				<h2>Small size</h2>
				<div className="ptr-docs-panel-section">
					<Button small>Basic</Button>
					<Button small primary>Primary</Button>
					<Button small secondary>Secondary</Button>
				</div>

				<h2>Small size with icon</h2>
				<div className="ptr-docs-panel-section">
					<Button small icon="delete">Basic</Button>
					<Button small icon="download">Basic</Button>
					<Button small icon="plus">Basic</Button>
					<Button small secondary>Secondary<Icon icon="plus"/></Button>
				</div>

				<h2>Small size with icon only</h2>
				<div className="ptr-docs-panel-section">
					<Button small icon="delete"/>
					<Button small icon="download"/>
					<Button small icon="plus"/>
				</div>

				<h2>Large size</h2>
				<div className="ptr-docs-panel-section">
					<Button large>Basic</Button>
					<Button large primary>Primary</Button>
					<Button large secondary>Secondary</Button>
				</div>

				<h2>Large size with icon</h2>
				<div className="ptr-docs-panel-section">
					<Button large icon="delete">Basic</Button>
					<Button large icon="download">Basic</Button>
					<Button large icon="plus">Basic</Button>
					<Button large primary icon="delete">Primary</Button>
					<Button large primary icon="download">Primary</Button>
					<Button large primary icon="plus">Primary</Button>
					<Button large secondary icon="delete">Secondary</Button>
					<Button large secondary icon="download">Secondary</Button>
					<Button large secondary>Secondary<Icon icon="plus"/></Button>
				</div>

				<h2>Large size with icon only</h2>
				<div className="ptr-docs-panel-section">
					<Button large icon="delete"/>
					<Button large icon="download"/>
					<Button large icon="plus"/>
				</div>

				<h2>Disabled</h2>
				<div className="ptr-docs-panel-section">
					<Button disabled>Basic</Button>
					<Button disabled primary>Primary</Button>
					<Button disabled secondary>Secondary</Button>
				</div>

				<h2>Disabled with icon</h2>
				<div className="ptr-docs-panel-section">
					<Button disabled icon="delete">Basic</Button>
					<Button disabled primary icon="download">Basic</Button>
					<Button disabled secondary icon="plus">Basic</Button>
				</div>

				<h2>Invisible</h2>
				<div className="ptr-docs-panel-section">
					<Button invisible>Basic</Button>
				</div>

				<h2>Button with menu</h2>
				<div className="ptr-docs-panel-section">
					<Button icon="dots" invisible>
						<Menu bottom right>
							<MenuItem disabled>Item 1</MenuItem>
							<MenuItem>Wtf menu item</MenuItem>
							<MenuItem>Omg</MenuItem>
						</Menu>
					</Button>
				</div>

				<h2>Ghost</h2>
				<div className="ptr-docs-panel-section">
					<Button ghost>Basic</Button>
					<Button ghost primary>Primary</Button>
				</div>

				<h2>Ghost with icon</h2>
				<div className="ptr-docs-panel-section">
					<Button ghost icon="delete">Basic</Button>
					<Button ghost primary icon="download">Basic</Button>
				</div>

				<h2>Ghost small</h2>
				<div className="ptr-docs-panel-section">
					<Button ghost small>Basic</Button>
					<Button ghost small primary>Primary</Button>
				</div>

				<h2>Ghost small with icon</h2>
				<div className="ptr-docs-panel-section">
					<Button ghost small icon="delete">Basic</Button>
					<Button ghost small primary icon="plus">Basic</Button>
				</div>

				<h2>Ghost large</h2>
				<div className="ptr-docs-panel-section">
					<Button ghost large>Basic</Button>
					<Button ghost large primary>Primary</Button>
				</div>

				<h2>Ghost large with icon</h2>
				<div className="ptr-docs-panel-section">
					<Button ghost large icon="delete">Basic</Button>
					<Button ghost large primary icon="plus">Basic</Button>
				</div>

				<h2>Ghost disabled</h2>
				<div className="ptr-docs-panel-section">
					<Button ghost disabled>Basic</Button>
					<Button ghost disabled primary>Primary</Button>
				</div>

				<h2>Side icon</h2>
				<div className="ptr-docs-panel-section">
					<Button side="left" icon="times"/>
					<Button side="right" icon="chevron-left"/>
					<Button side="top" primary icon="plus"/>
					<Button side="bottom" secondary icon="pushpin"/>
				</div>

				<h2>Ghost side icon</h2>
				<div className="ptr-docs-panel-section">
					<Button ghost side="left" icon="times"/>
					<Button ghost side="right" icon="chevron-left"/>
					<Button ghost side="right" icon="chevron-right"/>
					<Button ghost side="top" primary icon="plus"/>
					<Button ghost side="bottom" primary icon="pushpin"/>
				</div>


				<h2>Circular</h2>
				<div className="ptr-docs-panel-section">
					<Button circular icon="chevron-left"/>
					<Button circular primary icon="plus"/>
					<Button circular secondary icon="edit"/>
				</div>

				<h2>Circular small</h2>
				<div className="ptr-docs-panel-section">
					<Button circular small icon="expand"/>
					<Button circular small primary icon="search"/>
					<Button circular small secondary icon="chevron-left"/>
				</div>

				<h2>Circular large</h2>
				<div className="ptr-docs-panel-section">
					<Button circular large icon="expand"/>
					<Button circular large primary icon="search"/>
					<Button circular large primary icon="times"/>
					<Button circular large secondary icon="chevron-left"/>
					<Button circular large secondary icon="chevron-right"/>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(ButtonDoc);