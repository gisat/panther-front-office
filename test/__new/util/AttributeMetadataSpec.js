define([
	'src/__new/js/util/metadata/Attributes',
	'jquery',
	'jquery-ui'
], function (Attributes,
			 $) {
	"use strict";

	describe('Attributes metadata object given', function(){
		var attributesMetadata = new Attributes();
		attributesMetadata.filterAttribute = function(type, params){
			return {
				about: params,
				response: {
					"data": {
						"metaData": {
							"as_1_attr_2": {
								"min": 0,
								"max": 10,
								"units": "",
								"decimal": -2
							}
						},
						"dist": {
							"as_1_attr_2": [5,0,0,0,0,5,0,0,0,0,5,0,0,0,0,5,0,0,0,0]
						}
					},
					"success": true
				}
			}
		};

		describe('When ThemeYearConfParams has been requested', function(){
			var params = attributesMetadata.getThemeYearConfParams();
			it("Then the refreshLayers and refresh Areas are true", function(){
				expect(params.refreshAreas).toBe('true');
				expect(params.refreshLayers).toBe('true');
			});
		});

		describe('When attribute set and attribute data are given', function(){
			var attrSet = {
				id: 1,
				name: "Demography"
			};
			var attr = [{
				id: 2,
				name: "Population",
				type: "numeric",
				standardUnits: null
			}];
			var output = attributesMetadata.getAttributeDataByType(attrSet,attr);
			it("Then.....", function(){
				expect(output.response.data.dist["as_" + attrSet.id + "_attr_" + attr[0].id].length).toBe(20);
			});
		});
	});
});