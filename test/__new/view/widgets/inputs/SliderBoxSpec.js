define([
    'src/__new/js/util/histogram/Histogram',
    'src/__new/js/view/widgets/inputs/sliderbox/SliderBox',
    'test/__new/data/testData',
    'src/__new/js/util/viewUtils',
    'jquery',
    'jquery-ui'
], function (Histogram,
             SliderBox,
             testData,
             viewUtils,
             $) {
    "use strict";

    var target = $('<div id="container"></div>');
    $('html').append(target);

    describe('Given slider box with given options', function(){
        var sliderbox = new SliderBox({
            id: 'population',
            name: 'SliderBox',
            target: target,
            data: testData,
            range: [0,12],
            values: [3,6],
            isRange: true
        });

        describe('When selectbox is built with given parameters', function(){
            it("Then handles values are 3 and 6", function(done) {
                setTimeout(function() {
                    var values = $('#population').slider("values");
                    expect(values[0]).toBe(3);
                    expect(values[1]).toBe(6);
                    done();
                }, 100);
            }, 101);
        });
    });
});