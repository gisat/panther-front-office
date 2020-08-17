import React from "react";
import classnames from "classnames";
import "./style.scss";

export default (props) => {
    const classes = classnames("esponFuore-espon-header", {
        fixed: props.fixed
    });

    return (
        <div className={classes}>
            <div>
                <div className="esponFuore-espon-header-item">About</div>
                <div className="esponFuore-espon-header-item">Help</div>
                <a href="https://www.espon.eu/" target="_blank" rel="noreferrer noopener" className="esponFuore-espon-header-item">ESPON</a>
            </div>
        </div>
    );
}

