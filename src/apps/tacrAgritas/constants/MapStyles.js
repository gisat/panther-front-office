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
		"outlineColor": "#000000",
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

export const style_EOS = utils.fillStyleTemplate(
	{
		attributeKey: "EOS",
		attributeClasses:[
			{
				"interval": [0,180],
				"intervalBounds": [false, true],
				"fill": "#709959"
			},
			{
				"interval": [181,195],
				"intervalBounds": [true, true],
				"fill": "#a9bf78"
			},
			{
				"interval": [196,210],
				"intervalBounds": [true, true],
				"fill": "#e7e89b"
			},
			{
				"interval": [211,225],
				"intervalBounds": [true, true],
				"fill": "#f2e599"
			},
			{
				"interval": [226,240],
				"intervalBounds": [true, true],
				"fill": "#f2d58d"
			},
			{
				"interval": [241,255],
				"intervalBounds": [true, true],
				"fill": "#e6bb83"
			},
			{
				"interval": [256,270],
				"intervalBounds": [true, true],
				"fill": "#d19f82"
			},
			{
				"interval": [271,285],
				"intervalBounds": [true, true],
				"fill": "#c99389"
			},
			{
				"interval": [286,300],
				"intervalBounds": [true, true],
				"fill": "#e6bec9"
			},
			{
				"interval": [301,365],
				"intervalBounds": [true, true],
				"fill": "#fff2ff"
			}
		]
	}
);

export const style_LOS_GRW = utils.fillStyleTemplate(
	{
		attributeKey: "LOS_GRW",
		attributeClasses:[
			{
				"interval": [0,20],
				"intervalBounds": [false, true],
				"fill": "#709959"
			},
			{
				"interval": [21,30],
				"intervalBounds": [true, true],
				"fill": "#bbcc83"
			},
			{
				"interval": [31,40],
				"intervalBounds": [true, true],
				"fill": "#f2eaa0"
			},
			{
				"interval": [41,50],
				"intervalBounds": [true, true],
				"fill": "#f2d88f"
			},
			{
				"interval": [51,60],
				"intervalBounds": [true, true],
				"fill": "#e3b684"
			},
			{
				"interval": [61,70],
				"intervalBounds": [true, true],
				"fill": "#c7927d"
			},
			{
				"interval": [71,80],
				"intervalBounds": [true, true],
				"fill": "#e0b1b8"
			},
			{
				"interval": [81,365],
				"intervalBounds": [true, true],
				"fill": "#fff2ff"
			}
		]
	}
);

export const style_LOS_SEN = utils.fillStyleTemplate(
	{
		attributeKey: "LOS_SEN",
		attributeClasses:[
			{
				"interval": [0,40],
				"intervalBounds": [false, true],
				"fill": "#709959"
			},
			{
				"interval": [41,50],
				"intervalBounds": [true, true],
				"fill": "#bbcc83"
			},
			{
				"interval": [51,60],
				"intervalBounds": [true, true],
				"fill": "#f2eaa0"
			},
			{
				"interval": [61,70],
				"intervalBounds": [true, true],
				"fill": "#f2d88f"
			},
			{
				"interval": [71,80],
				"intervalBounds": [true, true],
				"fill": "#e3b684"
			},
			{
				"interval": [81,90],
				"intervalBounds": [true, true],
				"fill": "#c7927d"
			},
			{
				"interval": [91,100],
				"intervalBounds": [true, true],
				"fill": "#e0b1b8"
			},
			{
				"interval": [101,365],
				"intervalBounds": [true, true],
				"fill": "#fff2ff"
			}
		]
	}
);