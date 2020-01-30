import utils from "../utils";

export const hoveredStyleDefinition = {
	"rules":[
		{
			"styles": [
				{
					"outlineColor": "#ff66b3",
					"outlineWidth": 4
				}
			]
		}
	]
};

export const selectedStyleDefinition = {
	"rules":[
		{
			"styles": [
				{
					"outlineColor": "#ff00ff",
					"outlineWidth": 4
				}
			]
		}
	]
};

export const outlinesStyle = utils.fillStyleTemplate(
	{
		"outlineWidth": 2,
		"outlineColor": "#888888",
		"fillOpacity": 0
	}
);

export const style_SOS = utils.fillStyleTemplate(
	{
		attributeKey: "SOS",
		attributeClasses:[
			{
				"interval": [0,90],
				"intervalBounds": [false, true],
				"fill": "#709959"
			},
			{
				"interval": [90,100],
				"intervalBounds": [true, true],
				"fill": "#a9bf78"
			},
			{
				"interval": [101,110],
				"intervalBounds": [true, true],
				"fill": "#e7e89b"
			},
			{
				"interval": [111,120],
				"intervalBounds": [true, true],
				"fill": "#f2e599"
			},
			{
				"interval": [121,130],
				"intervalBounds": [true, true],
				"fill": "#f2d58d"
			},
			{
				"interval": [131,140],
				"intervalBounds": [true, true],
				"fill": "#e6bb83"
			},
			{
				"interval": [141,150],
				"intervalBounds": [true, true],
				"fill": "#d19f82"
			},
			{
				"interval": [151,160],
				"intervalBounds": [true, true],
				"fill": "#c99389"
			},
			{
				"interval": [161,170],
				"intervalBounds": [true, true],
				"fill": "#e6bec9"
			},
			{
				"interval": [171,365],
				"intervalBounds": [true, true],
				"fill": "#fff2ff"
			}
		]
	}
);