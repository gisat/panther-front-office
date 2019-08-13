import React from 'react';

export const Visualization = (props) => {
	return (
		<div className="scudeoStories19-visualization">
			<div className="scudeoStories19-visualization-title">
				{props.title}
			</div>
			{props.children}
			<div className="scudeoStories19-visualization-description">
				{props.description}
			</div>
		</div>
	);
};