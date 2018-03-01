
import './PanelIFrame.css';

let Observer = window.Observer;

let $ = window.$;
class PanelIFrame {
    constructor(url) {
        this._target = $('#app-extra-content');
        this._url = url;

        this.build();
        this.addToggleListener();
    };


    build() {
        this._target.empty();

        this._target.append('<iframe id="snow-iframe" src="' + this._url + '"></iframe>');

        this._iframeSelector = $("#snow-iframe");
        $("#sidebar-reports").addClass("snow-mode");
    };

    /**
     * Rebuild iframe with given url
     * @param url {string}
     */
    rebuild(url) {
        this._iframeSelector.attr("src", url);
    };

    /**
     * @returns {string} id of the iframe element
     */
    getElementId() {
        return this._iframeSelector.attr("id");
    };

    addToggleListener() {
        $("#sidebar-reports-toggle").on("click", function () {
            setTimeout(function () {
                Observer.notify("resizeMap");
            }, 500);
        });
    };
}

export default PanelIFrame;