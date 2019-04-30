import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import './ViewsOverlay.css';
import ViewsList from "./ViewsList";

class UTEP extends React.PureComponent {

    static propTypes = {
        active: PropTypes.bool,
        open: PropTypes.bool,
        intro: PropTypes.object,
        selectScope: PropTypes.func,
        selectedScope: PropTypes.object,
        onMount: PropTypes.func,
        onUnmount: PropTypes.func
    };

    constructor(props){
        super(props);
        this.selectScope = this.selectScope.bind(this);
    }

    componentDidMount() {
        this.props.onMount();
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.scopes && nextProps.selectedScope){
            let scopes = _.flatten(_.values(nextProps.scopes));

            let selectedScope = _.find(scopes, (scope) => {
                return scope.key === nextProps.selectedScope.key
            });
            if (!selectedScope){
                this.selectScope(null);
            }
        }
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }


    selectScope(key){
        this.props.selectScope(key);
    }

    render() {
        let manage = this.props.currentUser ? this.renderManage(): null;
        let firstScope = this.props.scopes && this.props.scopes.length ? this.props.scopes[0][0] : null;
        let selectedScope = this.props.selectedScope ? this.props.selectedScope : (this.props.intro ? null : firstScope);
        let scopeKey = selectedScope ? selectedScope.key : null;
        let scopeClass = selectedScope && selectedScope.data && selectedScope.data.configuration && selectedScope.data.configuration.style || '';
        let scopes = this.renderScopes(selectedScope);

        return (
            <div className={scopeClass + ' views-inline'} style={{
                display: "flex",
                height: "calc(100%)"
            }}>
                <div className="scopes-list" style={{
                    marginTop: 0,
                    marginBottom: 0,
                    backgroundImage: "linear-gradient(160deg,#414551,#414551 40%,#6a6e78)"
                    }}>
                    {manage}
                    {scopes}
                </div>
                <div className="scope-box-views" style={{
                    width: "100%"
                }}>
                    <ViewsList
                        selectedScopeData={selectedScope && selectedScope.data}
                        scopeKey={scopeKey}
                    />
                </div>
            </div>
        );
    }

    renderScopes(selectedScope) {
        let groups = Object.keys(this.props.scopes);

        let containsUrbanTep = groups.indexOf('Urban TEP') !== -1;
        let containsEO4SD = groups.indexOf('EO4SD Urban') !== -1;
        let containsOthers = groups.indexOf('Other') !== -1;
        let otherGroups = groups.filter(group => {
            return group != "Urban TEP" && group != "Other" && group != "EO4SD Urban" && group != 0;
        });

        groups = [];
        if(containsUrbanTep) {
            groups.push("Urban TEP");
        }
        if(containsEO4SD) {
            groups.push("EO4SD Urban");
        }
        groups = groups.concat(otherGroups);
        if(containsOthers) {
            groups.push('Other');
        }

        return groups.map(group => {
            return (
                <div className="group">
                    <div className="group-title">{group}</div>
                    {this.props.scopes[group].map(scope => {
                        let classes = classNames("scopes-list-item", {
                            "active": selectedScope ? (scope.key === selectedScope.key) : false
                        });
                        return <div key={scope.key} className={classes} onClick={this.selectScope.bind(this, scope.key)}>{scope.data.name}</div>
                    })}
                </div>);
        });
    }

    renderManage() {
        let classes = classNames("scopes-list-item");
        return <div className={classes} ><a href="/puma/backoffice/">Manage My Applications</a></div>
    }
}

export default UTEP;
