define([
    'src/__new/js/util/viewUtils'
], function (viewUtils) {
    "use strict";

    describe('Given number for thousands separating', function(){
        var number = 102000.257;
        var number2 = 0.7584;

        describe('When a long number is given', function(){
            var output = viewUtils.numberFormat(number, true, 2);

            it("Then thousands are separated by comma", function(){
                expect(output).toBe('102,000');
            });

            it("Then output date type should be string", function(){
                expect(typeof output).toBe('string');
            });
        });

        describe('When a short number is given', function(){
            var output = viewUtils.numberFormat(number2, true, 2);

            it("It should be rounded to 2 decimal digits", function(){
                expect(output).toBe('0.76');
            });
        });
    });

    describe('Test if given number is natural', function(){
        var number = 5;
        var number2 = -5;
        var number3 = 0;
        var number4 = 1.1;
        var text = "aaa";

        describe('When natural number is given', function(){
            var output = viewUtils.isNaturalNumber(number);

            it("Then the result is true", function(){
                expect(output).toBeTruthy();
            });
        });

        describe('When number lower than 0 is given', function(){
            var output = viewUtils.isNaturalNumber(number2);

            it("Then the result is false", function(){
                expect(output).toBeFalsy();
            });
        });

        describe('When 0 is given', function(){
            var output = viewUtils.isNaturalNumber(number3);

            it("Then the result is true", function(){
                expect(output).toBeTruthy();
            });
        });

        describe('When real number is given', function(){
            var output = viewUtils.isNaturalNumber(number4);

            it("Then the result is false", function(){
                expect(output).toBeFalsy();
            });
        });

        describe('When text is given', function(){
            var output = viewUtils.isNaturalNumber(text);

            it("Then the result is false", function(){
                expect(output).toBeFalsy();
            });
        });
    });
});