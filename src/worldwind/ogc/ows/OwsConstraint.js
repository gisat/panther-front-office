import WorldWind from '@nasaworldwind/worldwind';

const {ArgumentError, Logger} = WorldWind;

/**
 * Constructs an OWS Constraint instance from an XML DOM.
 * @alias OwsConstraint
 * @constructor
 * @classdesc Represents an OWS Constraint element of an OGC capabilities document.
 * This object holds as properties all the fields specified in the OWS Constraint definition.
 * Fields can be accessed as properties named according to their document names converted to camel case.
 * For example, "operation".
 * @param {Element} element An XML DOM element representing the OWS Constraint element.
 * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
 */
var OwsConstraint = function (element) {
    if (!element) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "OwsConstraint", "constructor", "missingDomElement"));
    }

    this.name = element.getAttribute("name");

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
        var child = children[c];

        if (child.localName === "AllowedValues") {
            this.allowedValues = this.allowedValues || [];

            var childrenValues = child.children || child.childNodes;
            for (var cc = 0; cc < childrenValues.length; cc++) {
                if (childrenValues[cc].localName === "Value") {
                    this.allowedValues.push(childrenValues[cc].textContent);
                }
            }
        } else if (child.localName === "AnyValue") {
            this.anyValue = true;
        } else if (child.localName === "NoValues") {
            this.noValues = true;
        }
        // TODO: ValuesReference
    }

};

export default OwsConstraint;