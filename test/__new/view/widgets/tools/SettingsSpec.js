define([
    'src/__new/js/view/widgets/inputs/checkbox/Checkbox',
    'src/__new/js/view/widgets/tools/settings/Settings',
    'jquery'
], function (Checkbox,
             Settings,
             $) {
    "use strict";

    describe('Given attributes', function(){
        var container = $('<div id="container"></div>');
        var element = $('<div id="widget-test"></div>');
        $('html').append(container).append(element);

        var attributes = [{
            about: {
                as: 1,
                asName: "Area",
                attr: 2,
                attrName: "On coast",
                attrType: "boolean",
                units: null
            }
        },{
            about: {
                as: 3,
                asName: "Flags",
                attr: 4,
                attrName: "Colour",
                attrType: "text",
                units: null
            },
            metadata: ["red","blue","white"]
        },{
            about: {
                as: 5,
                asName: "Demography",
                attr: 6,
                attrName: "Population",
                attrType: "numeric",
                units: "inhabitans"
            },
            metadata: {
                min: 1000000,
                max: 2000000
            },
            distribution: [0,0,0,0,5,0,0,0,0,5,0,0,0,0,5,0,0,0,0,5]
        }];

        var settings = new Settings({
            target: container,
            widgetId: 'widget-test',
            attributes: attributes
        });

        describe('When settings has been built', function(){
            var output = settings.getCategories();

            it("Then there are 3 categories", function(){
                expect(Object.keys(output).length).toBe(3);
            });

            it("Then exist property attr-2", function(){
                expect(output.hasOwnProperty("attr-2")).toBeTruthy();
            });

            it("Then all categories are active", function(){
                for (var key in output){
                    expect(output[key].active).toBeTruthy();
                }
            });
            it("Then attr-4 input is selectbox", function(){
                expect(output["attr-4"].input).toBe("select");
            });
        });

        describe('When the confirm button is requested', function(){
            var output = settings.getConfirmButton();

            it("Then it has settings-confirm class", function(){
                expect(output.hasClass('settings-confirm')).toBeTruthy();
            });

            it("Then the text is confirm", function(){
                expect(output.html()).toBe('Confirm');
            });
        });

        describe('When an attribute has been added to the settings window', function(){
            var output = settings.addAttribute("attr-11","Test label");

            it("Then the element is added", function(){
                expect($("#settings-attr-11").hasClass('checkbox-row')).toBeTruthy();
            });
            it("Then the checkbox is checked", function(){
                expect($("#settings-attr-11").hasClass('checked')).toBeTruthy();
            });
            it("Then the checkbox label is Test label", function(){
                expect($("#settings-attr-11 .checkbox-label").html()).toBe("Test label");
            });
        });

        describe('When the attribute set label has been added', function(){
            var output = settings.addAttributeSetName('Attribute set','settings-as-78');

            it("Then the label is Attribute set", function(){
                expect($("#settings-as-78").html()).toBe("Attribute set");
            });
        });
    });
});