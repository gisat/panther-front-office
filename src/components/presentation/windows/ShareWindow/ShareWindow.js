import React from 'react';
import PropTypes from 'prop-types';
import ScreenAnimator from "../../Deprecated_ScreenAnimator/Deprecated_ScreenAnimator";
import Window from "../../../containers/Window";
import ShareForm from "../../../containers/controls/share/ShareForm";

import './style.css';

let polyglot = window.polyglot;
class ShareWindow extends React.PureComponent{
    static propTypes = {
		onClose: PropTypes.func,
	};

    render() {
        const title = polyglot.t('share');

        return (
            <Window
                window="share"
                name={title}
                minWidth={400}
                width={400}
                floating={true}
                height={655}
                minHeight={655}
                elementId="share-window"
                expandable={false}
                dockable={false}
                onClose={this.props.onClose}
            >
                    <div className="ptr-views-list" >
                        <div className="ptr-views-list-content">
                            <ShareForm />
                        </div>
                    </div>
            </Window>
        );
    }
}

export default ShareWindow;