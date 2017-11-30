define([
    'src/__new/js/view/widgets/inputs/selectbox/SelectBox',
    'jquery',
    'jquery-ui'
], function (SelectBox,
             $) {
    "use strict";

    var target = $('<div id="container"></div>');
    $('html').append(target);

    describe('Given select box with given options', function(){
        var selectbox = new SelectBox({
            id: 'selectbox-test',
            name: 'SelectBox',
            target: target,
            data: ['Blue', 'Red', 'White']
        });

        describe('When selectbox is built with given parameters', function(){
            var output = $('#selectbox-test option:nth-child(2)').html();
            it("Then the first option is Blue", function(){
                expect(output).toBe("Blue");
            });
        });
    });
});