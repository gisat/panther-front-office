import React from 'react';
import Helmet from 'react-helmet';
import classNames from 'classnames';
import _ from 'lodash';
import { Prism as Highlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Icon from '../../../components/common/atoms/Icon';

export const PageTitle = ({children}) => (
	<div className="ptr-docs-page-title">
		<Helmet><title>{children}</title></Helmet>
		<h1>{children}</h1>
	</div>
);

export const LightDarkBlock = ({children}) => (
	<div className="ptr-docs-light-dark-block">
		<div className="ptr-light">
			{children}
		</div>
		<div className="ptr-dark">
			{children}
		</div>
	</div>
);

export const ComponentPropsTable = ({content}) => (
	<table className="ptr-docs-props-table">
		<tbody>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Default</th>
			<th>Required</th>
			<th>Description</th>
		</tr>
		{content.map((prop, index) => {
			return _.isEmpty(prop) ? (
				<tr key={index} className="ptr-docs-props-table-empty-row">
				</tr>
			) : (
				<tr key={index}>
					<td className="ptr-docs-props-table-name">{prop.name}</td>
					<td className="ptr-docs-props-table-type">{prop.type}</td>
					<td className="ptr-docs-props-table-default">{prop.default}</td>
					<td className="ptr-docs-props-table-required">{prop.required ? <Icon icon="circle"/> : null}</td>
					<td className="ptr-docs-props-table-description">{prop.description}{
						prop.objectPropsDescription ? (
							<div className="ptr-docs-props-table-description-object">
								{prop.objectPropsDescription.map((objectProp, index) => (
									<div key={index}>
										<span>{objectProp.name + ' [' + objectProp.type + ']: '}</span>
										{objectProp.description}
									</div>
								))}
							</div>
						) : null
					}</td>
				</tr>)
			}
		)}
		</tbody>
	</table>
);

export const SyntaxHighlighter = ({language, children}) => (
	<Highlighter language={language} customStyle={{background: null}} className="ptr-docs-syntax-highlighter" style={tomorrow}>
		{children}
	</Highlighter>
);

const Page = ({title, lightDark, children}) => (
	<div className={classNames("ptr-docs-page", {lightDark})}>
		{title ? (<PageTitle>{title}</PageTitle>	) : null}
		{children}
	</div>
);

export default Page;