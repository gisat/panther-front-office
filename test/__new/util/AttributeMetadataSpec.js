define([
	'src/__new/js/util/metadata/Attributes',
	'jquery',
	'jquery-ui'
], function (Attributes,
			 $) {
	"use strict";

	describe('Attributes metadata object given', function(){
		var attributesMetadata = new Attributes();
		describe('When ThemeYearConfParams has been requested', function(){
			var params = attributesMetadata.getThemeYearConfParams();
			it("Then the refreshLayers and refresh Areas are true", function(){
				expect(params.refreshAreas).toBe('true');
				expect(params.refreshLayers).toBe('true');
			});
		});
	});
});