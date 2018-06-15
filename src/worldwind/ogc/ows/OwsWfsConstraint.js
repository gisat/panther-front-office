import WorldWind from '@nasaworldwind/worldwind';

const ArgumentError = WorldWind.ArgumentError,
    Logger = WorldWind.Logger;

/**
 * Constructs an OWS Constraint instance from an XML DOM.
 * @alias OwsWfsConstraint
 * @constructor
 * @classdesc Represents an OWS Constraint element of an OGC capabilities document.
 * OwsWfsConst object holds as properties all the fields specified in the OWS Constraint definition.
 * Fields can be accessed as properties named according to their document names converted to camel case.
 * For example, "operation".
 * @param {Element} element An XML DOM element representing the OWS Constraint element.
 * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
 */
var OwsWfsConstraint = function (element) {
    if (!element) {
        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "OwsWfsConstraint", "constructor", "missingDomElement"));
    }
    if (element.hasAttribute("name")) {
        this.name = element.getAttribute("name");
    }

    var children = element.children || element.childNodes;
    var child = children[c];
    if (child.localName === "AllowedValues") {
        var childrenValues = child.children || child.childNodes;
        for (var cc = 0; cc < childrenValues.length; cc++) {
            if (childrenValues[cc].localName === "Value") {
                this.allowedValues = this.allowedValues || [];
                this.allowedValues.push(childrenValues[cc].textContent);
            }
        }
    } else if (child.localName === "DefaultValue") {
        this.defaultValue = child.textContent;
    } else if (child.localName === "NoValues") {
        this.NoValues = "true";
    }
    // TODO: ValuesReference

};

export default OwsWfsConstraint;