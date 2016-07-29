define([
    'src/__new/js/util/DataFilters',
    'src/__new/js/view/widgets/inputs/checkbox/Checkbox',
    'jquery-private',
    'underscore'
], function (DataFilters,
             Checkbox,
             $,
             _) {
    "use strict";

    var DataFilters = new DataFilters();
    var dataSet = [
        {
            "_id": "5790bcc77000c6bdee402ea4",
            "index": 0,
            "name": "Prague",
            "data": {
                "onCoast": {
                    "name": "On coast",
                    "value": false
                },
                "capital": {
                    "name": "Capital",
                    "value": true
                },
                "population": {
                    "name": "Population",
                    "value": 1200000
                },
                "area": {
                    "name": "Area (sq km)",
                    "value": 2000
                },
                "country": {
                    "name": "Country",
                    "value": "Czech Republic"
                },
                "flag": {
                    "name": "Colour of the flag",
                    "value": "red"
                }
            }
        },
        {
            "_id": "5790bcc72482c25d539d832a",
            "index": 1,
            "name": "Barcelona",
            "data": {
                "onCoast": {
                    "name": "On coast",
                    "value": true
                },
                "capital": {
                    "name": "Capital",
                    "value": false
                },
                "population": {
                    "name": "Population",
                    "value": 1700000
                },
                "area": {
                    "name": "Area (sq km)",
                    "value": 1500
                },
                "country": {
                    "name": "Country",
                    "value": "Spain"
                },
                "flag": {
                    "name": "Colour of the flag",
                    "value": "red"
                }
            }
        },
        {
            "_id": "5790bcc7d9063595bf545262",
            "index": 2,
            "name": "Paris",
            "data": {
                "onCoast": {
                    "name": "On coast",
                    "value": false
                },
                "capital": {
                    "name": "Capital",
                    "value": true
                },
                "population": {
                    "name": "Population",
                    "value": 5000000
                },
                "area": {
                    "name": "Area (sq km)",
                    "value": 6323
                },
                "country": {
                    "name": "Country",
                    "value": "France"
                },
                "flag": {
                    "name": "Colour of the flag",
                    "value": "red"
                }
            }
        },
        {
            "_id": "5790bcc7ee9fb1952178e8f7",
            "index": 3,
            "name": "Pilsen",
            "data": {
                "onCoast": {
                    "name": "On coast",
                    "value": false
                },
                "capital": {
                    "name": "Capital",
                    "value": false
                },
                "population": {
                    "name": "Population",
                    "value": 170000
                },
                "area": {
                    "name": "Area (sq km)",
                    "value": 250
                },
                "country": {
                    "name": "Country",
                    "value": "Czech Republic"
                },
                "flag": {
                    "name": "Colour of the flag",
                    "value": "red"
                }
            }
        }
    ];

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