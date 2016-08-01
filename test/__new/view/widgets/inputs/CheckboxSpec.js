define([
    'src/__new/js/view/widgets/inputs/checkbox/Checkbox',
    'jquery'
], function (Checkbox,
             $) {
    "use strict";

    var target = $('<div id="container"></div>');
    $('html').append(target);

    describe('Given checkbox', function(){
        var checkbox = new Checkbox({
            checked: true,
            id: 'checkbox-test',
            name: 'Checkbox',
            target: target,
            containerId: 'container'
        });

        describe('When checkbox is built with given parameters', function(){
            var output = $('#checkbox-test').hasClass('checked');
            it("Then the created element has class checked", function(){
                expect(output).toBeTruthy();
            });

            var label = $('#checkbox-test .checkbox-label').html();
            it("Then the label is Checkbox", function(){
                expect(label).toBe('Checkbox');
            });
        });

        describe('When user clicks on the checkbox', function(){
            var output = $('#checkbox-test').trigger('click').hasClass('checked');
            it("Then the checkbox element has not class checked", function(){
                expect(output).toBeFalsy();
            });
        });
    });
});