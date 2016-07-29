define([
    'src/__new/js/util/histogram/Histogram',
    'jquery'
], function (Histogram,
             $) {
    "use strict";

    describe('Initialize histogram', function(){

        var element = $('<div id="histogram-test" style="height: 10px; width: 100px"></div>');
        $('html').append(element);

        var histogram = new Histogram({
            id: 'test',
            numClasses: 5,
            minimum: 0,
            maximum: 10
        });

        describe('When 5 classes between 0 and 10 is created', function(){
            var output = histogram.buildClasses();

            it("Then boundaries of second class are 2 and 4", function(){
                expect(output[1].minimum).toBe(2);
                expect(output[1].maximum).toBe(4);
            });
            it("Then boundaries of last class are 8 and 10", function(){
                expect(output[output.length - 1].minimum).toBe(8);
                expect(output[output.length - 1].maximum).toBe(10);
            });
        });

        describe('When classes are given', function(){
            histogram._classes = [{
                minimum: 0.5,
                maximum: 1,
                count: 5
            },
                {
                    minimum: 1,
                    maximum: 1.5,
                    count: 10
                },
                {
                    minimum: 1.5,
                    maximum: 2,
                    count: 8
                }];

            var output = histogram.getMostFrequented();

            it("Then the highest count is 10", function(){
                expect(output).toBe(10);
            });
        });

        describe('When histogram is redrawed', function(){
            histogram.redraw();
            var height = $('.histogram-bar:last-child').css("height");

            it("Then height of the last bar is 8px", function(){
                expect(height).toBe('8px');
            });
        });

        describe('When slider is positioned as min value is 1.1 and max is 1.4', function(){
            histogram.selectBars([1.1,1.4]);
            var first = $('.histogram-bar:nth-child(2)').hasClass("selected");
            var second = $('.histogram-bar:nth-child(2)').hasClass("selected");
            var third = $('.histogram-bar:nth-child(2)').hasClass("selected");

            it("Then the second bar is selected", function(){
                expect(second).toBeTruthy;
            });
            it("Then the first and third bars are not selected", function(){
                expect(first).toBeFalsy;
                expect(third).toBeFalsy;
            });
        });
    });
});