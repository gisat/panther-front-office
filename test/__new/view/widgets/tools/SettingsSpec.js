define([
    'src/__new/js/view/widgets/inputs/checkbox/Checkbox',
    'src/__new/js/view/widgets/tools/settings/Settings',
    'test/__new/data/testData',
    'jquery'
], function (Checkbox,
             Settings,
             testData,
             $) {
    "use strict";

    var dataSet = testData;

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