let polyglot = window.polyglot;

/**
 * Base class for creating of warning messages for widgets.
 * @constructor
 */

class WidgetWarning {

    /**
     * Generate warning
     * @param codes {Array} list of warning codes
     * @returns {string} HTML code of warning
     */
    generate(codes) {
        let self = this;
        let message = "<p>";
        codes.forEach(function (code) {
            message += self.getMessage(code) + "<br><br>";
        });

        return message + "</p>";
    };

    /**
     * It returns a message by code
     * @param code {number}
     * @returns {string} message
     */
    getMessage(code) {
        let message;
        switch (code) {
            case 1:
                message = polyglot.t("attributesAreMissingNoLinked");
                break;
            case 2:
                message = polyglot.t("attributesAreMissingPermissions");
                break;
            case 3:
                message = polyglot.t("attributesAreMissingBrokenLinks");
                break;
            case 4:
                message = polyglot.t("attributesAreMissingChoropleths");
                break;
            case 5:
                message = polyglot.t("datasetIsNotDefined");
                break;
            default:
                break;
        }

        return message;
    };
}

export default WidgetWarning;