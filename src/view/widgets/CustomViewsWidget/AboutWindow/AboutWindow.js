import S from 'string';

import Button from '../../../components/Button/Button';

import './AboutWindow.css';

let Config = window.Config;
let polyglot = window.polyglot;

/**
 * Build content of About window in dataviews intro overlay
 * @param options {Object}
 * @param options.target {Object} JQuery selector of parent element
 * @param options.onShowMapsClick {function}
 * @constructor
 */
class AboutWindow {
    constructor(options) {
        this._target = options.target;
        this.onShowMapsClick = options.onShowMapsClick;
        this.build();
    };

    build() {
        let logoClass = "logo-circle";
        let logoSource = "panther/panther_logo.png";
        let title = "Panther Data Exploration";
        let text = "";

        if (Config.toggles.intro) {
            let intro = Config.toggles.intro;
            if (intro.title) {
                title = intro.title;
            }
            if (intro.text) {
                text = intro.text;
            }
            if (intro.logo && intro.logo.type) {
                let type = intro.logo.type;
                if (type === 'rectangle') {
                    logoClass = "";
                } else if (type === 'wide_rectangle') {
                    logoClass = "logo-wide-rectangle";
                }
            }
            if (intro.logo && intro.logo.source) {
                logoSource = intro.logo.source;
            }
        }

        let html = S(`
        <div id="about-window">
            <div class="about-window-header">
                <h1 class="about-window-header-title">{{projectName}}</h1>
            </div>
            <div class="about-window-logo-wrapper">
                <div class="about-window-logo {{logoClass}}">
                    <img src="{{logoSource}}"/>
                </div>
            </div>
            <div class="about-window-text">
                <p>{{projectAbout}}</p>
            </div>
            <div class="about-window-footer">
        
            </div>
        </div>
        `).template({
            logoSource: "__new/img/" + logoSource,
            logoClass: logoClass,
            projectName: title,
            projectAbout: text
        }).toString();
        this._target.append(html);

        this._buttonContainerSelector = this._target.find(".about-window-footer");
        this.buildShowMapsButton();
    };

    buildShowMapsButton() {
        return new Button({
            id: 'show-maps',
            containerSelector: this._buttonContainerSelector,
            text: polyglot.t("showMaps"),
            title: polyglot.t("showMaps"),
            onClick: this.onShowMapsClick,
            textCentered: true,
            classes: 'w18 extra-large colored'
        });
    };
}

export default AboutWindow;