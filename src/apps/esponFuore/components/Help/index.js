import React from 'react';

import EsponHeader from "../EsponHeader";
import Footer from "../Footer";

import leaflet from "../../assets/docs/leaflet.pdf";
import manual from "../../assets/docs/manual.pdf";
import Icon from "../../../../components/common/atoms/Icon";

class Help extends React.PureComponent {
    render() {
        return (
            <>
                <EsponHeader fixed centered home/>
                <div className="esponFuore-about-page">
                    <div className="esponFuore-about-page-content">
                        <h1>Help</h1>
                        <a href={leaflet} target="_blank" rel="noopener noreferrer" className="esponFuore-help-downoad-item">
                            <div className="esponFuore-help-downoad-item-header">
                                <Icon icon="file-export"/> <span>Leaflet</span>
                            </div>
                            <div>The leaflet will give you a quick overview of the tool in a printable format.</div>
                        </a>
                        <a href={manual} target="_blank" rel="noopener noreferrer" className="esponFuore-help-downoad-item">
                            <div className="esponFuore-help-downoad-item-header">
                                <Icon icon="file-export"/> <span>User guide</span>
                            </div>
                            <div>If you want to know more about the tool and see practical examples please have a look at the user guide.</div>
                        </a>
                        <h2>Video tutorial</h2>
                        <iframe className="esponFuore-video-iframe" src="https://www.youtube.com/embed/atTsxTHPMr4" frameBorder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>
                    </div>
                    <Footer/>
                </div>
            </>
        );
    }
}

export default Help;

