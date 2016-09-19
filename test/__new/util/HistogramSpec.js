define([
    'src/__new/js/util/histogram/Histogram',
    'jquery',
    'underscore'
], function (Histogram,
             $,
             _) {
    "use strict";

    describe('Initialize histogram', function(){

        var element = $('<div id="histogram-test" style="height: 10px; width: 100px"></div>');
        $('html').append(element);

        var histogram = new Histogram({
            id: 'test',
            minimum: 0,
            maximum: 120
        });
        var distribution = [10,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
        var range = [10,110];

        histogram._numOfClasses = distribution.length;

        describe('When 20 classes between 10 and 110 is created', function(){
            var output = histogram.buildClasses(distribution, range);
            histogram._classes = output;

            it("Then boundaries of second class are 15 and 20", function(){
                expect(output[1].minimum).toBe(15);
                expect(output[1].maximum).toBe(20);
            });
            it("Then boundaries of last class are 85 and 90", function(){
                expect(output[output.length - 1].minimum).toBe(105);
                expect(output[output.length - 1].maximum).toBe(110);
            });
            it("Then the count of first class is 10", function(){
                expect(output[0].count).toBe(10);
            });
        });

        describe('When classes are given', function(){
            var output = histogram.getMostFrequented(histogram._classes);

            it("Then the highest count is 10", function(){
                expect(output).toBe(10);
            });
        });

        describe('When original classes are given and the original bar has width 2px', function(){
            var output = histogram.adjustNumberOfClasses(histogram._numOfClasses, 2);

            it("Then the adjusted number of classes will be 4", function(){
                expect(output).toBe(4);
            });
        });

        describe('When original classes are given and number of classes for grouping is 4', function(){
            var classes = $.extend(true, [], histogram._classes);
            var output = histogram.groupClasses(4, classes);

            it("Then there will be 4 new classes", function(){
                expect(output.length).toBe(4);
            });
            it("Then the count of first class will be 18", function(){
                expect(output[0].count).toBe(18);
            });
            it("Then maximal range of first class will be 35", function(){
                expect(output[0].maximum).toBe(35);
            });
        });

        describe('When the classes are emptied', function(){
            var classes = $.extend(true, [], histogram._classes);
            var output = histogram.emptyClasses(classes);
            it("Then count in every class is 0", function(){
                output.forEach(function(item){
                    expect(item.count).toBe(0);
                });
            });
        });
    });
});