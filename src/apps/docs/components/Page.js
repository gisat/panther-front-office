import React from 'react';
import Helmet from 'react-helmet';

export const PageTitle = ({children}) => (
	<div className="ptr-docs-page-title">
		<Helmet><title>{children}</title></Helmet>
		<h1>{children}</h1>
	</div>
);

const Page = ({title, children}) => (
	<div className="ptr-docs-page">
		{title ? (<PageTitle>{title}</PageTitle>	) : null}
		{children}
	</div>
);

export default Page;