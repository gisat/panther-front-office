import WorldWind from '@nasaworldwind/worldwind';
import OwsLanguageString from './OwsLanguageString';

const ArgumentError = WorldWind.ArgumentError,
    Logger = WorldWind.Logger;

var OwsKeywords = function (element) {
    if (!element) {
        throw new ArgumentError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "OwsKeywords", "constructor", "missingDomElement"));
    }

    //   console.log(element.localName);
    var children = element.children || element.childNodes;
    if (children.length === 1) {
        this.keywords = element.textContent;
    }

    else {
        for (var c = 0; c < children.length; c++) {
            var child = children[c];
            if (child.localName === "keyword" || child.localName === "Keyword") {
                this.keywords = this.keywords || [];
                this.keywords.push(new OwsLanguageString(child));
            }
        }
    }
};

export default OwsKeywords;