
import S from 'string';

import './ChartDescription.css';

/**
 * Class representing chart description window
 * @param options {Object} Data about chart
 * @param icon {Object} JQuery selector of description icon in chart panel header
 * @constructor
 */
let $ = window.$;
class ChartDescription {
    constructor(options, icon) {
        this.id = options.id;
        this.name = options.name;
        this.description = options.description;
        this.type = options.type;
        this.active = options.active;
        this.icon = icon;

        this.render();
    };

    render() {
        let html = S(`
        <div class="floating-window info-window open active" id="{{id}}">
            <div class="info-window-header">
                <div class="info-window-title">{{name}}</div>
                <div class="info-window-tools-container">
                    <div title="Close" class="info-window-tool window-close">
                        &#x2715
                    </div>
                </div>
            </div>
            <div class="info-window-body">
                {{description}}
            </div>
        </div>
        `).template({
            id: "chart-description-" + this.id,
            name: this.name,
            description: this.description
        }).toString();

        $("body").append(html);
        this._descriptionSelector = $("#chart-description-" + this.id);

        this.addCloseButtonListener();
        this.addDragging();
    };

    rebuild() {
        if (this.active) {
            this._descriptionSelector.addClass("open active");
        } else {
            this._descriptionSelector.removeClass("open").removeClass("active");
        }
    };

    /**
     * Show description window
     */
    show() {
        this.active = true;
        this.rebuild();
    };

    /**
     * Hide description window
     */
    hide() {
        this.active = false;
        this.rebuild();
    };

    /**
     * Add listener to close button in window header
     */
    addCloseButtonListener() {
        let self = this;
        this._descriptionSelector.find(".window-close").off("click.close").on("click.close", function () {
            self.hide();
            self.icon.removeClass('tool-active');
        });
    };

    /**
     * Enable dragging of window
     */
    addDragging() {
        this._descriptionSelector.draggable({
            containment: "body",
            handle: ".info-window-header",
            stop: function (ev, ui) {
                let element = $(this);
                element.css({
                    width: "",
                    height: ""
                });
            }
        });
    };
}

export default ChartDescription;