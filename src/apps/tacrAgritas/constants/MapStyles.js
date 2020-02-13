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

export const style_AMPLITUDE = utils.fillStyleTemplate(
	{
		attributeKey: "AMPLITUDE",
		attributeClasses:[
			{
				"interval": [0,2000],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},{
				"interval": [2000,2500],
				"intervalBounds": [false, true],
				"fill": "#7a391b"
			},{
				"interval": [2500,3000],
				"intervalBounds": [false, true],
				"fill": "#915d2c"
			},{
				"interval": [3000,3500],
				"intervalBounds": [false, true],
				"fill": "#a88640"
			},{
				"interval": [3500,4000],
				"intervalBounds": [false, true],
				"fill": "#c2b659"
			},{
				"interval": [4000,4500],
				"intervalBounds": [false, true],
				"fill": "#b5bd5b"
			},{
				"interval": [4500,5000],
				"intervalBounds": [false, true],
				"fill": "#849c44"
			},{
				"interval": [5000,5500],
				"intervalBounds": [false, true],
				"fill": "#5b7d31"
			},{
				"interval": [5500,6000],
				"intervalBounds": [false, true],
				"fill": "#356120"
			},{
				"interval": [6000,10000],
				"intervalBounds": [false, true],
				"fill": "#104510"
			},
		]
	}
);

export const style_BASE_GRW = utils.fillStyleTemplate(
	{
		attributeKey: "BASE_GRW",
		attributeClasses:[
			{
				"interval": [0,2000],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},
			{
				"interval": [2000,2500],
				"intervalBounds": [false, true],
				"fill": "#80421f"
			},
			{
				"interval": [2500,3000],
				"intervalBounds": [false, true],
				"fill": "#9e7337"
			},
			{
				"interval": [3000,3500],
				"intervalBounds": [false, true],
				"fill": "#bdad55"
			},
			{
				"interval": [3500,4000],
				"intervalBounds": [false, true],
				"fill": "#aeb858"
			},
			{
				"interval": [4000,4500],
				"intervalBounds": [false, true],
				"fill": "#708c3b"
			},
			{
				"interval": [4500,5000],
				"intervalBounds": [false, true],
				"fill": "#3f6925"
			},
			{
				"interval": [5000,10000],
				"intervalBounds": [false, true],
				"fill": "#104510"
			}
		]
	}
);

export const style_BASE_SEN = utils.fillStyleTemplate(
	{
		attributeKey: "BASE_SEN",
		attributeClasses:[
			{
				"interval": [0,1000],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},
			{
				"interval": [1000,1500],
				"intervalBounds": [false, true],
				"fill": "#80421f"
			},
			{
				"interval": [1500,2000],
				"intervalBounds": [false, true],
				"fill": "#9e7337"
			},
			{
				"interval": [2000,2500],
				"intervalBounds": [false, true],
				"fill": "#bdad55"
			},
			{
				"interval": [2500,3000],
				"intervalBounds": [false, true],
				"fill": "#aeb858"
			},
			{
				"interval": [3000,3500],
				"intervalBounds": [false, true],
				"fill": "#708c3b"
			},
			{
				"interval": [3500,4000],
				"intervalBounds": [false, true],
				"fill": "#3f6925"
			},
			{
				"interval": [4000,10000],
				"intervalBounds": [false, true],
				"fill": "#104510"
			}
		]
	}
);

