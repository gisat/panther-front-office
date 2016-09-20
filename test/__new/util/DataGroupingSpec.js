define([
    'src/__new/js/util/DataGrouping',
    'test/__new/data/testData'
], function (DataGrouping,
             testData) {
    "use strict";

    var dataSet = testData;

    describe('Given DataGrouping object with options', function(){
        var grouping = new DataGrouping({
            groupingOptions: ['Czech Republic', 'Spain', 'France']
        });
        var grouped = grouping.groupData(dataSet, 'country');

        describe('When DataGrouping is initialized', function(){
            var output = grouping._classes;
            it("Then 3 classes are made", function(){
                expect(output.length).toBe(3);
            });
        });

        describe('When the data are grouped according to country', function(){
            var output = grouped.filter(function(obj){
                return obj.name == 'Czech Republic';
            });
            it("Then the count for class with name Czech Republic is 2", function(){
                expect(output[0].count).toBe(2);
            });
        });
    });
});