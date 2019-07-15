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

export const LightDarkBlock = ({forceRows, children}) => (
	<div className={classNames("ptr-docs-light-dark-block", {forceRows})}>
		<div className="ptr-light">
			{children}
		</div>
		<div className="ptr-dark">
			{children}
		</div>
	</div>
);

export const SyntaxHighlighter = ({language, children}) => (
	<Highlighter language={language} customStyle={{background: null}} className="ptr-docs-syntax-highlighter" style={tomorrow}>
		{children}
	</Highlighter>
);

export const InlineCodeHighlighter = ({children}) => (
	<span className="ptr-docs-inline-code-highlighter">{children}</span>
);

export const DocsToDo = ({children}) => (
	<div className="ptr-docs-todo">
		<div className="ptr-docs-todo-title">Missing documentation</div>
		<div className="ptr-docs-todo-body">{children}</div>
	</div>
);

export const DocsToDoInline = ({children}) => (
	<span className="ptr-docs-todo-inline">
		<i>Missing documentation:</i>
		{children}
	</span>
);

const Page = ({title, lightDark, children}) => (
	<div className={classNames("ptr-docs-page", {lightDark})}>
		{title ? (<PageTitle>{title}</PageTitle>	) : null}
		{children}
	</div>
);

export default Page;