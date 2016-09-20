define([
	'src/__new/js/util/Slider',
	'jquery',
	'jquery-ui'
], function (Slider,
			 $) {
	"use strict";

	var target = $('<div id="slider"></div><div id="slider2"></div><div class="slider-popup"></div>');
	$('html').append(target);

	describe('Given slider with given options', function(){
		var slider = new Slider({
			id: 'slider',
			range: [0,10],
			values: [1,9],
			type: 'range',
			step: 0.5
		});

		var slider2 = new Slider({
			id: 'slider2',
			range: [0,10],
			values: [1,9],
			step: 0.5
		});

		describe('When range slider is built with given parameters', function(){
			it("Then handles values are 1 and 9", function(done) {
				setTimeout(function() {
					var values = $('#slider').slider("values");
					expect(values[0]).toBe(1);
					expect(values[1]).toBe(9);
					done();
				}, 100);
			}, 101);
		});

		describe('When min slider is built with given parameters', function(){
			it("Then has only one value", function(done) {
				setTimeout(function() {
					var value = $('#slider2').slider("value");
					expect(value).toBe(1);
					done();
				}, 100);
			}, 101);
		});
	});
});