import React from "react";
import classnames from "classnames";
import "./style.scss";
import {NavLink} from "react-router-dom";

export default (props) => {
    const classes = classnames("esponFuore-espon-header", {
        fixed: props.fixed,
        centered: props.centered
    });

    return (
        <div className={classes}>
            <div>
                {props.home && <NavLink to="/" className="esponFuore-espon-header-item">Main page</NavLink>}
                <NavLink to="/about" className="esponFuore-espon-header-item">About</NavLink>
                <NavLink to="/help" className="esponFuore-espon-header-item">Help</NavLink>
                <a href="https://www.espon.eu/" target="_blank" rel="noreferrer noopener" className="esponFuore-espon-header-item">ESPON</a>
            </div>
        </div>
    );
}

