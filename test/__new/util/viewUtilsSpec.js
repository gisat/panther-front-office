define([
    'src/__new/js/util/viewUtils'
], function (viewUtils) {
    "use strict";

    describe('Given number for thousands separating', function(){
        var number = 102000;
        describe('When a long number is given', function(){
            var output = viewUtils.thousandSeparator(number);

            it("Then thousands are separated by comma", function(){
                expect(output).toBe('102,000');
            });

            it("Then output date type should be string", function(){
                expect(typeof output).toBe('string');
            });
        });
    });
});