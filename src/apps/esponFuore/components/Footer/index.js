import esponLogoFull from "../../assets/img/espon-logo-full.png";
import gisatLogo from "../../assets/img/gisat-logo.png";
import uabLogo from "../../assets/img/UAB_logo.png";
import unigeLogo from "../../assets/img/UNIGE_logo.png";
import randbeeLogo from "../../assets/img/Randbee_logo.png";
import React from "react";

export default (props) => {
    return (
        <div className="esponFuore-landing-page-footer">
            <div>
                <a title="ESPON | espon.eu" href="https://espon.eu" target="_blank"><img src={esponLogoFull}/></a>
                <a title="GISAT | gisat.cz" href="http://gisat.cz/content/en" target="_blank"><img src={gisatLogo}/></a>
                <a title="Universitat Autònoma de Barcelona | uab.cat" href="https://www.uab.cat/en/" target="_blank"><img src={uabLogo}/></a>
                <a title="Université de Genève | unige.ch" href="https://www.unige.ch/gedt/en/home/gedt-presentation/" target="_blank"><img src={unigeLogo}/></a>
                <a title="Randbee Consultants: Data Science & Visualization | randbee.com" href="https://randbee.com/" target="_blank"><img src={randbeeLogo}/></a>
            </div>
        </div>
    );
}