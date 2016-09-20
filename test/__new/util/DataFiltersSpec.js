define([
    'src/__new/js/util/DataFilters',
    'src/__new/js/view/widgets/inputs/checkbox/Checkbox',
    'test/__new/data/testData',
    'jquery-private',
    'underscore'
], function (DataFilters,
             Checkbox,
             testData,
             $,
             _) {
    "use strict";

    var DataFilters = new DataFilters();
    var dataSet = testData;

    var checkbox = new Checkbox({
        checked: false,
        id: 'onCoast',
        name: 'On coast',
        target: $('#widget-container'),
        containerId: 'widget-container'
    });

    describe('Given data set and filters', function(){
        checkbox.isChecked = function(){
            return true;
        };

        var inputs = {
            checkboxes: [checkbox]
        };

        describe('When a city should be on the coast', function(){
            var output = DataFilters.filter(dataSet,inputs);
            it("Then only one city is filtered", function(){
                expect(output.length).toBe(1);
            });
            it("Then the city name is Barcelona", function(){
                expect(output[0].name).toBe("Barcelona");
            });
        });

        checkbox.isChecked = function(){
            return false;
        };
        describe('When a city should not be on the coast', function(){
            var output = DataFilters.filter(dataSet,inputs);
            it("Then 3 citties are filtered", function(){
                expect(output.length).toBe(3);
            });
        });
    });

    describe('Given attribute name and value to compare', function(){
        var attribute = "country";
        var value = "France";

        describe('When a country is France', function(){
            var output = DataFilters.compare(dataSet,attribute,value);
            it("Then only one city is selected", function(){
                expect(output.length).toBe(1);
            });
            it("Then the city name is Paris", function(){
                expect(output[0].name).toBe("Paris");
            });
        });
    });

    describe('Given attribute with numeric values to find extreme values', function(){
        var attribute = "population";

        describe('When we want to find extreme values in data population', function(){
            var output = DataFilters.getMinMax(dataSet,attribute);
            it("Then the maximum is 5 000 000", function(){
                expect(output[1]).toBe(5000000);
            });
            it("Then the minimum is 170 000", function(){
                expect(output[0]).toBe(170000);
            });
        });
    });

    describe('Given attribute with string values to find unique values i dataset', function(){
        var attribute = "country";

        describe('When we want to find unique values for country attribute', function(){
            var output = DataFilters.getUniqueValues(dataSet,attribute);
            it("Then there are 3 unique values", function(){
                expect(output.length).toBe(3);
            });
        });
    });

    describe('Given attribute with numeric values to filter data', function(){
        var attribute = "population";
        var thresholds = [1000000,2000000];

        describe('When we want to filter data according to population (between 1 and 2 mio)', function(){
            var output = DataFilters.isBetween(dataSet,attribute,thresholds);
            it("Then 2 cities are filtered", function(){
                expect(output.length).toBe(2);
            });
        });
    });
});