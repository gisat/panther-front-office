define([
    'src/__new/js/view/widgets/inputs/checkbox/Checkbox',
    'src/__new/js/view/widgets/tools/settings/Settings',
    'jquery'
], function (Checkbox,
             Settings,
             $) {
    "use strict";

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

    describe('Given data set', function(){
        var target = $('<div id="target-test"></div>');
        $('html').append(target);

        var settings = new Settings({
            dataSet: dataSet,
            target: target,
            widgetId: 'widget-test'
        });

        describe('When categories from the data set are built', function(){
            settings.addCategories();
            var select = settings._categories["country"].input;
            var capital = settings._categories["capital"].name;

            it("Then country input property has 'Select' value", function(){
                expect(select).toBe("select");
            });
            it("Then capital name property has 'Capital' value", function(){
                expect(capital).toBe("Capital");
            });
        });
    });
});