export const style_CLIMAX_DOY = utils.fillStyleTemplate(
	{
		attributeKey: "CLIMAX_DOY",
		attributeClasses:[
			{
				"interval": [0,100],
				"intervalBounds": [false, true],
				"fill": "#709959"
			},{
				"interval": [101,115],
				"intervalBounds": [true, true],
				"fill": "#a9bf78"
			},{
				"interval": [116,130],
				"intervalBounds": [true, true],
				"fill": "#e7e89b"
			},{
				"interval": [131,145],
				"intervalBounds": [true, true],
				"fill": "#f2e599"
			},{
				"interval": [146,160],
				"intervalBounds": [true, true],
				"fill": "#f2d58d"
			},{
				"interval": [161,175],
				"intervalBounds": [true, true],
				"fill": "#e6bb83"
			},{
				"interval": [176,190],
				"intervalBounds": [true, true],
				"fill": "#d19f82"
			},{
				"interval": [191,205],
				"intervalBounds": [true, true],
				"fill": "#c99389"
			},{
				"interval": [206,220],
				"intervalBounds": [true, true],
				"fill": "#e6bec9"
			},{
				"interval": [220,365],
				"intervalBounds": [true, true],
				"fill": "#fff2ff"
			}
		]
	}
);

export const style_CLIMAX_VI = utils.fillStyleTemplate(
	{
		attributeKey: "CLIMAX_VI",
		attributeClasses:[
			{
				"interval": [0,5000],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},{
				"interval": [5000,5500],
				"intervalBounds": [false, true],
				"fill": "#7a391b"
			},{
				"interval": [5500,6000],
				"intervalBounds": [false, true],
				"fill": "#915d2c"
			},{
				"interval": [6000,6500],
				"intervalBounds": [false, true],
				"fill": "#a88640"
			},{
				"interval": [6500,7000],
				"intervalBounds": [false, true],
				"fill": "#c2b659"
			},{
				"interval": [7000,7500],
				"intervalBounds": [false, true],
				"fill": "#b5bd5b"
			},{
				"interval": [7500,8000],
				"intervalBounds": [false, true],
				"fill": "#849c44"
			},{
				"interval": [8000,8500],
				"intervalBounds": [false, true],
				"fill": "#5b7d31"
			},{
				"interval": [8500,9000],
				"intervalBounds": [false, true],
				"fill": "#356120"
			},{
				"interval": [9000,10000],
				"intervalBounds": [false, true],
				"fill": "#104510"
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

export const style_GRW_DOY = utils.fillStyleTemplate(
	{
		attributeKey: "GRW_DOY",
		attributeClasses:[
			{
				"interval": [0,90],
				"intervalBounds": [false, true],
				"fill": "#709959"
			},{
				"interval": [91,105],
				"intervalBounds": [true, true],
				"fill": "#a9bf78"
			},{
				"interval": [106,120],
				"intervalBounds": [true, true],
				"fill": "#e7e89b"
			},{
				"interval": [121,135],
				"intervalBounds": [true, true],
				"fill": "#f2e599"
			},{
				"interval": [136,150],
				"intervalBounds": [true, true],
				"fill": "#f2d58d"
			},{
				"interval": [151,165],
				"intervalBounds": [true, true],
				"fill": "#e6bb83"
			},{
				"interval": [166,180],
				"intervalBounds": [true, true],
				"fill": "#d19f82"
			},{
				"interval": [181,195],
				"intervalBounds": [true, true],
				"fill": "#c99389"
			},{
				"interval": [196,210],
				"intervalBounds": [true, true],
				"fill": "#e6bec9"
			},{
				"interval": [211,365],
				"intervalBounds": [true, true],
				"fill": "#fff2ff"
			}
		]
	}
);

export const style_GRW_RATE = utils.fillStyleTemplate(
	{
		attributeKey: "GRW_RATE",
		attributeClasses:[
			{
				"interval": [0,50],
				"intervalBounds": [false, true],
				"fill": "#61391b"
			},{
				"interval": [50,100],
				"intervalBounds": [false, true],
				"fill": "#7a391b"
			},{
				"interval": [100,150],
				"intervalBounds": [false, true],
				"fill": "#915d2c"
			},{
				"interval": [150,200],
				"intervalBounds": [false, true],
				"fill": "#a88640"
			},{
				"interval": [200,250],
				"intervalBounds": [false, true],
				"fill": "#c2b659"
			},{
				"interval": [250,300],
				"intervalBounds": [false, true],
				"fill": "#b5bd5b"
			},{
				"interval": [300,350],
				"intervalBounds": [false, true],
				"fill": "#849c44"
			},{
				"interval": [350,400],
				"intervalBounds": [false, true],
				"fill": "#5b7d31"
			},{
				"interval": [400,450],
				"intervalBounds": [false, true],
				"fill": "#356120"
			},{
				"interval": [450,999],
				"intervalBounds": [false, true],
				"fill": "#104510"
			},
		]
	}
);

export const style_LINT_GRW = utils.fillStyleTemplate(
	{
		attributeKey: "LINT_GRW",
		attributeClasses:[
			{
				"interval": [0,1000],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},{
				"interval": [1000,1500],
				"intervalBounds": [false, true],
				"fill": "#7a391b"
			},{
				"interval": [1500,2000],
				"intervalBounds": [false, true],
				"fill": "#915d2c"
			},{
				"interval": [2000,2500],
				"intervalBounds": [false, true],
				"fill": "#a88640"
			},{
				"interval": [2500,3000],
				"intervalBounds": [false, true],
				"fill": "#c2b659"
			},{
				"interval": [3000,3500],
				"intervalBounds": [false, true],
				"fill": "#b5bd5b"
			},{
				"interval": [3500,4000],
				"intervalBounds": [false, true],
				"fill": "#849c44"
			},{
				"interval": [4000,4500],
				"intervalBounds": [false, true],
				"fill": "#5b7d31"
			},{
				"interval": [4500,5000],
				"intervalBounds": [false, true],
				"fill": "#356120"
			},{
				"interval": [5000,10000],
				"intervalBounds": [false, true],
				"fill": "#104510"
			},
		]
	}
);

export const style_LINT_SEN = utils.fillStyleTemplate(
	{
		attributeKey: "LINT_SEN",
		attributeClasses:[
			{
				"interval": [0,1000],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},{
				"interval": [1000,1500],
				"intervalBounds": [false, true],
				"fill": "#7a391b"
			},{
				"interval": [1500,2000],
				"intervalBounds": [false, true],
				"fill": "#915d2c"
			},{
				"interval": [2000,2500],
				"intervalBounds": [false, true],
				"fill": "#a88640"
			},{
				"interval": [2500,3000],
				"intervalBounds": [false, true],
				"fill": "#c2b659"
			},{
				"interval": [3000,3500],
				"intervalBounds": [false, true],
				"fill": "#b5bd5b"
			},{
				"interval": [3500,4000],
				"intervalBounds": [false, true],
				"fill": "#849c44"
			},{
				"interval": [4000,4500],
				"intervalBounds": [false, true],
				"fill": "#5b7d31"
			},{
				"interval": [4500,5000],
				"intervalBounds": [false, true],
				"fill": "#356120"
			},{
				"interval": [5000,10000],
				"intervalBounds": [false, true],
				"fill": "#104510"
			},
		]
	}
);

export const style_LINT_TOT = utils.fillStyleTemplate(
	{
		attributeKey: "LINT_TOT",
		attributeClasses:[
			{
				"interval": [0,3000],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},{
				"interval": [3000,3500],
				"intervalBounds": [false, true],
				"fill": "#7a391b"
			},{
				"interval": [3500,4000],
				"intervalBounds": [false, true],
				"fill": "#915d2c"
			},{
				"interval": [4000,4500],
				"intervalBounds": [false, true],
				"fill": "#a88640"
			},{
				"interval": [4500,5000],
				"intervalBounds": [false, true],
				"fill": "#c2b659"
			},{
				"interval": [5000,5500],
				"intervalBounds": [false, true],
				"fill": "#b5bd5b"
			},{
				"interval": [5500,6000],
				"intervalBounds": [false, true],
				"fill": "#849c44"
			},{
				"interval": [6000,6500],
				"intervalBounds": [false, true],
				"fill": "#5b7d31"
			},{
				"interval": [6500,7000],
				"intervalBounds": [false, true],
				"fill": "#356120"
			},{
				"interval": [7000,10000],
				"intervalBounds": [false, true],
				"fill": "#104510"
			},
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

export const style_LOS_TOT = utils.fillStyleTemplate(
	{
		attributeKey: "LOS_TOT",
		attributeClasses:[
			{
				"interval": [0,60],
				"intervalBounds": [false, true],
				"fill": "#709959"
			},
			{
				"interval": [61,75],
				"intervalBounds": [true, true],
				"fill": "#a9bf78"
			},
			{
				"interval": [76,90],
				"intervalBounds": [true, true],
				"fill": "#e7e89b"
			},
			{
				"interval": [91,105],
				"intervalBounds": [true, true],
				"fill": "#f2e599"
			},
			{
				"interval": [106,120],
				"intervalBounds": [true, true],
				"fill": "#f2d58d"
			},
			{
				"interval": [121,135],
				"intervalBounds": [true, true],
				"fill": "#e6bb83"
			},
			{
				"interval": [136,150],
				"intervalBounds": [true, true],
				"fill": "#d19f82"
			},
			{
				"interval": [151,165],
				"intervalBounds": [true, true],
				"fill": "#c99389"
			},
			{
				"interval": [166,180],
				"intervalBounds": [true, true],
				"fill": "#e6bec9"
			},
			{
				"interval": [180,365],
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

export const style_SEN_DOY = utils.fillStyleTemplate(
	{
		attributeKey: "SEN_DOY",
		attributeClasses:[
			{
				"interval": [0,150],
				"intervalBounds": [false, true],
				"fill": "#709959"
			},{
				"interval": [151,165],
				"intervalBounds": [true, true],
				"fill": "#a9bf78"
			},{
				"interval": [166,180],
				"intervalBounds": [true, true],
				"fill": "#e7e89b"
			},{
				"interval": [181,195],
				"intervalBounds": [true, true],
				"fill": "#f2e599"
			},{
				"interval": [196,210],
				"intervalBounds": [true, true],
				"fill": "#f2d58d"
			},{
				"interval": [211,225],
				"intervalBounds": [true, true],
				"fill": "#e6bb83"
			},{
				"interval": [226,240],
				"intervalBounds": [true, true],
				"fill": "#d19f82"
			},{
				"interval": [241,255],
				"intervalBounds": [true, true],
				"fill": "#c99389"
			},{
				"interval": [256,270],
				"intervalBounds": [true, true],
				"fill": "#e6bec9"
			},{
				"interval": [271,365],
				"intervalBounds": [true, true],
				"fill": "#fff2ff"
			}
		]
	}
);

export const style_SEN_RATE = utils.fillStyleTemplate(
	{
		attributeKey: "SEN_RATE",
		attributeClasses:[
			{
				"interval": [-999,-450],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},{
				"interval": [-450,-400],
				"intervalBounds": [false, true],
				"fill": "#7a391b"
			},{
				"interval": [-400,-350],
				"intervalBounds": [false, true],
				"fill": "#915d2c"
			},{
				"interval": [-350,-300],
				"intervalBounds": [false, true],
				"fill": "#a88640"
			},{
				"interval": [-300,-250],
				"intervalBounds": [false, true],
				"fill": "#c2b659"
			},{
				"interval": [-250,-200],
				"intervalBounds": [false, true],
				"fill": "#b5bd5b"
			},{
				"interval": [-200,-150],
				"intervalBounds": [false, true],
				"fill": "#849c44"
			},{
				"interval": [-150,-100],
				"intervalBounds": [false, true],
				"fill": "#5b7d31"
			},{
				"interval": [-100,-50],
				"intervalBounds": [false, true],
				"fill": "#356120"
			},{
				"interval": [-50,0],
				"intervalBounds": [false, true],
				"fill": "#104510"
			},
		]
	}
);

export const style_SINT_GRW = utils.fillStyleTemplate(
	{
		attributeKey: "SINT_GRW",
		attributeClasses:[
			{
				"interval": [0,500],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},{
				"interval": [500,750],
				"intervalBounds": [false, true],
				"fill": "#7a391b"
			},{
				"interval": [750,1000],
				"intervalBounds": [false, true],
				"fill": "#915d2c"
			},{
				"interval": [1000,1250],
				"intervalBounds": [false, true],
				"fill": "#a88640"
			},{
				"interval": [1250,1500],
				"intervalBounds": [false, true],
				"fill": "#c2b659"
			},{
				"interval": [1500,1750],
				"intervalBounds": [false, true],
				"fill": "#b5bd5b"
			},{
				"interval": [1750,2000],
				"intervalBounds": [false, true],
				"fill": "#849c44"
			},{
				"interval": [2000,2250],
				"intervalBounds": [false, true],
				"fill": "#5b7d31"
			},{
				"interval": [2250,2500],
				"intervalBounds": [false, true],
				"fill": "#356120"
			},{
				"interval": [2500,4000],
				"intervalBounds": [false, true],
				"fill": "#104510"
			},
		]
	}
);

export const style_SINT_SEN = utils.fillStyleTemplate(
	{
		attributeKey: "SINT_SEN",
		attributeClasses:[
			{
				"interval": [0,500],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},{
				"interval": [500,750],
				"intervalBounds": [false, true],
				"fill": "#7a391b"
			},{
				"interval": [750,1000],
				"intervalBounds": [false, true],
				"fill": "#915d2c"
			},{
				"interval": [1000,1250],
				"intervalBounds": [false, true],
				"fill": "#a88640"
			},{
				"interval": [1250,1500],
				"intervalBounds": [false, true],
				"fill": "#c2b659"
			},{
				"interval": [1500,1750],
				"intervalBounds": [false, true],
				"fill": "#b5bd5b"
			},{
				"interval": [1750,2000],
				"intervalBounds": [false, true],
				"fill": "#849c44"
			},{
				"interval": [2000,2250],
				"intervalBounds": [false, true],
				"fill": "#5b7d31"
			},{
				"interval": [2250,2500],
				"intervalBounds": [false, true],
				"fill": "#356120"
			},{
				"interval": [2500,4000],
				"intervalBounds": [false, true],
				"fill": "#104510"
			},
		]
	}
);
export const style_SINT_TOT = utils.fillStyleTemplate(
	{
		attributeKey: "SINT_TOT",
		attributeClasses:[
			{
				"interval": [0,1000],
				"intervalBounds": [false, true],
				"fill": "#61150d"
			},{
				"interval": [1000,1500],
				"intervalBounds": [false, true],
				"fill": "#7a391b"
			},{
				"interval": [1500,2000],
				"intervalBounds": [false, true],
				"fill": "#915d2c"
			},{
				"interval": [2000,2500],
				"intervalBounds": [false, true],
				"fill": "#a88640"
			},{
				"interval": [2500,3000],
				"intervalBounds": [false, true],
				"fill": "#c2b659"
			},{
				"interval": [3000,3500],
				"intervalBounds": [false, true],
				"fill": "#b5bd5b"
			},{
				"interval": [3500,4000],
				"intervalBounds": [false, true],
				"fill": "#849c44"
			},{
				"interval": [4000,4500],
				"intervalBounds": [false, true],
				"fill": "#5b7d31"
			},{
				"interval": [4500,5000],
				"intervalBounds": [false, true],
				"fill": "#356120"
			},{
				"interval": [5000,10000],
				"intervalBounds": [false, true],
				"fill": "#104510"
			},
		]
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