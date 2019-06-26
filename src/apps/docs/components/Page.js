import React from 'react';
import Helmet from 'react-helmet';
import classNames from 'classnames';

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

const Page = ({title, lightDark, children}) => (
	<div className={classNames("ptr-docs-page", {lightDark})}>
		{title ? (<PageTitle>{title}</PageTitle>	) : null}
		{children}
	</div>
);

export default Page;