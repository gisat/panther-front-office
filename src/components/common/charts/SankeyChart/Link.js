import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';

import '../style.scss';

import {Context} from "@gisatcz/ptr-core";
const HoverContext = Context.getContext('HoverContext');

class Link extends React.PureComponent {

    static contextType = HoverContext;

    static propTypes = {
        defaultColor: PropTypes.string,
        highlightedColor: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        highlighted: PropTypes.bool,
        itemKeys: PropTypes.array,
        strokeWidth: PropTypes.number,
        x0: PropTypes.number,
        x1: PropTypes.number,
        y0: PropTypes.number,
        y1: PropTypes.number,
        height: PropTypes.number,
        width: PropTypes.number,
        gradientLinks: PropTypes.bool,

        nameSourcePath: PropTypes.string,
        valueSourcePath: PropTypes.string,
        data: PropTypes.object,

        hoverValueSourcePath: PropTypes.string,
        yOptions: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);

        this.state = {
            color: props.defaultColor ? props.defaultColor : null,
            hidden: props.hidden
        }
    }

    onMouseMove(e) {
        if (this.context && this.context.onHover) {
            this.context.onHover(this.props.itemKeys, {
                popup: {
                    x: e.pageX,
                    y: e.pageY,
                    content: this.getPopupContent()
                }
            });
        }

        let color = null;
        if (this.props.highlightedColor) {
            color = this.props.highlightedColor;
        }

        //set highlighted

        this.setState({
            color,
            hidden: false
        });
    }

    onMouseOver(e) {
        if (this.context && this.context.onHover) {
            this.context.onHover(this.props.itemKeys, {
                popup: {
                    x: e.pageX,
                    y: e.pageY,
                    content: this.getPopupContent()
                }
            });
        }

        let color = null;
        if (this.props.highlightedColor) {
            color = this.props.highlightedColor;
        }

        this.setState({
            color,
            hidden: false
        });
    }

    onMouseOut(e) {
        if (this.context && this.context.onHoverOut) {
            this.context.onHoverOut();
        }

        let color = null;
        if (this.props.defaultColor) {
            color = this.props.defaultColor;
        }

        this.setState({
            color,
            hidden: this.props.hidden
        });
    }

    render() {
        const props = this.props;
        let style = {};
        let highlighted = false;

        if (this.context && this.context.hoveredItems) {
            highlighted = !!_.intersection(this.context.hoveredItems, this.props.itemKeys).length;
        }

        let classes = classnames("ptr-sankey-chart-link", {
            'ptr-sankey-chart-link-highlighted': highlighted
        });

        if (this.state.color) {
            style.fill = 'none';
			style.stroke = this.state.color
        }
        
        if (props.gradientLinks) {
            style.fill = 'none'
            // style.stroke = `url(#gradient_${this.props.itemKeys[0]})`
            style.stroke = `url(#gradient_link_1_9)`
        }
        // const width = Math.abs(props.x1 - props.x0);
        // const height = Math.abs(props.y1 - props.y0);

        let d = d3Sankey.sankeyLinkHorizontal();

        return (
            <g 
                onMouseOver={this.onMouseOver}
                onMouseMove={this.onMouseMove}
                onMouseOut={this.onMouseOut}>
                <path
                // FIX key
                    key={this.props.itemKeys[0]}
                    className={classes}
                    d={d(props.data)}
                    style={style}

                    strokeWidth={props.strokeWidth}
                    fill={'none'}
                    // strokeOpacity={0.5}
                    // stroke={'red'}
                    />
            </g>
        );
    }

    //TODO
    getPopupContent() {
        const props = this.props;
        let data = props.data;
        let content = null;
        let unit = null;
        let attributeName = null;


        if (data) {
            if (props.yOptions) {
                if (props.yOptions.name) {
                    attributeName = `${props.yOptions.name}: `;
                }

                if (props.yOptions.unit) {
                    unit = `${props.yOptions.unit}`;
                }
            }
            
            let defaultName = `${_.get(data, 'source.id')}->${_.get(data, 'target.id')}`;
            let name = defaultName;
            let nameSourcePath = _.get(data, this.props.nameSourcePath);
            if(this.props.nameSourcePath && nameSourcePath) {
                name = nameSourcePath;
            }
            let value = _.get(data, this.props.hoverValueSourcePath || this.props.valueSourcePath);
            content = (<div key={name}><i>{name}:</i> {value && value.toLocaleString()} {unit}</div>);
        } else {
            content = (<div key={"no-data"}><i>No data</i></div>);
        }

        return (
            <>
                {attributeName ? (<div><i>{attributeName}</i></div>) : null}
                {content}
            </>
        );
    }
}

export default Link;                        